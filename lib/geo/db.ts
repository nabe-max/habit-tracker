import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getGeoConfig, isGeoDbConfigured } from "@/lib/geo/env";
import type { GeoScanResult } from "@/lib/geo/types";

let client: SupabaseClient | null = null;

export interface GeoBrand {
  id: string;
  view_token: string;
  brand_name: string;
  client_category: string;
  location: string | null;
  website: string | null;
  competitors: string[];
  is_active: boolean;
  last_scanned_at: string | null;
  created_at: string;
}

export interface GeoScanRunRow {
  id: string;
  brand_id: string;
  visibility_score: number;
  position_score: number | null;
  mention_count: number;
  total_prompts: number;
  recommendations: string[];
  competitor_scores: GeoScanResult["competitorScores"];
  position_rankings: GeoScanResult["positionRankings"];
  scanned_at: string;
  status: "completed" | "failed";
  error_message: string | null;
}

export function getGeoDb(): SupabaseClient {
  if (!isGeoDbConfigured()) {
    throw new Error("GEO Lab DB is not configured");
  }

  if (!client) {
    const config = getGeoConfig();
    client = createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return client;
}

export async function createGeoBrand(input: {
  viewToken: string;
  brandName: string;
  clientCategory: string;
  location?: string;
  website?: string;
  competitors: string[];
}): Promise<GeoBrand> {
  const db = getGeoDb();
  const { data, error } = await db
    .from("geo_brands")
    .insert({
      view_token: input.viewToken,
      brand_name: input.brandName,
      client_category: input.clientCategory,
      location: input.location ?? null,
      website: input.website ?? null,
      competitors: input.competitors,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data as GeoBrand;
}

export async function getGeoBrandById(brandId: string): Promise<GeoBrand | null> {
  const db = getGeoDb();
  const { data, error } = await db.from("geo_brands").select("*").eq("id", brandId).maybeSingle();
  if (error) throw error;
  return data as GeoBrand | null;
}

export async function verifyGeoBrandAccess(
  brandId: string,
  viewToken: string,
): Promise<GeoBrand | null> {
  const brand = await getGeoBrandById(brandId);
  if (!brand || brand.view_token !== viewToken) return null;
  return brand;
}

export async function listBrandsDueForScan(): Promise<GeoBrand[]> {
  const db = getGeoDb();
  const dueBefore = Date.now() - 6 * 24 * 60 * 60 * 1000;

  const { data, error } = await db
    .from("geo_brands")
    .select("*")
    .eq("is_active", true)
    .order("last_scanned_at", { ascending: true, nullsFirst: true })
    .limit(50);

  if (error) throw error;

  return ((data ?? []) as GeoBrand[])
    .filter(
      (brand) =>
        !brand.last_scanned_at || new Date(brand.last_scanned_at).getTime() <= dueBefore,
    )
    .slice(0, 20);
}

export async function saveGeoScanRun(
  brandId: string,
  result: GeoScanResult,
): Promise<GeoScanRunRow> {
  const db = getGeoDb();

  const { data: run, error: runError } = await db
    .from("geo_scan_runs")
    .insert({
      brand_id: brandId,
      visibility_score: result.visibilityScore,
      position_score: result.positionScore,
      mention_count: result.mentionCount,
      total_prompts: result.totalPrompts,
      recommendations: result.recommendations,
      competitor_scores: result.competitorScores,
      position_rankings: result.positionRankings,
      scanned_at: result.scannedAt,
      status: "completed",
    })
    .select("*")
    .single();

  if (runError) throw runError;

  const promptRows = result.promptResults.map((item) => ({
    scan_run_id: run.id,
    prompt: item.prompt,
    mentioned: item.mentioned,
    competitors_mentioned: item.competitorsMentioned,
    excerpt: item.excerpt,
    sentiment: item.sentiment,
    position: item.position,
    rankings: item.rankings,
  }));

  const { error: promptError } = await db.from("geo_prompt_results").insert(promptRows);
  if (promptError) throw promptError;

  const { error: brandError } = await db
    .from("geo_brands")
    .update({ last_scanned_at: result.scannedAt })
    .eq("id", brandId);

  if (brandError) throw brandError;

  return run as GeoScanRunRow;
}

export async function listGeoScanRuns(brandId: string, limit = 12): Promise<GeoScanRunRow[]> {
  const db = getGeoDb();
  const { data, error } = await db
    .from("geo_scan_runs")
    .select("*")
    .eq("brand_id", brandId)
    .eq("status", "completed")
    .order("scanned_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as GeoScanRunRow[];
}

export async function deactivateGeoBrand(brandId: string, viewToken: string): Promise<boolean> {
  const brand = await verifyGeoBrandAccess(brandId, viewToken);
  if (!brand) return false;

  const db = getGeoDb();
  const { error } = await db.from("geo_brands").update({ is_active: false }).eq("id", brandId);
  if (error) throw error;
  return true;
}
