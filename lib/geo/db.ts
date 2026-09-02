import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { normalizeBrandName } from "@/lib/geo/brand-extraction";
import {
  addCompetitor,
  canAddCompetitor,
  getTrackedNames,
  isSameBrand,
  MAX_COMPETITORS,
  parseTrackedCompetitors,
  SUGGESTION_THRESHOLD,
} from "@/lib/geo/competitors";
import { isValidWebsite } from "@/lib/geo/registration";
import { getGeoConfig, isGeoDbConfigured } from "@/lib/geo/env";
import {
  isDuplicatePrompt,
  MAX_CUSTOM_PROMPTS,
  MAX_PROMPT_LENGTH,
  MIN_PROMPT_LENGTH,
  normalizePromptText,
} from "@/lib/geo/prompts";
import { generatePromptSuggestions } from "@/lib/geo/prompt-suggestions";
import type {
  GeoCompetitorsResponse,
  GeoPromptsResponse,
  GeoPromptSuggestionRow,
  GeoScanResult,
  GeoSuggestedCompetitor,
  GeoTrackedCompetitor,
} from "@/lib/geo/types";
import { SCAN_INTERVAL_MS } from "@/lib/geo/scan-schedule";

let client: SupabaseClient | null = null;

export interface GeoBrand {
  id: string;
  view_token: string;
  brand_name: string;
  client_category: string;
  location: string | null;
  website: string | null;
  competitors: GeoTrackedCompetitor[];
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

function normalizeGeoBrand(row: Record<string, unknown>): GeoBrand {
  return {
    ...(row as unknown as GeoBrand),
    competitors: parseTrackedCompetitors(row.competitors),
  };
}

export async function createGeoBrand(input: {
  viewToken: string;
  brandName: string;
  clientCategory: string;
  location?: string;
  website?: string;
  customPrompts?: string[];
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
      competitors: [],
      custom_prompts: input.customPrompts ?? [],
    })
    .select("*")
    .single();

  if (error) throw error;
  return normalizeGeoBrand(data as Record<string, unknown>);
}

