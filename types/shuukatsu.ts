export interface AnalyzeCompanyRequest {
  companyName: string;
  url: string;
  keywords?: string;
}

export interface ShuukatsuUsageSummary {
  limit: number;
  used: number;
  remaining: number;
  month: string;
}

export interface CompanyAnalysis {
  companyName: string;
  url: string;
  keywords?: string;
  overview: string;
  business: string;
  strengths: string[];
  jobHuntingPoints: string[];
  interviewTips: string[];
  keywordInsights?: string[];
  motivationDraft: string;
  dataSource: "website" | "ai_knowledge";
  analyzedAt: string;
}
