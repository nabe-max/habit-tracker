"use client";

import type { GeoScanResult } from "@/lib/geo/types";

function scoreColor(score: number): string {
  if (score >= 60) return "text-emerald-600";
  if (score >= 30) return "text-amber-600";
  return "text-rose-600";
}

function positionColor(position: number): string {
  if (position <= 2) return "text-emerald-600";
  if (position <= 4) return "text-amber-600";
  return "text-rose-600";
}

interface GeoOverviewSummaryProps {
  result: GeoScanResult;
}

export function GeoOverviewSummary({ result }: GeoOverviewSummaryProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Visibility</p>
        <p className={`mt-2 text-4xl font-bold tabular-nums ${scoreColor(result.visibilityScore)}`}>
          {result.visibilityScore}
          <span className="text-lg text-slate-400">/100</span>
        </p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Position</p>
        <p
          className={`mt-2 text-4xl font-bold tabular-nums ${
            result.positionScore !== null ? positionColor(result.positionScore) : "text-slate-400"
          }`}
        >
          {result.positionScore !== null ? result.positionScore : "—"}
          {result.positionScore !== null ? (
            <span className="text-lg text-slate-400"> 位</span>
          ) : null}
        </p>
        <p className="mt-1 text-sm text-slate-500">AI回答内の平均順位</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">言及率</p>
        <p className="mt-2 text-4xl font-bold tabular-nums text-slate-900">
          {result.mentionCount}
          <span className="text-lg text-slate-400">/{result.totalPrompts}</span>
        </p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">クライアント</p>
        <p className="mt-2 text-xl font-semibold text-slate-900">{result.brandName}</p>
        <p className="mt-1 text-sm text-slate-500">{result.clientCategory}</p>
      </div>
    </section>
  );
}
