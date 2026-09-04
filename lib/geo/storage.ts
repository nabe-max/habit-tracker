import { canAddMonitorClient, MAX_MONITORED_CLIENTS } from "@/lib/geo/limits";
import type { GeoMonitorClient } from "@/lib/geo/types";

export { MAX_MONITORED_CLIENTS, canAddMonitorClient };

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
  const current = loadMonitorClients();
  const existing = current.filter((item) => item.brandId !== client.brandId);
  const isNew = !current.some((item) => item.brandId === client.brandId);
  if (isNew && !canAddMonitorClient(current.length)) {
    return current;
  }
  const next = [client, ...existing];
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(next));
  return next;
}

export function removeMonitorClient(brandId: string): GeoMonitorClient[] {
  const next = loadMonitorClients().filter((item) => item.brandId !== brandId);
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(next));
  return next;
}

export function clearActiveClientId(): void {
  localStorage.removeItem(ACTIVE_CLIENT_KEY);
}

export function loadActiveClientId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_CLIENT_KEY);
}

export function saveActiveClientId(brandId: string): void {
  localStorage.setItem(ACTIVE_CLIENT_KEY, brandId);
}
