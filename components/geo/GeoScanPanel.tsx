"use client";

import { useState } from "react";
import { CalendarClock, Loader2, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { GeoScanResults } from "@/components/geo/GeoScanResults";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { GeoMonitorClient, GeoScanResult } from "@/lib/geo/types";
import { saveMonitorClient } from "@/lib/geo/storage";

interface GeoScanPanelProps {
  onMonitorStarted: (client: GeoMonitorClient) => void;
}

export function GeoScanPanel({ onMonitorStarted }: GeoScanPanelProps) {
  const [brandName, setBrandName] = useState("");
  const [clientCategory, setClientCategory] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [competitorsText, setCompetitorsText] = useState("");
  const [loading, setLoading] = useState(false);
  const [monitorLoading, setMonitorLoading] = useState(false);
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
      onMonitorStarted(client);
      toast.success("週次監視を開始しました。Overviewタブで確認できます");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "監視の開始に失敗しました");
    } finally {
      setMonitorLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-violet-600">Scan</p>
        <h2 className="text-2xl font-bold text-slate-900">新規クライアント診断</h2>
        <p className="mt-1 text-sm text-slate-500">
          1回診断するか、週次監視を開始してOverviewダッシュボードに追加します。
        </p>
      </div>

      <form onSubmit={handleScan} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
            <Search className="size-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">診断フォーム</h3>
            <p className="text-sm text-slate-500">ChatGPT等のAI回答に載っているかをチェック</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">クライアント名 *</span>
            <Input
              value={brandName}
              onChange={(event) => setBrandName(event.target.value)}
              placeholder="例：株式会社〇〇"
              required
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">クライアント業種 *</span>
            <Input
              value={clientCategory}
              onChange={(event) => setClientCategory(event.target.value)}
              placeholder="例：税理士、SaaS"
              required
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Webサイト</span>
            <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">エリア</span>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="例：大阪、全国" />
          </label>
          <label className="space-y-2 sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">競合（任意）</span>
            <Input
              value={competitorsText}
              onChange={(e) => setCompetitorsText(e.target.value)}
              placeholder="競合A、競合B"
            />
          </label>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button type="submit" disabled={loading || monitorLoading} className="bg-violet-600 text-white hover:bg-violet-500">
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {loading ? "診断中…" : "1回診断する"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={loading || monitorLoading}
            onClick={() => void handleStartMonitor()}
            className="border-violet-200 text-violet-700 hover:bg-violet-50"
          >
            {monitorLoading ? <Loader2 className="size-4 animate-spin" /> : <CalendarClock className="size-4" />}
            {monitorLoading ? "開始中…" : "週次監視を開始 → Overviewへ"}
          </Button>
        </div>
      </form>

      {result ? <GeoScanResults result={result} /> : null}
    </div>
  );
}
