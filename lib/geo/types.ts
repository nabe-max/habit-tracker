export interface GeoScanRequest {
  brandName: string;
  clientCategory: string;
  website?: string;
  location?: string;
  competitors?: string[];
}

export interface GeoPromptResult {
  prompt: string;
  mentioned: boolean;
  competitorsMentioned: string[];
  excerpt: string;
  sentiment: "positive" | "neutral" | "negative" | "none";
}

export interface GeoScanResult {
  brandName: string;
  clientCategory: string;
  visibilityScore: number;
  mentionCount: number;
  totalPrompts: number;
  competitorScores: Array<{ name: string; mentionCount: number; rate: number }>;
  promptResults: GeoPromptResult[];
  recommendations: string[];
  scannedAt: string;
}

export interface GeoMonitorClient {
  brandId: string;
  viewToken: string;
  brandName: string;
  clientCategory: string;
}

export interface GeoHistoryPoint {
  id: string;
  visibilityScore: number;
  mentionCount: number;
  totalPrompts: number;
  scannedAt: string;
}

export interface GeoHistoryResponse {
  brand: GeoMonitorClient;
  runs: GeoHistoryPoint[];
  weekOverWeekDelta: number | null;
  latestResult: GeoScanResult | null;
}
