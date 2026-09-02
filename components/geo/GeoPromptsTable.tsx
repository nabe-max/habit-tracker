"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, MessageSquareText } from "lucide-react";

import type { GeoPromptResult, GeoScanResult } from "@/lib/geo/types";

function sentimentLabel(sentiment: GeoPromptResult["sentiment"]): string {
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

function sentimentColor(sentiment: GeoPromptResult["sentiment"]): string {
  switch (sentiment) {
    case "positive":
      return "bg-emerald-100 text-emerald-700";
    case "negative":
      return "bg-rose-100 text-rose-700";
    case "neutral":
      return "bg-slate-100 text-slate-600";
    default:
      return "bg-slate-100 text-slate-500";
  }
}

interface GeoPromptsTableProps {
  result: GeoScanResult;
}

export function GeoPromptsTable({ result }: GeoPromptsTableProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-2">
          <MessageSquareText className="size-5 text-violet-600" />
          <h3 className="font-semibold text-slate-900">監視プロンプト</h3>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          {result.mentionCount}/{result.totalPrompts} 件で言及あり · 毎日スキャンで更新
        </p>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-6 py-3 font-medium">Position</th>
              <th className="px-6 py-3 font-medium">ステータス</th>
              <th className="px-6 py-3 font-medium">プロンプト</th>
              <th className="px-6 py-3 font-medium">AI回答（抜粋）</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {result.promptResults.map((item) => (
              <tr key={item.prompt} className="align-top">
                <td className="px-6 py-4 tabular-nums font-semibold text-slate-700">
                  {item.position !== null ? `${item.position}位` : "—"}
                </td>
                <td className="px-6 py-4">
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
                    <span
                      className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs ${sentimentColor(item.sentiment)}`}
                    >
                      {sentimentLabel(item.sentiment)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-slate-800">{item.prompt}</td>
                <td className="px-6 py-4 text-slate-600">{item.excerpt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-slate-100 md:hidden">
        {result.promptResults.map((item) => {
          const isOpen = expanded === item.prompt;
          return (
            <div key={item.prompt} className="px-4 py-4">
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : item.prompt)}
                className="flex w-full items-start justify-between gap-3 text-left"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900">{item.prompt}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        item.mentioned
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.mentioned ? "言及あり" : "言及なし"}
                    </span>
                    {item.position !== null ? (
                      <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700">
                        {item.position}位
                      </span>
                    ) : null}
                  </div>
                </div>
                {isOpen ? (
                  <ChevronUp className="size-4 shrink-0 text-slate-400" />
                ) : (
                  <ChevronDown className="size-4 shrink-0 text-slate-400" />
                )}
              </button>
              {isOpen ? (
                <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">{item.excerpt}</p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
