import { NextResponse } from "next/server";

import {
  getGeoDb,
  getPromptsState,
  listGeoScanRuns,
  verifyGeoBrandAccess,
} from "@/lib/geo/db";
import { isGeoDbConfigured } from "@/lib/geo/env";
import type { GeoHistoryResponse, GeoRankingEntry, GeoScanResult } from "@/lib/geo/types";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ brandId: string }> },
) {
  if (!isGeoDbConfigured()) {
    return NextResponse.json({ error: "Supabaseが未設定です" }, { status: 503 });
  }

  const { brandId } = await params;
  const token = new URL(req.url).searchParams.get("token")?.trim();

  if (!token) {
    return NextResponse.json({ error: "アクセストークンが必要です" }, { status: 401 });
  }

  try {
    const brand = await verifyGeoBrandAccess(brandId, token);
    if (!brand) {
      return NextResponse.json({ error: "アクセスできません" }, { status: 403 });
    }

    const runs = await listGeoScanRuns(brandId, 12);
    const weekOverWeekDelta =
      runs.length >= 2 ? runs[0].visibility_score - runs[1].visibility_score : null;

    const positionWeekOverWeekDelta =
      runs.length >= 2 && runs[0].position_score !== null && runs[1].position_score !== null
        ? Number(runs[0].position_score) - Number(runs[1].position_score)
        : null;

    let latestResult: GeoScanResult | null = null;
    if (runs.length > 0) {
      const db = getGeoDb();
      const latestRun = runs[0];
      const { data: promptRows, error } = await db
        .from("geo_prompt_results")
        .select("*")
        .eq("scan_run_id", latestRun.id)
        .order("prompt", { ascending: true });

      if (error) throw error;

      latestResult = {
        brandName: brand.brand_name,
        clientCategory: brand.client_category,
        visibilityScore: latestRun.visibility_score,
        positionScore:
          latestRun.position_score !== null && latestRun.position_score !== undefined
            ? Number(latestRun.position_score)
            : null,
        mentionCount: latestRun.mention_count,
        totalPrompts: latestRun.total_prompts,
        competitorScores: latestRun.competitor_scores ?? [],
        positionRankings: latestRun.position_rankings ?? [],
        suggestedCompetitors: [],
        recommendations: latestRun.recommendations,
        scannedAt: latestRun.scanned_at,
        promptResults: (promptRows ?? []).map((row) => ({
          prompt: row.prompt,
          mentioned: row.mentioned,
          competitorsMentioned: row.competitors_mentioned ?? [],
          detectedBrands: [],
          excerpt: row.excerpt ?? "",
          sentiment: row.sentiment,
          position: row.position ?? null,
          rankings: (row.rankings ?? []) as GeoRankingEntry[],
        })),
      };
    }

    const promptsState = await getPromptsState(brandId);

    const response: GeoHistoryResponse = {
      brand: {
        brandId: brand.id,
        viewToken: token,
        brandName: brand.brand_name,
        clientCategory: brand.client_category,
      },
      trackedCompetitors: brand.competitors ?? [],
      defaultPrompts: promptsState.defaultPrompts,
      customPrompts: promptsState.customPrompts,
      canAddMoreCustomPrompts: promptsState.canAddMore,
      maxCustomPrompts: promptsState.maxCustomPrompts,
      runs: runs.map((run) => ({
        id: run.id,
        visibilityScore: run.visibility_score,
        positionScore:
          run.position_score !== null && run.position_score !== undefined
            ? Number(run.position_score)
            : null,
        mentionCount: run.mention_count,
        totalPrompts: run.total_prompts,
        scannedAt: run.scanned_at,
        positionRankings: run.position_rankings ?? [],
      })),
      weekOverWeekDelta,
      positionWeekOverWeekDelta,
      latestResult,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[GET /api/geo/history]", error);
    return NextResponse.json({ error: "履歴の取得に失敗しました" }, { status: 500 });
  }
}
