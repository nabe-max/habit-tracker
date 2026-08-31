"use client";

import { BarChart3 } from "lucide-react";

import type { GeoScanResult } from "@/lib/geo/types";

function positionColor(position: number): string {
  if (position <= 2) return "text-emerald-600";
  if (position <= 4) return "text-amber-600";
  return "text-rose-600";
}

interface GeoCompetitorTableProps {
  result: GeoScanResult;
}

export function GeoCompetitorTable({ result }: GeoCompetitorTableProps) {
  if (result.positionRankings.length > 0) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="size-5 text-violet-600" />
          <h3 className="font-semibold text-slate-900">Visibility × Position 比較</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
                <th className="pb-3 pr-4 font-medium">ブランド</th>
                <th className="pb-3 pr-4 font-medium">Visibility</th>
                <th className="pb-3 font-medium">Position</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {result.positionRankings.map((entry) => (
                <tr key={entry.name}>
                  <td className="py-3 pr-4 font-medium text-slate-800">
                    {entry.name}
                    {entry.name === result.brandName ? (
                      <span className="ml-2 rounded bg-violet-100 px-1.5 py-0.5 text-xs text-violet-700">
                        自社
                      </span>
                    ) : null}
                  </td>
                  <td className="py-3 pr-4 tabular-nums text-slate-600">{entry.rate}%</td>
                  <td
                    className={`py-3 tabular-nums font-semibold ${
                      entry.avgPosition !== null
                        ? positionColor(entry.avgPosition)
                        : "text-slate-400"
                    }`}
                  >
                    {entry.avgPosition !== null ? `${entry.avgPosition} 位` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  if (result.competitorScores.length === 0) return null;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="mb-4 flex items-center gap-2">
        <BarChart3 className="size-5 text-violet-600" />
        <h3 className="font-semibold text-slate-900">競合との比較</h3>
      </div>
      <div className="space-y-3">
        {result.competitorScores.map((competitor) => (
          <div key={competitor.name}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">{competitor.name}</span>
              <span className="tabular-nums text-slate-500">{competitor.rate}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-violet-500"
                style={{ width: `${competitor.rate}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
