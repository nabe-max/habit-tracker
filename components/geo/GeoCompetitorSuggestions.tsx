"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus, Sparkles, Users, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MAX_COMPETITORS } from "@/lib/geo/competitors";
import type { GeoCompetitorsResponse, GeoMonitorClient } from "@/lib/geo/types";

interface GeoCompetitorSuggestionsProps {
  client: GeoMonitorClient;
  onCompetitorsUpdated?: (options?: { rescanStarted?: boolean }) => void;
}

export function GeoCompetitorSuggestions({
  client,
  onCompetitorsUpdated,
}: GeoCompetitorSuggestionsProps) {
  const [state, setState] = useState<GeoCompetitorsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionName, setActionName] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [trackedName, setTrackedName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [domain, setDomain] = useState("");

  const loadState = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/geo/competitors/${client.brandId}?token=${encodeURIComponent(client.viewToken)}`,
      );
      const data = (await res.json()) as GeoCompetitorsResponse & { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "競合情報の取得に失敗しました");
      }
      setState(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "競合情報の取得に失敗しました");
      setState(null);
    } finally {
      setLoading(false);
    }
  }, [client.brandId, client.viewToken]);

  useEffect(() => {
    void loadState();
  }, [loadState]);

  async function handleAction(action: "track" | "reject", name: string) {
    setActionName(name);
    try {
      const res = await fetch(`/api/geo/competitors/${client.brandId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: client.viewToken,
          action,
          name,
        }),
      });

      const data = (await res.json()) as GeoCompetitorsResponse & { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "更新に失敗しました");
      }

      setState(data);
      onCompetitorsUpdated?.({ rescanStarted: data.rescanStarted });
      toast.success(
        action === "track"
          ? `${name} を競合に追加しました。30〜60秒後にグラフへ反映されます`
          : `${name} を除外しました`,
      );

      if (action === "track" && data.rescanStarted) {
        window.setTimeout(() => onCompetitorsUpdated?.(), 45000);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "更新に失敗しました");
    } finally {
      setActionName(null);
    }
  }

  async function handleManualAdd(event: React.FormEvent) {
    event.preventDefault();
    setAdding(true);

    try {
      const res = await fetch(`/api/geo/competitors/${client.brandId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: client.viewToken,
          action: "add",
          trackedName,
          displayName,
          domain: domain.trim() || undefined,
        }),
      });

      const data = (await res.json()) as GeoCompetitorsResponse & { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "追加に失敗しました");
      }

      setState(data);
      setTrackedName("");
      setDisplayName("");
      setDomain("");
      onCompetitorsUpdated?.({ rescanStarted: data.rescanStarted });
      toast.success("競合を追加しました。30〜60秒後にグラフへ反映されます");

      if (data.rescanStarted) {
        window.setTimeout(() => onCompetitorsUpdated?.(), 45000);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "追加に失敗しました");
    } finally {
      setAdding(false);
    }
  }

  if (loading) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="size-4 animate-spin" />
          競合候補を読み込み中…
        </div>
      </section>
    );
  }

  const tracked = state?.tracked ?? [];
  const suggestions = state?.suggested ?? [];

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Users className="size-5 text-violet-600" />
            <h3 className="font-semibold text-slate-900">競合ブランド</h3>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            AI回答で自社と一緒に出たブランドを自動検出（2回以上で提案）
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
          {tracked.length}/{MAX_COMPETITORS}
        </span>
      </div>

      {tracked.length > 0 ? (
        <p className="mb-5 text-xs text-slate-500">
          追加すると<strong>自動で再スキャン</strong>され、競合がグラフに反映されます（30〜60秒）。
        </p>
      ) : null}

      {tracked.length > 0 ? (
        <div className="mb-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            追跡中
          </p>
          <div className="space-y-2">
            {tracked.map((competitor) => (
              <div
                key={competitor.trackedName}
                className="rounded-lg bg-violet-50 px-3 py-2 ring-1 ring-violet-100"
              >
                <p className="text-sm font-medium text-violet-800">{competitor.displayName}</p>
                <p className="text-xs text-slate-500">
                  Tracked: {competitor.trackedName}
                  {competitor.domain ? ` · ${competitor.domain}` : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="mb-5 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
          まだ競合が登録されていません。下のフォームから手動追加するか、Suggested Brands から Track してください。
        </p>
      )}

      <form
        onSubmit={(event) => void handleManualAdd(event)}
        className="mb-6 rounded-xl border border-dashed border-violet-200 bg-violet-50/40 p-4"
      >
        <p className="mb-3 text-sm font-medium text-slate-800">競合を手動追加</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Tracked Name *</span>
            <Input
              value={trackedName}
              onChange={(event) => setTrackedName(event.target.value)}
              placeholder="例：HubSpot"
              required
              disabled={!state?.canAddMore || adding}
            />
            <p className="text-xs text-slate-500">AI回答内で検索する最短の固有名</p>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Display Name *</span>
            <Input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="例：HubSpot CRM"
              required
              disabled={!state?.canAddMore || adding}
            />
            <p className="text-xs text-slate-500">ダッシュボード上の表示名</p>
          </label>
          <label className="space-y-2 sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Domain</span>
            <Input
              value={domain}
              onChange={(event) => setDomain(event.target.value)}
              placeholder="例：hubspot.com"
              disabled={!state?.canAddMore || adding}
            />
          </label>
        </div>
        <div className="mt-3 flex justify-end">
          <Button
            type="submit"
            disabled={!state?.canAddMore || adding || !trackedName.trim() || !displayName.trim()}
            className="bg-violet-600 text-white hover:bg-violet-500"
          >
            {adding ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
            競合を追加
          </Button>
        </div>
      </form>

      {suggestions.length > 0 ? (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="size-4 text-amber-500" />
            <p className="text-sm font-medium text-slate-800">Suggested Brands</p>
          </div>
          <div className="space-y-3">
            {suggestions.map((item) => {
              const isBusy = actionName === item.name;

              return (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.mentionCount}回 自社と共起</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      disabled={isBusy || state?.canAddMore === false}
                      onClick={() => void handleAction("track", item.name)}
                      className="bg-violet-600 text-white hover:bg-violet-500"
                    >
                      {isBusy ? <Loader2 className="size-4 animate-spin" /> : "Track"}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={isBusy}
                      onClick={() => void handleAction("reject", item.name)}
                    >
                      <X className="size-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-500">
          候補はまだありません。毎日スキャンが進むと、自社と一緒に言及されたブランドがここに表示されます。
        </p>
      )}
    </section>
  );
}
