"use client";

import { CalendarClock } from "lucide-react";

import { GeoClientShell, GeoNoScanData } from "@/components/geo/GeoClientShell";
import { GeoCompetitorSuggestions } from "@/components/geo/GeoCompetitorSuggestions";
import { GeoCompetitorTable } from "@/components/geo/GeoCompetitorTable";
import { GeoMetricsChart } from "@/components/geo/GeoMetricsChart";
import { GeoOverviewSummary } from "@/components/geo/GeoOverviewSummary";
import { useGeoHistory } from "@/components/geo/useGeoHistory";
import type { GeoMonitorClient } from "@/lib/geo/types";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ja-JP", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function scoreColor(score: number): string {
  if (score >= 60) return "text-emerald-600";
  if (score >= 30) return "text-amber-600";
  return "text-rose-600";
}

interface GeoDashboardProps {
  client: GeoMonitorClient | null;
  onGoToScan: () => void;
}

export function GeoDashboard({ client, onGoToScan }: GeoDashboardProps) {
  const { history, loading, error, reload } = useGeoHistory(client);

  return (
    <GeoClientShell client={client} loading={loading} error={error} onGoToScan={onGoToScan}>
      {() => {
        if (!history?.latestResult) {
          return <GeoNoScanData />;
        }

        const maxScore = Math.max(...history.runs.map((run) => run.visibilityScore), 100);

        return (
          <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-violet-600">概要</p>
                <h2 className="text-2xl font-bold text-slate-900">{client!.brandName}</h2>
                <p className="text-sm text-slate-500">
                  {client!.clientCategory} · 週次プロンプト監視
                </p>
              </div>
              {history.latestResult.scannedAt ? (
                <p className="text-xs text-slate-400">
                  最終スキャン: {formatDate(history.latestResult.scannedAt)}
                </p>
              ) : null}
            </div>

            <GeoOverviewSummary result={history.latestResult} />

            <GeoMetricsChart
              brandName={client!.brandName}
              trackedCompetitors={history.trackedCompetitors}
              runs={history.runs}
              weekOverWeekDelta={history.weekOverWeekDelta}
              positionWeekOverWeekDelta={history.positionWeekOverWeekDelta}
            />

            <GeoCompetitorSuggestions
              client={client!}
              onCompetitorsUpdated={() => reload()}
            />

            <GeoCompetitorTable result={history.latestResult} />

            {history.runs.length > 1 ? (
              <section className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="mb-4 flex items-center gap-2">
                  <CalendarClock className="size-5 text-violet-600" />
                  <h3 className="font-semibold text-slate-900">スキャン履歴</h3>
                </div>
                <div className="space-y-3">
                  {history.runs.map((run, index) => (
                    <div key={run.id} className="flex items-center gap-4">
                      <div className="w-32 shrink-0 text-xs text-slate-500">
                        {formatDate(run.scannedAt)}
                        {index === 0 ? (
                          <span className="ml-1 rounded bg-violet-100 px-1.5 py-0.5 text-violet-700">
                            最新
                          </span>
                        ) : null}
                      </div>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span
                            className={`font-semibold tabular-nums ${scoreColor(run.visibilityScore)}`}
                          >
                            {run.visibilityScore}/100
                          </span>
                          <span className="text-slate-500">
                            Vis {run.visibilityScore}
                            {run.positionScore !== null ? ` · Pos ${run.positionScore}位` : ""}
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-violet-500"
                            style={{ width: `${(run.visibilityScore / maxScore) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        );
      }}
    </GeoClientShell>
  );
}
