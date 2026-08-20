"use client";

import { useCallback, useEffect, useState } from "react";
import { LayoutDashboard, PlusCircle, Sparkles } from "lucide-react";

import { GeoDashboard } from "@/components/geo/GeoDashboard";
import { GeoScanPanel } from "@/components/geo/GeoScanPanel";
import type { GeoMonitorClient } from "@/lib/geo/types";
import {
  loadActiveClientId,
  loadMonitorClients,
  saveActiveClientId,
  saveMonitorClient,
} from "@/lib/geo/storage";

type GeoTab = "overview" | "scan";

export function GeoApp() {
  const [tab, setTab] = useState<GeoTab>("overview");
  const [clients, setClients] = useState<GeoMonitorClient[]>([]);
  const [activeClient, setActiveClient] = useState<GeoMonitorClient | null>(null);

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

  return (
    <div className="min-h-[calc(100vh-73px)]">
      <div className="mx-auto flex max-w-7xl">
        <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white md:block">
          <div className="sticky top-0 p-4">
            <nav className="space-y-1">
              <button
                type="button"
                onClick={() => setTab("overview")}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  tab === "overview"
                    ? "bg-violet-100 text-violet-800"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <LayoutDashboard className="size-4" />
                Overview
              </button>
              <button
                type="button"
                onClick={() => setTab("scan")}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  tab === "scan"
                    ? "bg-violet-100 text-violet-800"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <PlusCircle className="size-4" />
                新規診断
              </button>
            </nav>

            <div className="mt-8">
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                監視中クライアント
              </p>
              {clients.length === 0 ? (
                <p className="px-3 text-xs text-slate-400">まだありません</p>
              ) : (
                <div className="space-y-1">
                  {clients.map((client) => (
                    <button
                      key={client.brandId}
                      type="button"
                      onClick={() => selectClient(client)}
                      className={`w-full rounded-lg px-3 py-2 text-left transition-colors ${
                        activeClient?.brandId === client.brandId
                          ? "bg-violet-50 ring-1 ring-violet-200"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <p className="truncate text-sm font-medium text-slate-800">{client.brandName}</p>
                      <p className="truncate text-xs text-slate-500">{client.clientCategory}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <div className="mb-6 flex gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setTab("overview")}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${
                tab === "overview" ? "bg-violet-600 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => setTab("scan")}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${
                tab === "scan" ? "bg-violet-600 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"
              }`}
            >
              新規診断
            </button>
          </div>

          {clients.length > 0 && tab === "overview" ? (
            <div className="mb-6 flex gap-2 overflow-x-auto md:hidden">
              {clients.map((client) => (
                <button
                  key={client.brandId}
                  type="button"
                  onClick={() => selectClient(client)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-sm ${
                    activeClient?.brandId === client.brandId
                      ? "bg-violet-100 text-violet-800"
                      : "bg-white text-slate-600 ring-1 ring-slate-200"
                  }`}
                >
                  {client.brandName}
                </button>
              ))}
            </div>
          ) : null}

          {tab === "overview" ? (
            <GeoDashboard client={activeClient} onGoToScan={() => setTab("scan")} />
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
          Overviewでグラフと診断結果を常時確認。新規診断タブでクライアント追加と週次監視を開始。
        </p>
      </div>
    </section>
  );
}
