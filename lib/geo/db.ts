import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { normalizeBrandKey, normalizeBrandName } from "@/lib/geo/brand-extraction";
import { addCompetitor, canAddCompetitor, MAX_COMPETITORS, SUGGESTION_THRESHOLD } from "@/lib/geo/competitors";
import { getGeoConfig, isGeoDbConfigured } from "@/lib/geo/env";
import {
  buildDefaultGeoPrompts,
  isDuplicatePrompt,
  MAX_CUSTOM_PROMPTS,
  MAX_PROMPT_LENGTH,
  MIN_PROMPT_LENGTH,
  normalizePromptText,
} from "@/lib/geo/prompts";
import type { GeoCompetitorsResponse, GeoPromptsResponse, GeoScanResult, GeoSuggestedCompetitor } from "@/lib/geo/types";

let client: SupabaseClient | null = null;

export interface GeoBrand {
  id: string;
  view_token: string;
  brand_name: string;
  client_category: string;
  location: string | null;
  website: string | null;
  competitors: string[];
  custom_prompts: string[];
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

export interface GeoCompetitorSuggestionRow {
  id: string;
  brand_id: string;
  suggested_name: string;
  mention_count: number;
  status: "pending" | "tracked" | "rejected";
  first_seen_at: string;
  last_seen_at: string;
}

function isSameBrandName(a: string, b: string): boolean {
  const left = normalizeBrandKey(a);
  const right = normalizeBrandKey(b);
  if (!left || !right) return false;
  return left === right || left.includes(right) || right.includes(left);
}

export async function updateGeoBrandCompetitors(
  brandId: string,
  competitors: string[],
): Promise<GeoBrand> {
  const db = getGeoDb();
  const { data, error } = await db
    .from("geo_brands")
    .update({ competitors: competitors.slice(0, MAX_COMPETITORS) })
    .eq("id", brandId)
    .select("*")
    .single();

  if (error) throw error;
  return data as GeoBrand;
}

export async function upsertCompetitorSuggestionsFromScan(
  brandId: string,
  trackedCompetitors: string[],
  scanSuggestions: GeoSuggestedCompetitor[],
): Promise<void> {
  if (scanSuggestions.length === 0) return;

  const db = getGeoDb();
  const { data: existingRows, error } = await db
    .from("geo_competitor_suggestions")
    .select("*")
    .eq("brand_id", brandId);

  if (error) throw error;

  const existing = (existingRows ?? []) as GeoCompetitorSuggestionRow[];
  const now = new Date().toISOString();

  for (const suggestion of scanSuggestions) {
    if (trackedCompetitors.some((name) => isSameBrandName(name, suggestion.name))) continue;

    const matched = existing.find((row) =>
      isSameBrandName(row.suggested_name, suggestion.name),
    );

    if (matched?.status === "rejected" || matched?.status === "tracked") continue;

    if (matched) {
      const { error: updateError } = await db
        .from("geo_competitor_suggestions")
        .update({
          mention_count: matched.mention_count + suggestion.mentionCount,
          last_seen_at: now,
        })
        .eq("id", matched.id);

      if (updateError) throw updateError;
      continue;
    }

    const { error: insertError } = await db.from("geo_competitor_suggestions").insert({
      brand_id: brandId,
      suggested_name: normalizeBrandName(suggestion.name),
      mention_count: suggestion.mentionCount,
      status: "pending",
      first_seen_at: now,
      last_seen_at: now,
    });

    if (insertError) throw insertError;
  }
}

export async function getCompetitorsState(
  brandId: string,
): Promise<GeoCompetitorsResponse> {
  const db = getGeoDb();
  const brand = await getGeoBrandById(brandId);
  if (!brand) {
    throw new Error("Brand not found");
  }

  const { data, error } = await db
    .from("geo_competitor_suggestions")
    .select("*")
    .eq("brand_id", brandId)
    .eq("status", "pending")
    .gte("mention_count", SUGGESTION_THRESHOLD)
    .order("mention_count", { ascending: false });

  if (error) throw error;

  const suggested = ((data ?? []) as GeoCompetitorSuggestionRow[]).map((row) => ({
    id: row.id,
    name: row.suggested_name,
    mentionCount: row.mention_count,
    status: row.status,
  }));

  return {
    tracked: brand.competitors ?? [],
    suggested,
    canAddMore: canAddCompetitor(brand.competitors ?? []),
  };
}

export async function trackCompetitorSuggestion(
  brandId: string,
  viewToken: string,
  name: string,
): Promise<GeoCompetitorsResponse | null> {
  const brand = await verifyGeoBrandAccess(brandId, viewToken);
  if (!brand) return null;

  const trimmed = normalizeBrandName(name);
  if (!trimmed) return null;

  const nextCompetitors = addCompetitor(brand.competitors ?? [], trimmed);
  if (nextCompetitors.length === (brand.competitors ?? []).length) {
    return getCompetitorsState(brandId);
  }

  const db = getGeoDb();
  await updateGeoBrandCompetitors(brandId, nextCompetitors);

  const { data: existingRows } = await db
    .from("geo_competitor_suggestions")
    .select("*")
    .eq("brand_id", brandId);

  const matched = ((existingRows ?? []) as GeoCompetitorSuggestionRow[]).find((row) =>
    isSameBrandName(row.suggested_name, trimmed),
  );

  if (matched) {
    await db
      .from("geo_competitor_suggestions")
      .update({ status: "tracked", last_seen_at: new Date().toISOString() })
      .eq("id", matched.id);
  } else {
    await db.from("geo_competitor_suggestions").insert({
      brand_id: brandId,
      suggested_name: trimmed,
      mention_count: SUGGESTION_THRESHOLD,
      status: "tracked",
    });
  }

  return getCompetitorsState(brandId);
}

function buildPromptsResponse(brand: GeoBrand): GeoPromptsResponse {
  const customPrompts = brand.custom_prompts ?? [];
  return {
    defaultPrompts: buildDefaultGeoPrompts({
      brandName: brand.brand_name,
      clientCategory: brand.client_category,
      location: brand.location ?? undefined,
    }),
    customPrompts,
    canAddMore: customPrompts.length < MAX_CUSTOM_PROMPTS,
    maxCustomPrompts: MAX_CUSTOM_PROMPTS,
  };
}

export async function getPromptsState(brandId: string): Promise<GeoPromptsResponse> {
  const brand = await getGeoBrandById(brandId);
  if (!brand) {
    throw new Error("Brand not found");
  }
  return buildPromptsResponse(brand);
}

export async function addCustomPrompt(
  brandId: string,
  viewToken: string,
  prompt: string,
): Promise<GeoPromptsResponse | null> {
  const brand = await verifyGeoBrandAccess(brandId, viewToken);
  if (!brand) return null;

  const normalized = normalizePromptText(prompt);
  if (normalized.length < MIN_PROMPT_LENGTH) {
    throw new Error(`プロンプトは${MIN_PROMPT_LENGTH}文字以上で入力してください`);
  }
  if (normalized.length > MAX_PROMPT_LENGTH) {
    throw new Error(`プロンプトは${MAX_PROMPT_LENGTH}文字以内で入力してください`);
  }

  const customPrompts = brand.custom_prompts ?? [];
  if (customPrompts.length >= MAX_CUSTOM_PROMPTS) {
    throw new Error(`カスタムプロンプトは最大${MAX_CUSTOM_PROMPTS}件までです`);
  }

  const defaults = buildDefaultGeoPrompts({
    brandName: brand.brand_name,
    clientCategory: brand.client_category,
    location: brand.location ?? undefined,
  });

  if (isDuplicatePrompt(normalized, [...defaults, ...customPrompts])) {
    throw new Error("同じプロンプトが既に登録されています");
  }

  const db = getGeoDb();
  const nextPrompts = [...customPrompts, normalized];
  const { data, error } = await db
    .from("geo_brands")
    .update({ custom_prompts: nextPrompts })
    .eq("id", brandId)
    .select("*")
    .single();

  if (error) throw error;
  return buildPromptsResponse(data as GeoBrand);
}

export async function removeCustomPrompt(
  brandId: string,
  viewToken: string,
  prompt: string,
): Promise<GeoPromptsResponse | null> {
  const brand = await verifyGeoBrandAccess(brandId, viewToken);
  if (!brand) return null;

  const normalized = normalizePromptText(prompt);
  const customPrompts = brand.custom_prompts ?? [];
  const nextPrompts = customPrompts.filter(
    (item) => promptKey(item) !== promptKey(normalized),
  );

  if (nextPrompts.length === customPrompts.length) {
    throw new Error("カスタムプロンプトが見つかりません");
  }

  const db = getGeoDb();
  const { data, error } = await db
    .from("geo_brands")
    .update({ custom_prompts: nextPrompts })
    .eq("id", brandId)
    .select("*")
    .single();

  if (error) throw error;
  return buildPromptsResponse(data as GeoBrand);
}

function promptKey(prompt: string): string {
  return normalizePromptText(prompt).toLowerCase();
}

export async function rejectCompetitorSuggestion(
  brandId: string,
  viewToken: string,
  name: string,
): Promise<GeoCompetitorsResponse | null> {
  const brand = await verifyGeoBrandAccess(brandId, viewToken);
  if (!brand) return null;

  const trimmed = normalizeBrandName(name);
  if (!trimmed) return null;

  const db = getGeoDb();
  const { data: existingRows } = await db
    .from("geo_competitor_suggestions")
    .select("*")
    .eq("brand_id", brandId);

  const matched = ((existingRows ?? []) as GeoCompetitorSuggestionRow[]).find((row) =>
    isSameBrandName(row.suggested_name, trimmed),
  );

  if (matched) {
    await db
      .from("geo_competitor_suggestions")
      .update({ status: "rejected", last_seen_at: new Date().toISOString() })
      .eq("id", matched.id);
  } else {
    await db.from("geo_competitor_suggestions").insert({
      brand_id: brandId,
      suggested_name: trimmed,
      mention_count: 0,
      status: "rejected",
    });
  }

  return getCompetitorsState(brandId);
}

export async function deactivateGeoBrand(brandId: string, viewToken: string): Promise<boolean> {
  const brand = await verifyGeoBrandAccess(brandId, viewToken);
  if (!brand) return false;

  const db = getGeoDb();
  const { error } = await db.from("geo_brands").update({ is_active: false }).eq("id", brandId);
  if (error) throw error;
  return true;
}

export async function deleteGeoBrand(brandId: string, viewToken: string): Promise<boolean> {
  const brand = await verifyGeoBrandAccess(brandId, viewToken);
  if (!brand) return false;

  const db = getGeoDb();
  const { error } = await db.from("geo_brands").delete().eq("id", brandId);
  if (error) throw error;
  return true;
}
