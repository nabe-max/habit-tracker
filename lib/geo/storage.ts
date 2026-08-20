import type { GeoMonitorClient } from "@/lib/geo/types";

const CLIENTS_KEY = "geo_monitor_clients";
const ACTIVE_CLIENT_KEY = "geo_active_client_id";

export function loadMonitorClients(): GeoMonitorClient[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CLIENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as GeoMonitorClient[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveMonitorClient(client: GeoMonitorClient): GeoMonitorClient[] {
  const existing = loadMonitorClients().filter((item) => item.brandId !== client.brandId);
  const next = [client, ...existing];
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(next));
  return next;
}

export function loadActiveClientId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_CLIENT_KEY);
}

export function saveActiveClientId(brandId: string): void {
  localStorage.setItem(ACTIVE_CLIENT_KEY, brandId);
}
