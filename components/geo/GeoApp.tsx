"use client";

import { useCallback, useEffect, useState } from "react";
import { LayoutDashboard, MessageSquareText, PlusCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { GeoClientList } from "@/components/geo/GeoClientList";
import { GeoDashboard } from "@/components/geo/GeoDashboard";
import { GeoPromptsPanel } from "@/components/geo/GeoPromptsPanel";
import { GeoScanPanel } from "@/components/geo/GeoScanPanel";
import type { GeoMonitorClient } from "@/lib/geo/types";
import {
  clearActiveClientId,
  loadActiveClientId,
  loadMonitorClients,
  removeMonitorClient,
  saveActiveClientId,
  saveMonitorClient,
} from "@/lib/geo/storage";

type GeoTab = "overview" | "prompts" | "scan";

const NAV_ITEMS: Array<{ id: GeoTab; label: string; icon: typeof LayoutDashboard }> = [
  { id: "overview", label: "概要", icon: LayoutDashboard },
  { id: "prompts", label: "プロンプト", icon: MessageSquareText },
  { id: "scan", label: "新規診断", icon: PlusCircle },
];

export function GeoApp() {
  const [tab, setTab] = useState<GeoTab>("overview");
  const [clients, setClients] = useState<GeoMonitorClient[]>([]);
  const [activeClient, setActiveClient] = useState<GeoMonitorClient | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const loaded = loadMonitorClients();
    setClients(loaded);

    const savedId = loadActiveClientId();
    const initial = savedId ? loaded.find((c) => c.brandId === savedId) : loaded[0];
    if (initial) setActiveClient(initial);
  }, []);

  const selectClient = useCallback((client: GeoMonitorClient) => {
    setActiveClient(client);
    saveActiveClientId(client.brandId);
    setTab("overview");
  }, []);

  const handleMonitorStarted = useCallback((client: GeoMonitorClient) => {
    const next = saveMonitorClient(client);
    setClients(next);
    selectClient(client);
  }, [selectClient]);

  const handleDeleteClient = useCallback(
    async (client: GeoMonitorClient) => {
      const confirmed = window.confirm(
        `「${client.brandName}」の監視を停止して削除しますか？\nスキャン履歴も削除され、元に戻せません。`,
      );
      if (!confirmed) return;

      setDeletingId(client.brandId);

      try {
        const res = await fetch(`/api/geo/brands/${client.brandId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: client.viewToken }),
        });

        const data = (await res.json()) as { error?: string };
        if (!res.ok) {
          throw new Error(data.error ?? "削除に失敗しました");
        }

        const next = removeMonitorClient(client.brandId);
        setClients(next);

        if (activeClient?.brandId === client.brandId) {
          const newActive = next[0] ?? null;
          setActiveClient(newActive);
          if (newActive) {
            saveActiveClientId(newActive.brandId);
          } else {
            clearActiveClientId();
          }
        }

        toast.success(`「${client.brandName}」を削除しました`);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "削除に失敗しました");
      } finally {
        setDeletingId(null);
      }
    },
    [activeClient],
  );

  return (
    <div className="min-h-[calc(100vh-73px)]">
      <div className="mx-auto flex max-w-7xl">
        <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white md:block">
          <div className="sticky top-0 p-4">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              ページ
            </p>
            <nav className="space-y-1">
              {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    tab === id
                      ? "bg-violet-100 text-violet-800"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="size-4" />
                  {label}
                </button>
              ))}
            </nav>

            <div className="mt-8">
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                監視中クライアント
              </p>
              {clients.length === 0 ? (
                <p className="px-3 text-xs text-slate-400">まだありません</p>
              ) : (
                <GeoClientList
                  clients={clients}
                  activeClientId={activeClient?.brandId ?? null}
                  deletingId={deletingId}
                  onSelect={selectClient}
                  onDelete={(client) => void handleDeleteClient(client)}
                />
              )}
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <div className="mb-6 flex gap-2 md:hidden">
            {NAV_ITEMS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${
                  tab === id
                    ? "bg-violet-600 text-white"
                    : "bg-white text-slate-600 ring-1 ring-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {clients.length > 0 && tab !== "scan" ? (
            <GeoClientList
              variant="mobile"
              clients={clients}
              activeClientId={activeClient?.brandId ?? null}
              deletingId={deletingId}
              onSelect={selectClient}
              onDelete={(client) => void handleDeleteClient(client)}
            />
          ) : null}

          {tab === "overview" ? (
            <GeoDashboard
              client={activeClient}
              onGoToScan={() => setTab("scan")}
              onDeleteProject={
                activeClient ? () => void handleDeleteClient(activeClient) : undefined
              }
              deleting={deletingId === activeClient?.brandId}
            />
          ) : tab === "prompts" ? (
            <GeoPromptsPanel
              client={activeClient}
              onGoToScan={() => setTab("scan")}
              onDeleteProject={
                activeClient ? () => void handleDeleteClient(activeClient) : undefined
              }
              deleting={deletingId === activeClient?.brandId}
            />
          ) : (
            <GeoScanPanel onMonitorStarted={handleMonitorStarted} />
          )}
        </main>
      </div>
    </div>
  );
}

export function GeoAppHero() {
  return (
    <section className="border-b border-violet-100 bg-white/80 px-4 py-8 backdrop-blur-md sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
          <Sparkles className="size-3.5" />
          For SEO & Marketing Agencies
        </div>
        <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
          AI検索可視化ダッシュボード
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          概要でグラフと競合比較、プロンプトで回答詳細を確認。新規診断からクライアント追加と毎日監視を開始。
        </p>
      </div>
    </section>
  );
}
