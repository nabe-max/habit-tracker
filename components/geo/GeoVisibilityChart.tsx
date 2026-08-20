"use client";

import type { GeoHistoryPoint } from "@/lib/geo/types";

interface GeoVisibilityChartProps {
  brandName: string;
  runs: GeoHistoryPoint[];
  weekOverWeekDelta: number | null;
}

const CHART_WIDTH = 640;
const CHART_HEIGHT = 220;
const PADDING = { top: 16, right: 16, bottom: 36, left: 40 };

function formatAxisDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ja-JP", { month: "short", day: "numeric" });
}

function scoreStroke(score: number): string {
  if (score >= 60) return "#059669";
  if (score >= 30) return "#d97706";
  return "#e11d48";
}

export function GeoVisibilityChart({
  brandName,
  runs,
  weekOverWeekDelta,
}: GeoVisibilityChartProps) {
  const sorted = [...runs].sort(
    (a, b) => new Date(a.scannedAt).getTime() - new Date(b.scannedAt).getTime(),
  );

  const latest = sorted[sorted.length - 1];
  if (!latest) return null;

  const plotWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const plotHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

  const points = sorted.map((run, index) => {
    const x =
      sorted.length === 1
        ? PADDING.left + plotWidth / 2
        : PADDING.left + (index / (sorted.length - 1)) * plotWidth;
    const y = PADDING.top + plotHeight - (run.visibilityScore / 100) * plotHeight;
    return { x, y, run };
  });

  const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");

  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x} ${PADDING.top + plotHeight} L ${points[0].x} ${PADDING.top + plotHeight} Z`
      : "";

  const gridLines = [0, 25, 50, 75, 100];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">AI可視性（Visibility）</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">
            {latest.visibilityScore}
            <span className="text-lg font-semibold text-slate-400">/100</span>
          </p>
          <p className="mt-1 text-sm text-slate-500">{brandName}</p>
        </div>
        {weekOverWeekDelta !== null ? (
          <div
            className={`rounded-xl px-4 py-2 text-sm font-medium ${
              weekOverWeekDelta >= 0
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            前回比 {weekOverWeekDelta >= 0 ? "+" : ""}
            {weekOverWeekDelta}pt
          </div>
        ) : (
          <div className="rounded-xl bg-slate-50 px-4 py-2 text-sm text-slate-500">
            次回スキャンで推移が表示されます
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          className="h-auto w-full min-w-[320px]"
          role="img"
          aria-label={`${brandName}の可視性スコア推移`}
        >
          <defs>
            <linearGradient id="geoVisibilityFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {gridLines.map((value) => {
            const y = PADDING.top + plotHeight - (value / 100) * plotHeight;
            return (
              <g key={value}>
                <line
                  x1={PADDING.left}
                  x2={CHART_WIDTH - PADDING.right}
                  y1={y}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray={value === 0 ? undefined : "4 4"}
                />
                <text
                  x={PADDING.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-slate-400 text-[10px]"
                >
                  {value}
                </text>
              </g>
            );
          })}

          {areaPath ? <path d={areaPath} fill="url(#geoVisibilityFill)" /> : null}

          {points.length > 1 ? (
            <path
              d={linePath}
              fill="none"
              stroke="#7c3aed"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}

          {points.map(({ x, y, run }) => (
            <g key={run.id}>
              <circle cx={x} cy={y} r={5} fill="white" stroke={scoreStroke(run.visibilityScore)} strokeWidth={2.5} />
              <title>
                {formatAxisDate(run.scannedAt)}: {run.visibilityScore}/100（{run.mentionCount}/
                {run.totalPrompts} 言及）
              </title>
            </g>
          ))}

          {points.map(({ x, run }) => (
            <text
              key={`${run.id}-label`}
              x={x}
              y={CHART_HEIGHT - 10}
              textAnchor="middle"
              className="fill-slate-500 text-[10px]"
            >
              {formatAxisDate(run.scannedAt)}
            </text>
          ))}
        </svg>
      </div>

      {sorted.length === 1 ? (
        <p className="mt-3 text-center text-xs text-slate-500">
          週次スキャンが溜まると、Peec AI のような推移グラフになります
        </p>
      ) : null}
    </div>
  );
}
