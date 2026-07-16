import type { SalesLead } from "@/types/salespilot";

const STORAGE_KEY = "salespilot-leads-v1";

export function loadLeads(): SalesLead[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<
      SalesLead & { improvements?: string[] }
    >;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((lead) => ({
      ...lead,
      features: lead.features ?? lead.improvements ?? [],
    }));
  } catch {
    return [];
  }
}

export function saveLeads(leads: SalesLead[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
}
