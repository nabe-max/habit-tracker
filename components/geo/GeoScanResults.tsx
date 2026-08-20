"use client";

import { ArrowRight, BarChart3, TrendingUp } from "lucide-react";

import type { GeoScanResult } from "@/lib/geo/types";

function scoreColor(score: number): string {
  if (score >= 60) return "text-emerald-600";
  if (score >= 30) return "text-amber-600";
  return "text-rose-600";
}

function sentimentLabel(sentiment: GeoScanResult["promptResults"][number]["sentiment"]): string {
  switch (sentiment) {
    case "positive":
      return "ポジティブ";
    case "negative":
      return "ネガティブ";
    case "neutral":
      return "中立";
    default:
      return "言及なし";
  }
}

interface GeoScanResultsProps {
  result: GeoScanResult;
  compact?: boolean;
}

export function GeoScanResults({ result, compact = false }: GeoScanResultsProps) {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Visibility</p>
          <p className={`mt-2 text-4xl font-bold tabular-nums ${scoreColor(result.visibilityScore)}`}>
            {result.visibilityScore}
            <span className="text-lg text-slate-400">/100</span>
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">言及率</p>
          <p className="mt-2 text-4xl font-bold tabular-nums text-slate-900">
            {result.mentionCount}
            <span className="text-lg text-slate-400">/{result.totalPrompts}</span>
          </p>
          <p className="mt-1 text-sm text-slate-500">プロンプトでブランド名が出た数</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">クライアント</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">{result.brandName}</p>
          <p className="mt-1 text-sm text-slate-500">{result.clientCategory}</p>
        </div>
      </section>

      {!compact && result.competitorScores.length > 0 ? (
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
      ) : null}

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

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="mb-4 font-semibold text-slate-900">プロンプト別の結果</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
                <th className="pb-3 pr-4 font-medium">ステータス</th>
                <th className="pb-3 pr-4 font-medium">プロンプト</th>
                <th className="pb-3 font-medium">AI回答（抜粋）</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {result.promptResults.map((item) => (
                <tr key={item.prompt} className="align-top">
                  <td className="py-4 pr-4">
                    <div className="flex flex-col gap-1.5">
                      <span
                        className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium ${
                          item.mentioned
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.mentioned ? "言及あり" : "言及なし"}
                      </span>
                      <span className="inline-flex w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                        {sentimentLabel(item.sentiment)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 pr-4 font-medium text-slate-800">{item.prompt}</td>
                  <td className="py-4 text-slate-600">{item.excerpt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