export async function getGeoBrandById(brandId: string): Promise<GeoBrand | null> {
  const db = getGeoDb();
  const { data, error } = await db.from("geo_brands").select("*").eq("id", brandId).maybeSingle();
  if (error) throw error;
  return data ? normalizeGeoBrand(data as Record<string, unknown>) : null;
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
  const dueBefore = Date.now() - SCAN_INTERVAL_MS;

  const { data, error } = await db
    .from("geo_brands")
    .select("*")
    .eq("is_active", true)
    .order("last_scanned_at", { ascending: true, nullsFirst: true })
    .limit(50);

  if (error) throw error;

  return ((data ?? []) as Record<string, unknown>[])
    .map(normalizeGeoBrand)
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

export async function updateGeoBrandCompetitors(
  brandId: string,
  competitors: GeoTrackedCompetitor[],
): Promise<GeoBrand> {
  const db = getGeoDb();
  const { data, error } = await db
    .from("geo_brands")
    .update({ competitors: competitors.slice(0, MAX_COMPETITORS) })
    .eq("id", brandId)
    .select("*")
    .single();

  if (error) throw error;
  return normalizeGeoBrand(data as Record<string, unknown>);
}

export async function upsertCompetitorSuggestionsFromScan(
  brandId: string,
  trackedCompetitors: GeoTrackedCompetitor[],
  scanSuggestions: GeoSuggestedCompetitor[],
): Promise<void> {
  if (scanSuggestions.length === 0) return;

  const trackedNames = getTrackedNames(trackedCompetitors);
  const db = getGeoDb();
  const { data: existingRows, error } = await db
    .from("geo_competitor_suggestions")
    .select("*")
    .eq("brand_id", brandId);

  if (error) throw error;

  const existing = (existingRows ?? []) as GeoCompetitorSuggestionRow[];
  const now = new Date().toISOString();

  for (const suggestion of scanSuggestions) {
    if (trackedNames.some((name) => isSameBrand(name, suggestion.name))) continue;

    const matched = existing.find((row) =>
      isSameBrand(row.suggested_name, suggestion.name),
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

export async function addManualCompetitor(
  brandId: string,
  viewToken: string,
  input: { trackedName: string; displayName: string; domain?: string },
): Promise<GeoCompetitorsResponse | null> {
  const brand = await verifyGeoBrandAccess(brandId, viewToken);
  if (!brand) return null;

  const trackedName = normalizeBrandName(input.trackedName);
  const displayName = input.displayName.trim();
  const domain = input.domain?.trim();

  if (!trackedName) {
    throw new Error("Tracked Nameを入力してください");
  }
  if (!displayName) {
    throw new Error("Display Nameを入力してください");
  }
  if (domain && !isValidWebsite(domain)) {
    throw new Error("ドメインの形式が正しくありません");
  }

  const competitor: GeoTrackedCompetitor = {
    trackedName,
    displayName,
    domain: domain || undefined,
  };

  const nextCompetitors = addCompetitor(brand.competitors ?? [], competitor);
  if (nextCompetitors.length === (brand.competitors ?? []).length) {
    throw new Error("同じ競合が既に登録されているか、上限に達しています");
  }

  await updateGeoBrandCompetitors(brandId, nextCompetitors);
  return getCompetitorsState(brandId);
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

  const nextCompetitors = addCompetitor(brand.competitors ?? [], {
    trackedName: trimmed,
    displayName: trimmed,
  });
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
    isSameBrand(row.suggested_name, trimmed),
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

function promptKey(prompt: string): string {
  return normalizePromptText(prompt).toLowerCase();
}

function isSamePrompt(a: string, b: string): boolean {
  return promptKey(a) === promptKey(b);
}

async function listPendingPromptSuggestions(brandId: string): Promise<GeoPromptSuggestionRow[]> {
  const db = getGeoDb();
  const { data, error } = await db
    .from("geo_prompt_suggestions")
    .select("*")
    .eq("brand_id", brandId)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return ((data ?? []) as Array<{ id: string; suggested_prompt: string; status: GeoPromptSuggestionRow["status"] }>).map(
    (row) => ({
      id: row.id,
      prompt: row.suggested_prompt,
      status: row.status,
    }),
  );
}

async function buildPromptsResponse(brand: GeoBrand): Promise<GeoPromptsResponse> {
  const activePrompts = brand.custom_prompts ?? [];
  const suggested = await listPendingPromptSuggestions(brand.id);

  return {
    activePrompts,
    suggested,
    canAddMore: activePrompts.length < MAX_CUSTOM_PROMPTS,
    maxPrompts: MAX_CUSTOM_PROMPTS,
  };
}

export async function generatePromptSuggestionsForBrand(brandId: string): Promise<GeoPromptsResponse> {
  const brand = await getGeoBrandById(brandId);
  if (!brand) throw new Error("Brand not found");

  const generated = await generatePromptSuggestions({
    brandName: brand.brand_name,
    clientCategory: brand.client_category,
    location: brand.location ?? undefined,
    website: brand.website ?? undefined,
  });

  const db = getGeoDb();
  const activePrompts = brand.custom_prompts ?? [];
  const { data: existingRows, error: existingError } = await db
    .from("geo_prompt_suggestions")
    .select("*")
    .eq("brand_id", brandId);

  if (existingError) throw existingError;

  const existing = (existingRows ?? []) as Array<{ suggested_prompt: string; status: string }>;

  for (const prompt of generated) {
    if (activePrompts.some((item) => isSamePrompt(item, prompt))) continue;
    if (existing.some((row) => isSamePrompt(row.suggested_prompt, prompt) && row.status !== "rejected")) {
      continue;
    }

    const { error: insertError } = await db.from("geo_prompt_suggestions").insert({
      brand_id: brandId,
      suggested_prompt: prompt,
      status: "pending",
    });

    if (insertError && insertError.code !== "23505") throw insertError;
  }

  return buildPromptsResponse(brand);
}

export async function getPromptsState(brandId: string): Promise<GeoPromptsResponse> {
  const brand = await getGeoBrandById(brandId);
  if (!brand) {
    throw new Error("Brand not found");
  }
  return buildPromptsResponse(brand);
}

export async function trackPromptSuggestion(
  brandId: string,
  viewToken: string,
  prompt: string,
): Promise<GeoPromptsResponse | null> {
  const brand = await verifyGeoBrandAccess(brandId, viewToken);
  if (!brand) return null;

  const normalized = normalizePromptText(prompt);
  if (!normalized) return null;

  const activePrompts = brand.custom_prompts ?? [];
  if (activePrompts.length >= MAX_CUSTOM_PROMPTS) {
    throw new Error(`プロンプトは最大${MAX_CUSTOM_PROMPTS}件までです`);
  }
  if (isDuplicatePrompt(normalized, activePrompts)) {
    return getPromptsState(brandId);
  }

  const db = getGeoDb();
  const nextPrompts = [...activePrompts, normalized];
  const { data, error } = await db
    .from("geo_brands")
    .update({ custom_prompts: nextPrompts })
    .eq("id", brandId)
    .select("*")
    .single();

  if (error) throw error;

  const { data: suggestionRows } = await db
    .from("geo_prompt_suggestions")
    .select("*")
    .eq("brand_id", brandId);

  const matched = ((suggestionRows ?? []) as Array<{ id: string; suggested_prompt: string }>).find((row) =>
    isSamePrompt(row.suggested_prompt, normalized),
  );

  if (matched) {
    await db.from("geo_prompt_suggestions").update({ status: "tracked" }).eq("id", matched.id);
  } else {
    await db.from("geo_prompt_suggestions").insert({
      brand_id: brandId,
      suggested_prompt: normalized,
      status: "tracked",
    });
  }

  return buildPromptsResponse(normalizeGeoBrand(data as Record<string, unknown>));
}

export async function rejectPromptSuggestion(
  brandId: string,
  viewToken: string,
  prompt: string,
): Promise<GeoPromptsResponse | null> {
  const brand = await verifyGeoBrandAccess(brandId, viewToken);
  if (!brand) return null;

  const normalized = normalizePromptText(prompt);
  if (!normalized) return null;

  const db = getGeoDb();
  const { data: suggestionRows } = await db
    .from("geo_prompt_suggestions")
    .select("*")
    .eq("brand_id", brandId);

  const matched = ((suggestionRows ?? []) as Array<{ id: string; suggested_prompt: string }>).find((row) =>
    isSamePrompt(row.suggested_prompt, normalized),
  );

  if (matched) {
    await db.from("geo_prompt_suggestions").update({ status: "rejected" }).eq("id", matched.id);
  } else {
    await db.from("geo_prompt_suggestions").insert({
      brand_id: brandId,
      suggested_prompt: normalized,
      status: "rejected",
    });
  }

  return getPromptsState(brandId);
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

  const activePrompts = brand.custom_prompts ?? [];
  if (activePrompts.length >= MAX_CUSTOM_PROMPTS) {
    throw new Error(`プロンプトは最大${MAX_CUSTOM_PROMPTS}件までです`);
  }

  if (isDuplicatePrompt(normalized, activePrompts)) {
    throw new Error("同じプロンプトが既に登録されています");
  }

  const db = getGeoDb();
  const nextPrompts = [...activePrompts, normalized];
  const { data, error } = await db
    .from("geo_brands")
    .update({ custom_prompts: nextPrompts })
    .eq("id", brandId)
    .select("*")
    .single();

  if (error) throw error;
  return buildPromptsResponse(normalizeGeoBrand(data as Record<string, unknown>));
}

export async function removeCustomPrompt(
  brandId: string,
  viewToken: string,
  prompt: string,
): Promise<GeoPromptsResponse | null> {
  const brand = await verifyGeoBrandAccess(brandId, viewToken);
  if (!brand) return null;

  const normalized = normalizePromptText(prompt);
  const activePrompts = brand.custom_prompts ?? [];
  const nextPrompts = activePrompts.filter((item) => !isSamePrompt(item, normalized));

  if (nextPrompts.length === activePrompts.length) {
    throw new Error("プロンプトが見つかりません");
  }

  const db = getGeoDb();
  const { data, error } = await db
    .from("geo_brands")
    .update({ custom_prompts: nextPrompts })
    .eq("id", brandId)
    .select("*")
    .single();

  if (error) throw error;
  return buildPromptsResponse(normalizeGeoBrand(data as Record<string, unknown>));
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
    isSameBrand(row.suggested_name, trimmed),
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
