"use client";

import { useEffect, useState } from "react";
import { CalendarClock, Loader2, TrendingDown, TrendingUp } from "lucide-react";

import type { GeoHistoryResponse, GeoMonitorClient } from "@/lib/geo/types";

import { GeoVisibilityChart } from "@/components/geo/GeoVisibilityChart";

const STORAGE_KEY = "geo_monitor_clients";

export function loadMonitorClients(): GeoMonitorClient[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as GeoMonitorClient[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveMonitorClient(client: GeoMonitorClient): void {
  const existing = loadMonitorClients().filter((item) => item.brandId !== client.brandId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([client, ...existing]));
}

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

interface GeoMonitorHistoryProps {
  client: GeoMonitorClient;
  onLatestResult?: (result: GeoHistoryResponse["latestResult"]) => void;
}

export function GeoMonitorHistory({ client, onLatestResult }: GeoMonitorHistoryProps) {
  const [history, setHistory] = useState<GeoHistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/geo/history/${client.brandId}?token=${encodeURIComponent(client.viewToken)}`,
        );
        const data = (await res.json()) as GeoHistoryResponse & { error?: string };
        if (!res.ok) {
          throw new Error(data.error ?? "履歴の取得に失敗しました");
        }
        if (!cancelled) {
          setHistory(data);
          onLatestResult?.(data.latestResult);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "履歴の取得に失敗しました");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [client.brandId, client.viewToken, onLatestResult]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        <Loader2 className="size-4 animate-spin" />
        監視履歴を読み込み中…
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

  if (!history || history.runs.length === 0) {
    return null;
  }

  const maxScore = Math.max(...history.runs.map((run) => run.visibilityScore), 100);

  return (
    <div className="space-y-6">
      <GeoVisibilityChart
        brandName={client.brandName}
        runs={history.runs}
        weekOverWeekDelta={history.weekOverWeekDelta}
      />

    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CalendarClock className="size-5 text-violet-600" />
          <div>
            <h3 className="font-semibold text-slate-900">プロンプト監視履歴</h3>
            <p className="text-sm text-slate-500">{client.brandName} — 週次自動スキャン</p>
          </div>
        </div>
        {history.weekOverWeekDelta !== null ? (
          <div
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${
              history.weekOverWeekDelta >= 0
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {history.weekOverWeekDelta >= 0 ? (
              <TrendingUp className="size-4" />
            ) : (
              <TrendingDown className="size-4" />
            )}
            前回比 {history.weekOverWeekDelta >= 0 ? "+" : ""}
            {history.weekOverWeekDelta}pt
          </div>
        ) : null}
      </div>

      <div className="space-y-3">
        {history.runs.map((run, index) => (
          <div key={run.id} className="flex items-center gap-4">
            <div className="w-28 shrink-0 text-xs text-slate-500">
              {formatDate(run.scannedAt)}
              {index === 0 ? (
                <span className="ml-1 rounded bg-violet-100 px-1.5 py-0.5 text-violet-700">
                  最新
                </span>
              ) : null}
            </div>
            <div className="flex-1">
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className={`font-semibold ${scoreColor(run.visibilityScore)}`}>
                  {run.visibilityScore}/100
                </span>
                <span className="text-slate-500">
                  {run.mentionCount}/{run.totalPrompts} 言及
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-violet-500 transition-all"
                  style={{ width: `${(run.visibilityScore / maxScore) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
    </div>
  );
}

interface GeoMonitorListProps {
  activeBrandId?: string | null;
  onSelect?: (client: GeoMonitorClient) => void;
}

export function GeoMonitorList({ activeBrandId, onSelect }: GeoMonitorListProps) {
  const [clients, setClients] = useState<GeoMonitorClient[]>([]);

  useEffect(() => {
    setClients(loadMonitorClients());
  }, []);

  if (clients.length === 0) return null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 font-semibold text-slate-900">監視中クライアント</h3>
      <div className="flex flex-wrap gap-2">
        {clients.map((client) => (
          <button
            key={client.brandId}
            type="button"
            onClick={() => onSelect?.(client)}
            className={`rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
              activeBrandId === client.brandId
                ? "border-violet-400 bg-violet-50 text-violet-800"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            <span className="font-medium">{client.brandName}</span>
            <span className="mt-0.5 block text-xs text-slate-500">{client.clientCategory}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
