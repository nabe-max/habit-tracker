"use client";

import { useMemo, useState } from "react";

import type { GeoHistoryPoint, GeoPositionRanking, GeoTrackedCompetitor } from "@/lib/geo/types";
import { getTrackedNames, resolveDisplayName } from "@/lib/geo/competitors";
import { namesMatch } from "@/lib/geo/scoring";

type Metric = "visibility" | "position";

interface GeoMetricsChartProps {
  brandName: string;
  trackedCompetitors: GeoTrackedCompetitor[];
  runs: GeoHistoryPoint[];
  weekOverWeekDelta: number | null;
  positionWeekOverWeekDelta: number | null;
}

interface ChartSeries {
  name: string;
  isClient: boolean;
  color: string;
  values: Array<number | null>;
}

const CHART_WIDTH = 720;
const CHART_HEIGHT = 260;
const PADDING = { top: 20, right: 20, bottom: 40, left: 44 };

const SERIES_COLORS = [
  "#7c3aed",
  "#0ea5e9",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#6366f1",
];

function formatAxisDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ja-JP", { month: "short", day: "numeric" });
}

function findRanking(rankings: GeoPositionRanking[], name: string): GeoPositionRanking | undefined {
  return rankings.find((entry) => namesMatch(entry.name, name));
}

function getValueForBrand(
  run: GeoHistoryPoint,
  brandName: string,
  clientName: string,
  metric: Metric,
): number | null {
  const ranking = findRanking(run.positionRankings, brandName);

  if (metric === "visibility") {
    if (namesMatch(brandName, clientName)) {
      return run.visibilityScore;
    }
    return ranking?.rate ?? null;
  }

  if (namesMatch(brandName, clientName)) {
    return run.positionScore;
  }
  return ranking?.avgPosition ?? null;
}

function buildBrandList(
  brandName: string,
  trackedCompetitors: GeoTrackedCompetitor[],
  runs: GeoHistoryPoint[],
): string[] {
  const latest = runs[runs.length - 1];
  const names = new Set<string>([brandName, ...getTrackedNames(trackedCompetitors)]);

  for (const run of runs) {
    for (const entry of run.positionRankings) {
      names.add(entry.name);
    }
  }

  const others = [...names].filter((name) => !namesMatch(name, brandName));

  if (latest) {
    others.sort((a, b) => {
      const aRate = findRanking(latest.positionRankings, a)?.rate ?? 0;
      const bRate = findRanking(latest.positionRankings, b)?.rate ?? 0;
      return bRate - aRate;
    });
  }

  return [brandName, ...others.slice(0, 5)];
}

function buildSeries(
  brandName: string,
  trackedCompetitors: GeoTrackedCompetitor[],
  runs: GeoHistoryPoint[],
  metric: Metric,
): ChartSeries[] {
  const sorted = [...runs].sort(
    (a, b) => new Date(a.scannedAt).getTime() - new Date(b.scannedAt).getTime(),
  );
  const brands = buildBrandList(brandName, trackedCompetitors, sorted);

  return brands.map((name, index) => ({
    name: namesMatch(name, brandName) ? brandName : resolveDisplayName(name, trackedCompetitors),
    isClient: namesMatch(name, brandName),
    color: SERIES_COLORS[index % SERIES_COLORS.length],
    values: sorted.map((run) => getValueForBrand(run, name, brandName, metric)),
  }));
}

function getLatestSnapshot(
  brandName: string,
  trackedCompetitors: GeoTrackedCompetitor[],
  runs: GeoHistoryPoint[],
) {
  const latest = runs[runs.length - 1];
  if (!latest) return [];

  return buildBrandList(brandName, trackedCompetitors, runs).map((name) => {
    const ranking = findRanking(latest.positionRankings, name);
    const isClient = namesMatch(name, brandName);

    return {
      name: isClient ? brandName : resolveDisplayName(name, trackedCompetitors),
      isClient,
      visibility: isClient ? latest.visibilityScore : (ranking?.rate ?? null),
      position: isClient ? latest.positionScore : (ranking?.avgPosition ?? null),
    };
  });
}

