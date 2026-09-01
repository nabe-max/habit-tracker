"use client";

import { LayoutDashboard, Loader2 } from "lucide-react";

import type { GeoMonitorClient } from "@/lib/geo/types";

interface GeoClientShellProps {
  client: GeoMonitorClient | null;
  loading: boolean;
  error: string | null;
  onGoToScan: () => void;
  children: (client: GeoMonitorClient) => React.ReactNode;
}

export function GeoClientShell({
  client,
  loading,
  error,
  onGoToScan,
  children,
}: GeoClientShellProps) {
  if (!client) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
        <LayoutDashboard className="size-10 text-slate-300" />
        <h2 className="mt-4 text-lg font-semibold text-slate-900">クライアントを選択してください</h2>
        <p className="mt-2 max-w-md text-sm text-slate-500">
          左のサイドバーから監視中クライアントを選ぶか、「新規診断」で毎日監視を開始してください。
        </p>
        <button
          type="button"
          onClick={onGoToScan}
          className="mt-6 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
        >
          新規診断へ
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
        <Loader2 className="size-6 animate-spin text-violet-600" />
        <span className="ml-3 text-sm text-slate-500">読み込み中…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
        {error}
      </div>
    );
  }

  return <>{children(client)}</>;
}

export function GeoNoScanData({ message }: { message?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
      {message}
    </div>
  );
}
