"use client";

import { ArrowRight, TrendingUp, Users } from "lucide-react";

import { GeoCompetitorTable } from "@/components/geo/GeoCompetitorTable";
import { GeoOverviewSummary } from "@/components/geo/GeoOverviewSummary";
import { GeoPromptsTable } from "@/components/geo/GeoPromptsTable";
import { filterSuggestedCompetitors } from "@/lib/geo/competitors";
import type { GeoScanResult } from "@/lib/geo/types";

interface GeoScanResultsProps {
  result: GeoScanResult;
  compact?: boolean;
}

export function GeoScanResults({ result, compact = false }: GeoScanResultsProps) {
  const suggestedCompetitors = filterSuggestedCompetitors(result.suggestedCompetitors ?? []);

  return (
    <div className="space-y-6">
      <GeoOverviewSummary result={result} />

      {!compact && suggestedCompetitors.length > 0 ? (
        <section className="rounded-xl border border-amber-100 bg-amber-50/40 p-6">
          <div className="mb-4 flex items-center gap-2">
            <Users className="size-5 text-amber-600" />
            <h3 className="font-semibold text-slate-900">Suggested Brands</h3>
          </div>
          <p className="mb-4 text-sm text-slate-600">
            自社と2回以上一緒に言及されたブランドです。毎日監視を開始すると Track / Reject できます。
          </p>
          <div className="space-y-2">
            {suggestedCompetitors.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-lg bg-white px-4 py-3 ring-1 ring-amber-100"
              >
                <span className="font-medium text-slate-900">{item.name}</span>
                <span className="text-sm text-slate-500">{item.mentionCount}回 共起</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {!compact ? <GeoCompetitorTable result={result} /> : null}

      {!compact && result.recommendations.length > 0 ? (
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="size-5 text-violet-600" />
            <h3 className="font-semibold text-slate-900">改善アクション</h3>
          </div>
          <ul className="space-y-3">
            {result.recommendations.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-lg bg-violet-50 px-4 py-3 text-sm text-slate-700"
              >
                <ArrowRight className="mt-0.5 size-4 shrink-0 text-violet-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <GeoPromptsTable result={result} />
    </div>
  );
}
