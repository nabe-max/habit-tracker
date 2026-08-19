import { NextResponse } from "next/server";

import {
  getGeoDb,
  listGeoScanRuns,
  verifyGeoBrandAccess,
} from "@/lib/geo/db";
import { isGeoDbConfigured } from "@/lib/geo/env";
import type { GeoHistoryResponse, GeoScanResult } from "@/lib/geo/types";

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
        mentionCount: latestRun.mention_count,
        totalPrompts: latestRun.total_prompts,
        competitorScores: latestRun.competitor_scores,
        recommendations: latestRun.recommendations,
        scannedAt: latestRun.scanned_at,
        promptResults: (promptRows ?? []).map((row) => ({
          prompt: row.prompt,
          mentioned: row.mentioned,
          competitorsMentioned: row.competitors_mentioned ?? [],
          excerpt: row.excerpt ?? "",
          sentiment: row.sentiment,
        })),
      };
    }

    const response: GeoHistoryResponse = {
      brand: {
        brandId: brand.id,
        viewToken: token,
        brandName: brand.brand_name,
        clientCategory: brand.client_category,
      },
      runs: runs.map((run) => ({
        id: run.id,
        visibilityScore: run.visibility_score,
        mentionCount: run.mention_count,
        totalPrompts: run.total_prompts,
        scannedAt: run.scanned_at,
      })),
      weekOverWeekDelta,
      latestResult,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[GET /api/geo/history]", error);
    return NextResponse.json({ error: "履歴の取得に失敗しました" }, { status: 500 });
  }
}
