"use client";

import { useState } from "react";
import { CalendarClock, Globe, Loader2, Search, Sparkles, Type } from "lucide-react";
import { toast } from "sonner";

import { GeoScanResults } from "@/components/geo/GeoScanResults";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { GeoMonitorClient, GeoScanResult } from "@/lib/geo/types";
import {
  parseGeoRegistration,
  validateGeoRegistration,
  type GeoSetupMode,
} from "@/lib/geo/registration";
import {
  canAddMonitorClient,
  getMonitorClientLimitMessage,
  MAX_MONITORED_CLIENTS,
} from "@/lib/geo/limits";
import { saveMonitorClient } from "@/lib/geo/storage";

interface GeoScanPanelProps {
  monitoredClients: GeoMonitorClient[];
  onMonitorStarted: (client: GeoMonitorClient) => void;
}

export function GeoScanPanel({ monitoredClients, onMonitorStarted }: GeoScanPanelProps) {
  const [setupMode, setSetupMode] = useState<GeoSetupMode>("domain");
  const [brandName, setBrandName] = useState("");
  const [clientCategory, setClientCategory] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [customPromptsText, setCustomPromptsText] = useState("");
  const [loading, setLoading] = useState(false);
  const [monitorLoading, setMonitorLoading] = useState(false);
  const [result, setResult] = useState<GeoScanResult | null>(null);

  const isManual = setupMode === "manual";
  const monitorCount = monitoredClients.length;
  const atMonitorLimit = !canAddMonitorClient(monitorCount);
  const monitorLimitMessage = getMonitorClientLimitMessage(monitorCount);

  function buildPayload() {
    return {
      setupMode,
      brandName,
      clientCategory,
      website: isManual ? undefined : website,
      location,
      customPromptsText: customPromptsText.trim() ? customPromptsText : undefined,
    };
  }

  function validateForm(): string | null {
    return validateGeoRegistration(parseGeoRegistration(buildPayload()));
  }

  function resetForm() {
    setBrandName("");
    setClientCategory("");
    setWebsite("");
    setLocation("");
    setCustomPromptsText("");
    setResult(null);
  }

  async function handleScan() {
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/geo/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
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
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    if (monitorLimitMessage) {
      toast.error(monitorLimitMessage);
      return;
    }

    setMonitorLoading(true);

    try {
      const res = await fetch("/api/geo/monitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...buildPayload(),
          existingBrandIds: monitoredClients.map((client) => client.brandId),
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
      resetForm();
      toast.success("毎日監視を開始しました。Overviewタブで確認できます");
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
          1回診断するか、毎日監視を開始してOverviewダッシュボードに追加します。
        </p>
        <p className="mt-2 text-xs text-slate-500">
          β版: 監視クライアント {monitorCount}/{MAX_MONITORED_CLIENTS}社
        </p>
      </div>

      {atMonitorLimit ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {monitorLimitMessage}
        </div>
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
            <Search className="size-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">診断フォーム</h3>
            <p className="text-sm text-slate-500">ChatGPT等のAI回答に載っているかをチェック</p>
          </div>
        </div>

        <div className="mb-6 flex gap-2 rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setSetupMode("domain")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              setupMode === "domain"
                ? "bg-white text-violet-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Globe className="size-4" />
            公式サイトあり
          </button>
          <button
            type="button"
            onClick={() => setSetupMode("manual")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              setupMode === "manual"
                ? "bg-white text-violet-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Type className="size-4" />
            公式サイトなし
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">クライアント名 *</span>
            <Input
              value={brandName}
              onChange={(event) => setBrandName(event.target.value)}
              placeholder="例：株式会社〇〇"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">クライアント業種 *</span>
            <Input
              value={clientCategory}
              onChange={(event) => setClientCategory(event.target.value)}
              placeholder="例：税理士、SaaS"
            />
          </label>

          {isManual ? (
            <>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">エリア *</span>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="例：大阪、全国"
                />
              </label>
              <label className="space-y-2 sm:col-span-2">
                <span className="text-sm font-medium text-slate-700">監視プロンプト *</span>
                <Textarea
                  value={customPromptsText}
                  onChange={(e) => setCustomPromptsText(e.target.value)}
                  placeholder={"1行に1件ずつ入力\n例：大阪でおすすめの税理士を教えて\n例：梅田周辺で評判のいい税理士は？"}
                  rows={5}
                />
                <p className="text-xs text-slate-500">公式サイトがない場合は、監視したい質問を手入力してください（最大10件）</p>
              </label>
            </>
          ) : (
            <>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Webサイト *</span>
                <Input
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://..."
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">エリア</span>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="例：大阪、全国" />
              </label>
              <label className="space-y-2 sm:col-span-2">
                <span className="text-sm font-medium text-slate-700">監視プロンプト（任意）</span>
                <Textarea
                  value={customPromptsText}
                  onChange={(e) => setCustomPromptsText(e.target.value)}
                  placeholder={"1行に1件ずつ入力。空欄ならAI提案で診断します"}
                  rows={3}
                />
              </label>
            </>
          )}

        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button
            type="button"
            disabled={loading || monitorLoading}
            onClick={() => void handleScan()}
            className="bg-violet-600 text-white hover:bg-violet-500"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {loading ? "診断中…" : "1回診断する"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={loading || monitorLoading || atMonitorLimit}
            onClick={() => void handleStartMonitor()}
            className="border-violet-200 text-violet-700 hover:bg-violet-50"
          >
            {monitorLoading ? <Loader2 className="size-4 animate-spin" /> : <CalendarClock className="size-4" />}
            {monitorLoading ? "開始中…" : "毎日監視を開始 → Overviewへ"}
          </Button>
        </div>
      </div>

      {result ? <GeoScanResults result={result} /> : null}
    </div>
  );
}
