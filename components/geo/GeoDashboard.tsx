"use client";

import { useCallback, useEffect, useState } from "react";
import { CalendarClock, LayoutDashboard, Loader2 } from "lucide-react";

import { GeoScanResults } from "@/components/geo/GeoScanResults";
import { GeoVisibilityChart } from "@/components/geo/GeoVisibilityChart";
import type { GeoHistoryResponse, GeoMonitorClient } from "@/lib/geo/types";

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
  const [history, setHistory] = useState<GeoHistoryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async (active: GeoMonitorClient) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/geo/history/${active.brandId}?token=${encodeURIComponent(active.viewToken)}`,
      );
      const data = (await res.json()) as GeoHistoryResponse & { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "履歴の取得に失敗しました");
      }
      setHistory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "履歴の取得に失敗しました");
      setHistory(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!client) {
      setHistory(null);
      setError(null);
      return;
    }
    void loadHistory(client);
  }, [client, loadHistory]);

  if (!client) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
        <LayoutDashboard className="size-10 text-slate-300" />
        <h2 className="mt-4 text-lg font-semibold text-slate-900">クライアントを選択してください</h2>
        <p className="mt-2 max-w-md text-sm text-slate-500">
          左のサイドバーから監視中クライアントを選ぶか、「新規診断」タブで週次監視を開始してください。
        </p>
        <button
          type="button"
          onClick={onGoToScan}
          className="mt-6 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
        >
          新規診断へ
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
        <Loader2 className="size-6 animate-spin text-violet-600" />
        <span className="ml-3 text-sm text-slate-500">ダッシュボードを読み込み中…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
        {error}
      </div>
    );
  }

  if (!history?.latestResult) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        スキャン結果がありません。週次cronまたは新規診断でデータが追加されます。
      </div>
    );
  }

  const maxScore = Math.max(...history.runs.map((run) => run.visibilityScore), 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-violet-600">Overview</p>
          <h2 className="text-2xl font-bold text-slate-900">{client.brandName}</h2>
          <p className="text-sm text-slate-500">{client.clientCategory} · 週次プロンプト監視</p>
        </div>
        {history.latestResult.scannedAt ? (
          <p className="text-xs text-slate-400">
            最終スキャン: {formatDate(history.latestResult.scannedAt)}
          </p>
        ) : null}
      </div>

      <GeoVisibilityChart
        brandName={client.brandName}
        runs={history.runs}
        weekOverWeekDelta={history.weekOverWeekDelta}
      />

      <GeoScanResults result={history.latestResult} />

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
                    <span className={`font-semibold tabular-nums ${scoreColor(run.visibilityScore)}`}>
                      {run.visibilityScore}/100
                    </span>
                    <span className="text-slate-500">
                      {run.mentionCount}/{run.totalPrompts} 言及
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
}
