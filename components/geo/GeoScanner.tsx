"use client";

import { useCallback, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  CalendarClock,
  Loader2,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

import {
  GeoMonitorHistory,
  GeoMonitorList,
  saveMonitorClient,
} from "@/components/geo/GeoMonitorHistory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { GeoMonitorClient, GeoScanResult } from "@/lib/geo/types";

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
  const [clientCategory, setClientCategory] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [competitorsText, setCompetitorsText] = useState("");
  const [loading, setLoading] = useState(false);
  const [monitorLoading, setMonitorLoading] = useState(false);
  const [result, setResult] = useState<GeoScanResult | null>(null);
  const [activeMonitor, setActiveMonitor] = useState<GeoMonitorClient | null>(null);

  const handleLatestFromHistory = useCallback((latest: GeoScanResult | null) => {
    if (latest) setResult(latest);
  }, []);

  async function handleScan(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setResult(null);
    setActiveMonitor(null);

    try {
      const res = await fetch("/api/geo/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName,
          clientCategory,
          website,
          location,
          competitorsText,
        }),
      });

      const data = (await res.json()) as { error?: string; result?: GeoScanResult };
      if (!res.ok) {
        throw new Error(data.error ?? "スキャンに失敗しました");
      }

      setResult(data.result ?? null);
      toast.success("クライアント診断が完了しました");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "スキャンに失敗しました");
    } finally {
      setLoading(false);
    }
  }

  async function handleStartMonitor() {
    if (!brandName.trim() || !clientCategory.trim()) {
      toast.error("クライアント名と業種を入力してください");
      return;
    }

    setMonitorLoading(true);

    try {
      const res = await fetch("/api/geo/monitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName,
          clientCategory,
          website,
          location,
          competitorsText,
        }),
      });

      const data = (await res.json()) as {
        error?: string;
        brandId?: string;
        viewToken?: string;
        brandName?: string;
        clientCategory?: string;
        result?: GeoScanResult;
      };

      if (!res.ok) {
        throw new Error(data.error ?? "監視の開始に失敗しました");
      }

      const client: GeoMonitorClient = {
        brandId: data.brandId!,
        viewToken: data.viewToken!,
        brandName: data.brandName!,
        clientCategory: data.clientCategory!,
      };

      saveMonitorClient(client);
      setActiveMonitor(client);
      setResult(data.result ?? null);
      toast.success("週次プロンプト監視を開始しました");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "監視の開始に失敗しました");
    } finally {
      setMonitorLoading(false);
    }
  }

  function handleSelectMonitor(client: GeoMonitorClient) {
    setActiveMonitor(client);
    setBrandName(client.brandName);
    setClientCategory(client.clientCategory);
    setResult(null);
  }

  return (
    <div className="space-y-8">
      <GeoMonitorList activeBrandId={activeMonitor?.brandId} onSelect={handleSelectMonitor} />

      {activeMonitor ? (
        <GeoMonitorHistory client={activeMonitor} onLatestResult={handleLatestFromHistory} />
      ) : null}

      <form
        onSubmit={handleScan}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
            <Search className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">クライアント診断</h2>
            <p className="text-sm text-slate-500">
              クライアントがChatGPT等のAI回答に載っているかをチェック
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">クライアント名 *</span>
            <Input
              value={brandName}
              onChange={(event) => setBrandName(event.target.value)}
              placeholder="例：株式会社〇〇、〇〇クリニック"
              required
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">クライアント業種 *</span>
            <Input
              value={clientCategory}
              onChange={(event) => setClientCategory(event.target.value)}
              placeholder="例：税理士、美容クリニック、SaaS"
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
              placeholder="例：大阪、渋谷、全国"
            />
          </label>

          <label className="space-y-2 sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">競合（任意・カンマ区切り）</span>
            <Input
              value={competitorsText}
              onChange={(event) => setCompetitorsText(event.target.value)}
              placeholder="例：競合A、競合B、競合C"
            />
          </label>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button
            type="submit"
            disabled={loading || monitorLoading}
            className="w-full bg-violet-600 hover:bg-violet-500 text-white"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {loading ? "診断中…" : "1回診断する"}
          </Button>

          <Button
            type="button"
            variant="outline"
            disabled={loading || monitorLoading}
            onClick={() => void handleStartMonitor()}
            className="w-full border-violet-200 text-violet-700 hover:bg-violet-50"
          >
            {monitorLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <CalendarClock className="size-4" />
            )}
            {monitorLoading ? "監視開始中…" : "週次監視を開始"}
          </Button>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          週次監視は同じ6プロンプトを毎週自動スキャンし、スコアの推移を記録します（API代: クライアント1社あたり月約100〜300円）。
        </p>
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
              <p className="text-sm text-slate-500">クライアント</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">{result.brandName}</p>
              <p className="mt-1 text-sm text-slate-500">{result.clientCategory}</p>
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

          {result.recommendations.length > 0 ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="size-5 text-violet-600" />
                <h3 className="font-semibold text-slate-900">クライアント提案用アクション</h3>
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
          ) : null}

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
