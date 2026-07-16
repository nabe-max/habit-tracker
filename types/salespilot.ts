export type LeadStatus = "unsent" | "sent" | "waiting" | "replied" | "lost";

export const LEAD_STATUSES: LeadStatus[] = [
  "unsent",
  "sent",
  "waiting",
  "replied",
  "lost",
];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  unsent: "未送信",
  sent: "送信済み",
  waiting: "返信待ち",
  replied: "返信あり",
  lost: "失注",
};

export interface TechnicalFindings {
  isHttps: boolean;
  hasViewportMeta: boolean;
  title: string | null;
  metaDescription: string | null;
  responseTimeMs: number;
  ctaCount: number;
  formCount: number;
  h1Count: number;
  hasTelLink: boolean;
  hasMailtoLink: boolean;
  contentLength: number;
}

export interface SiteAnalysis {
  url: string;
  companyName: string;
  score: number;
  features: string[];
  technicalFindings: TechnicalFindings;
  email?: {
    subject: string;
    body: string;
  };
  analyzedAt: string;
}

export interface SalesLead {
  id: string;
  url: string;
  companyName: string;
  score: number;
  features: string[];
  emailSubject: string;
  emailBody: string;
  status: LeadStatus;
  priority: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyzeRequest {
  url: string;
  companyName?: string;
}

export const MAX_LEADS = 100;
