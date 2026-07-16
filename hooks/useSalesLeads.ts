"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  LeadStatus,
  SiteAnalysis,
  SalesLead,
} from "@/types/salespilot";
import { MAX_LEADS } from "@/types/salespilot";
import { loadLeads, saveLeads } from "@/utils/leadStorage";

function scoreToPriority(score: number): number {
  if (score <= 50) return 5;
  if (score <= 65) return 4;
  if (score <= 75) return 3;
  if (score <= 85) return 2;
  return 1;
}

interface UseSalesLeadsReturn {
  leads: SalesLead[];
  isReady: boolean;
  addLeadFromAnalysis: (analysis: SiteAnalysis) => boolean;
  updateLeadStatus: (id: string, status: LeadStatus) => void;
  updateLeadPriority: (id: string, priority: number) => void;
  removeLead: (id: string) => void;
}

export function useSalesLeads(): UseSalesLeadsReturn {
  const [leads, setLeads] = useState<SalesLead[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setLeads(loadLeads());
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady) saveLeads(leads);
  }, [leads, isReady]);

  const addLeadFromAnalysis = useCallback((analysis: SiteAnalysis) => {
    let added = false;

    setLeads((current) => {
      const exists = current.some((lead) => lead.url === analysis.url);
      if (exists || current.length >= MAX_LEADS) return current;

      added = true;
      const now = new Date().toISOString();
      const lead: SalesLead = {
        id: crypto.randomUUID(),
        url: analysis.url,
        companyName: analysis.companyName,
        score: analysis.score,
        features: analysis.features,
        emailSubject: analysis.email?.subject ?? "",
        emailBody: analysis.email?.body ?? "",
        status: "unsent",
        priority: scoreToPriority(analysis.score),
        notes: "",
        createdAt: now,
        updatedAt: now,
      };

      return [lead, ...current];
    });

    return added;
  }, []);

  const updateLeadStatus = useCallback((id: string, status: LeadStatus) => {
    setLeads((current) =>
      current.map((lead) =>
        lead.id === id
          ? { ...lead, status, updatedAt: new Date().toISOString() }
          : lead,
      ),
    );
  }, []);

  const updateLeadPriority = useCallback((id: string, priority: number) => {
    const clamped = Math.max(1, Math.min(5, priority));
    setLeads((current) =>
      current.map((lead) =>
        lead.id === id
          ? { ...lead, priority: clamped, updatedAt: new Date().toISOString() }
          : lead,
      ),
    );
  }, []);

  const removeLead = useCallback((id: string) => {
    setLeads((current) => current.filter((lead) => lead.id !== id));
  }, []);

  return {
    leads,
    isReady,
    addLeadFromAnalysis,
    updateLeadStatus,
    updateLeadPriority,
    removeLead,
  };
}
