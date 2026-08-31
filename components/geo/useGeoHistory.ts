"use client";

import { useCallback, useEffect, useState } from "react";

import type { GeoHistoryResponse, GeoMonitorClient } from "@/lib/geo/types";

export function useGeoHistory(client: GeoMonitorClient | null) {
  const [history, setHistory] = useState<GeoHistoryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async (active: GeoMonitorClient) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/geo/history/${active.brandId}?token=${encodeURIComponent(active.viewToken)}`,
      );
      const data = (await res.json()) as GeoHistoryResponse & { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "履歴の取得に失敗しました");
      }
      setHistory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "履歴の取得に失敗しました");
      setHistory(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!client) {
      setHistory(null);
      setError(null);
      return;
    }
    void loadHistory(client);
  }, [client, loadHistory]);

  return { history, loading, error, reload: () => client && loadHistory(client) };
}
