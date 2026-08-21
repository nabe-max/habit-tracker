export interface GeoScanRequest {
  brandName: string;
  clientCategory: string;
  website?: string;
  location?: string;
  competitors?: string[];
}

export interface GeoRankingEntry {
  name: string;
  position: number;
}

export interface GeoPositionRanking {
  name: string;
  avgPosition: number | null;
  mentionCount: number;
  rate: number;
}

export interface GeoPromptResult {
  prompt: string;
  mentioned: boolean;
  competitorsMentioned: string[];
  excerpt: string;
  sentiment: "positive" | "neutral" | "negative" | "none";
  position: number | null;
  rankings: GeoRankingEntry[];
}

export interface GeoScanResult {
  brandName: string;
  clientCategory: string;
  visibilityScore: number;
  positionScore: number | null;
  mentionCount: number;
  totalPrompts: number;
  competitorScores: Array<{ name: string; mentionCount: number; rate: number }>;
  positionRankings: GeoPositionRanking[];
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
  positionScore: number | null;
  mentionCount: number;
  totalPrompts: number;
  scannedAt: string;
}

export interface GeoHistoryResponse {
  brand: GeoMonitorClient;
  runs: GeoHistoryPoint[];
  weekOverWeekDelta: number | null;
  positionWeekOverWeekDelta: number | null;
  latestResult: GeoScanResult | null;
}
