"use client";

import { ArrowRight, TrendingUp } from "lucide-react";

import { GeoClientShell, GeoNoScanData } from "@/components/geo/GeoClientShell";
import { GeoPromptsTable } from "@/components/geo/GeoPromptsTable";
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

interface GeoPromptsPanelProps {
  client: GeoMonitorClient | null;
  onGoToScan: () => void;
}

export function GeoPromptsPanel({ client, onGoToScan }: GeoPromptsPanelProps) {
  const { history, loading, error } = useGeoHistory(client);

  return (
    <GeoClientShell client={client} loading={loading} error={error} onGoToScan={onGoToScan}>
      {() => {
        if (!history?.latestResult) {
          return <GeoNoScanData />;
        }

        const result = history.latestResult;

        return (
          <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-violet-600">プロンプト</p>
                <h2 className="text-2xl font-bold text-slate-900">{client!.brandName}</h2>
                <p className="text-sm text-slate-500">
                  {result.totalPrompts}件の監視プロンプト · ChatGPT回答を週次チェック
                </p>
              </div>
              {result.scannedAt ? (
                <p className="text-xs text-slate-400">
                  最終スキャン: {formatDate(result.scannedAt)}
                </p>
              ) : null}
            </div>

            <GeoPromptsTable result={result} />

            {result.recommendations.length > 0 ? (
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

            <section className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-center">
              <p className="text-sm font-medium text-slate-700">独自プロンプトの追加</p>
              <p className="mt-1 text-sm text-slate-500">
                カスタムプロンプトは近日対応予定です。現在は業種・エリアに合わせた6件を自動監視しています。
              </p>
            </section>
          </div>
        );
      }}
    </GeoClientShell>
  );
}