export function GeoMetricsChart({
  brandName,
  trackedCompetitors,
  runs,
  weekOverWeekDelta,
  positionWeekOverWeekDelta,
}: GeoMetricsChartProps) {
  const [metric, setMetric] = useState<Metric>("visibility");

  const sortedRuns = useMemo(
    () => [...runs].sort((a, b) => new Date(a.scannedAt).getTime() - new Date(b.scannedAt).getTime()),
    [runs],
  );

  const series = useMemo(
    () => buildSeries(brandName, trackedCompetitors, runs, metric),
    [brandName, trackedCompetitors, runs, metric],
  );

  const snapshot = useMemo(
    () => getLatestSnapshot(brandName, trackedCompetitors, runs),
    [brandName, trackedCompetitors, runs],
  );

  const latest = sortedRuns[sortedRuns.length - 1];
  if (!latest) return null;

  const plotWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const plotHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

  const numericValues = series.flatMap((item) => item.values).filter((v): v is number => v !== null);

  const yMax =
    metric === "visibility"
      ? 100
      : Math.max(...numericValues, 5);

  const yMin = metric === "visibility" ? 0 : 1;

  function valueToY(value: number): number {
    if (metric === "visibility") {
      return PADDING.top + plotHeight - (value / 100) * plotHeight;
    }
    return PADDING.top + ((value - yMin) / Math.max(yMax - yMin, 1)) * plotHeight;
  }

  function xForIndex(index: number): number {
    if (sortedRuns.length === 1) return PADDING.left + plotWidth / 2;
    return PADDING.left + (index / (sortedRuns.length - 1)) * plotWidth;
  }

  const gridLines =
    metric === "visibility"
      ? [0, 25, 50, 75, 100]
      : Array.from({ length: Math.min(Math.ceil(yMax), 5) }, (_, i) => i + 1);

  const clientSeries = series.find((item) => item.isClient);
  const latestClientValue = clientSeries?.values[clientSeries.values.length - 1] ?? null;
  const delta = metric === "visibility" ? weekOverWeekDelta : positionWeekOverWeekDelta;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="inline-flex rounded-lg bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setMetric("visibility")}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                metric === "visibility"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Visibility
            </button>
            <button
              type="button"
              onClick={() => setMetric("position")}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                metric === "position"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Position
            </button>
          </div>
          <p className="mt-3 text-3xl font-bold tabular-nums text-slate-900">
            {latestClientValue !== null ? (
              <>
                {latestClientValue}
                <span className="text-lg font-semibold text-slate-400">
                  {metric === "visibility" ? "/100" : " 位"}
                </span>
              </>
            ) : (
              <span className="text-slate-400">—</span>
            )}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {brandName}
            {metric === "position" ? " · 低いほど上位" : ""}
          </p>
        </div>

        {delta !== null ? (
          <div
            className={`rounded-xl px-4 py-2 text-sm font-medium ${
              metric === "visibility"
                ? delta >= 0
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-rose-700"
                : delta <= 0
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-rose-700"
            }`}
          >
            前回比 {delta > 0 ? "+" : ""}
            {delta}
            {metric === "visibility" ? "pt" : "位"}
          </div>
        ) : (
          <div className="rounded-xl bg-slate-50 px-4 py-2 text-sm text-slate-500">
            次回スキャンで推移が表示されます
          </div>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_240px]">
        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            className="h-auto w-full min-w-[320px]"
            role="img"
            aria-label={`${brandName}の${metric === "visibility" ? "Visibility" : "Position"}推移`}
          >
            {gridLines.map((value) => {
              const y = valueToY(value);
              return (
                <g key={value}>
                  <line
                    x1={PADDING.left}
                    x2={CHART_WIDTH - PADDING.right}
                    y1={y}
                    y2={y}
                    stroke="#e2e8f0"
                    strokeDasharray={value === (metric === "visibility" ? 0 : 1) ? undefined : "4 4"}
                  />
                  <text
                    x={PADDING.left - 8}
                    y={y + 4}
                    textAnchor="end"
                    className="fill-slate-400 text-[10px]"
                  >
                    {metric === "visibility" ? value : `${value}位`}
                  </text>
                </g>
              );
            })}

            {series.map((item) => {
              const segments: string[] = [];
              let current: string[] = [];

              item.values.forEach((value, index) => {
                if (value === null) {
                  if (current.length > 0) {
                    segments.push(current.join(" "));
                    current = [];
                  }
                  return;
                }

                const x = xForIndex(index);
                const y = valueToY(value);
                current.push(`${current.length === 0 ? "M" : "L"} ${x} ${y}`);
              });

              if (current.length > 0) segments.push(current.join(" "));

              return (
                <g key={item.name}>
                  {segments.map((path) => (
                    <path
                      key={path}
                      d={path}
                      fill="none"
                      stroke={item.color}
                      strokeWidth={item.isClient ? 3 : 2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={item.isClient ? 1 : 0.85}
                    />
                  ))}
                  {item.values.map((value, index) => {
                    if (value === null) return null;
                    const x = xForIndex(index);
                    const y = valueToY(value);
                    return (
                      <circle
                        key={`${item.name}-${sortedRuns[index]?.id}`}
                        cx={x}
                        cy={y}
                        r={item.isClient ? 4.5 : 3.5}
                        fill="white"
                        stroke={item.color}
                        strokeWidth={item.isClient ? 2.5 : 2}
                      >
                        <title>
                          {item.name}: {formatAxisDate(sortedRuns[index].scannedAt)} = {value}
                          {metric === "visibility" ? "%" : "位"}
                        </title>
                      </circle>
                    );
                  })}
                </g>
              );
            })}

            {sortedRuns.map((run, index) => (
              <text
                key={run.id}
                x={xForIndex(index)}
                y={CHART_HEIGHT - 12}
                textAnchor="middle"
                className="fill-slate-500 text-[10px]"
              >
                {formatAxisDate(run.scannedAt)}
              </text>
            ))}
          </svg>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            {brandName} の競合
          </p>
          <div className="space-y-2">
            {snapshot.map((row) => (
              <div key={row.name} className="rounded-lg bg-white px-3 py-2 ring-1 ring-slate-100">
                <div className="flex items-center gap-2">
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{
                      backgroundColor:
                        SERIES_COLORS[
                          series.findIndex((item) => namesMatch(item.name, row.name))
                        ] ?? SERIES_COLORS[0],
                    }}
                  />
                  <p className="truncate text-sm font-medium text-slate-800">
                    {row.name}
                    {row.isClient ? (
                      <span className="ml-1 text-xs text-violet-600">自社</span>
                    ) : null}
                  </p>
                </div>
                <div className="mt-1 flex gap-3 text-xs tabular-nums text-slate-500">
                  <span>Vis {row.visibility ?? "—"}%</span>
                  <span>Pos {row.position ?? "—"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-4">
        {series.map((item) => (
          <div key={item.name} className="flex items-center gap-2 text-sm text-slate-600">
            <span
              className="inline-block h-0.5 w-5 rounded-full"
              style={{ backgroundColor: item.color, height: item.isClient ? 3 : 2 }}
            />
            <span className={item.isClient ? "font-semibold text-slate-900" : undefined}>{item.name}</span>
          </div>
        ))}
      </div>

      {sortedRuns.length === 1 ? (
        <p className="mt-3 text-center text-xs text-slate-500">
          競合を Track して毎日スキャンが溜まると、Peec AI のような比較グラフになります
        </p>
      ) : null}
    </div>
  );
}
