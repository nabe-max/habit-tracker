"use client";

import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Loader2,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getIndustryLabel } from "@/lib/geo/prompts";
import type { GeoIndustry, GeoScanResult } from "@/lib/geo/types";

const INDUSTRIES: Array<{ id: GeoIndustry; label: string }> = [
  { id: "construction", label: "設備工事・建設" },
  { id: "beauty", label: "美容サロン" },
  { id: "saas", label: "B2B SaaS" },
  { id: "restaurant", label: "飲食店" },
  { id: "professional", label: "士業・コンサル" },
  { id: "general", label: "一般" },
];

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

export function GeoScanner() {
  const [brandName, setBrandName] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState<GeoIndustry>("construction");
  const [competitorsText, setCompetitorsText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeoScanResult | null>(null);

  async function handleScan(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/geo/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName,
          website,
          location,
          industry,
          competitorsText,
        }),
      });

      const data = (await res.json()) as { error?: string; result?: GeoScanResult };
      if (!res.ok) {
        throw new Error(data.error ?? "スキャンに失敗しました");
      }

      setResult(data.result ?? null);
      toast.success("AI検索スキャンが完了しました");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "スキャンに失敗しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleScan}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
            <Search className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">AI検索スキャン</h2>
            <p className="text-sm text-slate-500">ChatGPTがあなたのブランドを答えに含めるかをチェック</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">ブランド名 / 会社名 *</span>
            <Input
              value={brandName}
              onChange={(event) => setBrandName(event.target.value)}
              placeholder="例：〇〇設備工業"
              required
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Webサイト</span>
            <Input
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
              placeholder="https://example.com"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">エリア</span>
            <Input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="例：大阪、東京"
            />
          </label>

          <label className="space-y-2 sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">業界 *</span>
            <div className="grid gap-2 sm:grid-cols-3">
              {INDUSTRIES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIndustry(item.id)}
                  className={`rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
                    industry === item.id
                      ? "border-violet-400 bg-violet-50 text-violet-800"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </label>

          <label className="space-y-2 sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">競合（任意・カンマ区切り）</span>
            <Input
              value={competitorsText}
              onChange={(event) => setCompetitorsText(event.target.value)}
              placeholder="例：A設備、B工業、Cメンテ"
            />
          </label>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-violet-600 hover:bg-violet-500 text-white"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          {loading ? "スキャン中…（30秒ほどかかります）" : "AI検索をスキャンする"}
        </Button>
      </form>

      {result ? (
        <div className="space-y-6">
          <section className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">AI可視性スコア</p>
              <p className={`mt-2 text-4xl font-bold ${scoreColor(result.visibilityScore)}`}>
                {result.visibilityScore}
                <span className="text-lg">/100</span>
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">言及率</p>
              <p className="mt-2 text-4xl font-bold text-slate-900">
                {result.mentionCount}/{result.totalPrompts}
              </p>
              <p className="mt-1 text-sm text-slate-500">プロンプトでブランド名が出た数</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">業界</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">
                {getIndustryLabel(result.industry)}
              </p>
              <p className="mt-1 text-sm text-slate-500">{result.brandName}</p>
            </div>
          </section>

          {result.competitorScores.length > 0 ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <BarChart3 className="size-5 text-violet-600" />
                <h3 className="font-semibold text-slate-900">競合との比較</h3>
              </div>
              <div className="space-y-3">
                {result.competitorScores.map((competitor) => (
                  <div key={competitor.name}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">{competitor.name}</span>
                      <span className="text-slate-500">{competitor.rate}%</span>
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

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="size-5 text-violet-600" />
              <h3 className="font-semibold text-slate-900">改善アクション</h3>
            </div>
            <ul className="space-y-3">
              {result.recommendations.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-xl bg-violet-50 px-4 py-3 text-sm text-slate-700"
                >
                  <ArrowRight className="mt-0.5 size-4 shrink-0 text-violet-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-semibold text-slate-900">プロンプト別の結果</h3>
            <div className="space-y-4">
              {result.promptResults.map((item) => (
                <div key={item.prompt} className="rounded-xl border border-slate-100 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        item.mentioned
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.mentioned ? "言及あり" : "言及なし"}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                      {sentimentLabel(item.sentiment)}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-medium text-slate-800">{item.prompt}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.excerpt}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
