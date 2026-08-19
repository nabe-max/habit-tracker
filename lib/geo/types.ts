export type GeoIndustry =
  | "construction"
  | "beauty"
  | "saas"
  | "restaurant"
  | "professional"
  | "general";

export interface GeoScanRequest {
  brandName: string;
  industry: GeoIndustry;
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
  industry: GeoIndustry;
  visibilityScore: number;
  mentionCount: number;
  totalPrompts: number;
  competitorScores: Array<{ name: string; mentionCount: number; rate: number }>;
  promptResults: GeoPromptResult[];
  recommendations: string[];
  scannedAt: string;
}
