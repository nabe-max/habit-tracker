"use client";

import type { GeoHistoryPoint } from "@/lib/geo/types";

interface GeoPositionChartProps {
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

function positionColor(position: number): string {
  if (position <= 2) return "#059669";
  if (position <= 4) return "#d97706";
  return "#e11d48";
}

export function GeoPositionChart({
  brandName,
  runs,
  weekOverWeekDelta,
}: GeoPositionChartProps) {
  const pointsWithPosition = runs
    .filter((run) => run.positionScore !== null)
    .sort((a, b) => new Date(a.scannedAt).getTime() - new Date(b.scannedAt).getTime());

  const latest = pointsWithPosition[pointsWithPosition.length - 1];

  if (!latest || latest.positionScore === null) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Position（順位）</p>
        <p className="mt-2 text-sm text-slate-400">
          競合を登録してスキャンすると、AI回答内の順位が表示されます
        </p>
      </div>
    );
  }

  const plotWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const plotHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

  const yMax = Math.max(
    ...pointsWithPosition.map((run) => run.positionScore ?? 1),
    5,
  );

  const chartPoints = pointsWithPosition.map((run, index) => {
    const x =
      pointsWithPosition.length === 1
        ? PADDING.left + plotWidth / 2
        : PADDING.left + (index / (pointsWithPosition.length - 1)) * plotWidth;
    const score = run.positionScore ?? yMax;
    const y = PADDING.top + ((score - 1) / Math.max(yMax - 1, 1)) * plotHeight;
    return { x, y, run, score };
  });

  const linePath = chartPoints
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const gridSteps = Math.min(Math.ceil(yMax), 5);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">Position（順位）</p>
          <p className="mt-1 text-3xl font-bold tabular-nums text-slate-900">
            {latest.positionScore}
            <span className="text-lg font-semibold text-slate-400"> 位</span>
          </p>
          <p className="mt-1 text-sm text-slate-500">{brandName} · 低いほど上位</p>
        </div>
        {weekOverWeekDelta !== null ? (
          <div
            className={`rounded-xl px-4 py-2 text-sm font-medium ${
              weekOverWeekDelta <= 0
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            前回比 {weekOverWeekDelta > 0 ? "+" : ""}
            {weekOverWeekDelta}位
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
          aria-label={`${brandName}のPosition推移`}
        >
          <defs>
            <linearGradient id="geoPositionFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#0d9488" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#0d9488" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {Array.from({ length: gridSteps }, (_, index) => {
            const value = index + 1;
            const y = PADDING.top + ((value - 1) / Math.max(yMax - 1, 1)) * plotHeight;
            return (
              <g key={value}>
                <line
                  x1={PADDING.left}
                  x2={CHART_WIDTH - PADDING.right}
                  y1={y}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray={value === 1 ? undefined : "4 4"}
                />
                <text
                  x={PADDING.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-slate-400 text-[10px]"
                >
                  {value}位
                </text>
              </g>
            );
          })}

          {chartPoints.length > 1 ? (
            <>
              <path
                d={`${linePath} L ${chartPoints[chartPoints.length - 1].x} ${PADDING.top + plotHeight} L ${chartPoints[0].x} ${PADDING.top + plotHeight} Z`}
                fill="url(#geoPositionFill)"
              />
              <path
                d={linePath}
                fill="none"
                stroke="#0d9488"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          ) : null}

          {chartPoints.map(({ x, y, run, score }) => (
            <g key={run.id}>
              <circle cx={x} cy={y} r={5} fill="white" stroke={positionColor(score)} strokeWidth={2.5} />
              <title>
                {formatAxisDate(run.scannedAt)}: {score}位
              </title>
            </g>
          ))}

          {chartPoints.map(({ x, run }) => (
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

      {pointsWithPosition.length === 1 ? (
        <p className="mt-3 text-center text-xs text-slate-500">
          週次スキャンが溜まると、Position の推移グラフになります
        </p>
      ) : null}
    </div>
  );
}
