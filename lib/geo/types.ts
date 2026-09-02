export interface GeoScanRequest {
  brandName: string;
  clientCategory: string;
  website?: string;
  location?: string;
  competitors?: string[];
  customPrompts?: string[];
  manualOnly?: boolean;
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
  detectedBrands: string[];
  excerpt: string;
  sentiment: "positive" | "neutral" | "negative" | "none";
  position: number | null;
  rankings: GeoRankingEntry[];
}

export interface GeoSuggestedCompetitor {
  name: string;
  mentionCount: number;
}

export interface GeoCompetitorSuggestionRow {
  id: string;
  name: string;
  mentionCount: number;
  status: "pending" | "tracked" | "rejected";
}

export interface GeoCompetitorsResponse {
  tracked: string[];
  suggested: GeoCompetitorSuggestionRow[];
  canAddMore: boolean;
  rescanStarted?: boolean;
}

export interface GeoPromptsResponse {
  defaultPrompts: string[];
  customPrompts: string[];
  canAddMore: boolean;
  maxCustomPrompts: number;
  manualOnly?: boolean;
  rescanStarted?: boolean;
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
  suggestedCompetitors: GeoSuggestedCompetitor[];
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
  positionRankings: GeoPositionRanking[];
}

export interface GeoHistoryResponse {
  brand: GeoMonitorClient;
  trackedCompetitors: string[];
  defaultPrompts: string[];
  customPrompts: string[];
  canAddMoreCustomPrompts: boolean;
  maxCustomPrompts: number;
  manualOnly: boolean;
  runs: GeoHistoryPoint[];
  weekOverWeekDelta: number | null;
  positionWeekOverWeekDelta: number | null;
  latestResult: GeoScanResult | null;
}
