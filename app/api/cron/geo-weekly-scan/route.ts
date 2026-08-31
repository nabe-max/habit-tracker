import { NextRequest, NextResponse } from "next/server";

import { isCronAuthorized } from "@/lib/cron-auth";
import { runGeoScan } from "@/lib/geo/analyzer";
import { getGeoConfig, isGeoDbConfigured } from "@/lib/geo/env";
import { listBrandsDueForScan, saveGeoScanRun, upsertCompetitorSuggestionsFromScan } from "@/lib/geo/db";
import { formatOpenAIError } from "@/lib/openai";

export async function GET(req: NextRequest) {
  if (!isGeoDbConfigured()) {
    return NextResponse.json({ error: "GEO DB not configured" }, { status: 503 });
  }

  if (!process.env.OPENAI_API_KEY?.trim()) {
    return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 503 });
  }

  const cronSecret = getGeoConfig().cronSecret;
  if (!isCronAuthorized(req, cronSecret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const brands = await listBrandsDueForScan();
    let scanned = 0;
    let failed = 0;

    for (const brand of brands) {
      try {
        const result = await runGeoScan(
          {
            brandName: brand.brand_name,
            clientCategory: brand.client_category,
            location: brand.location ?? undefined,
            website: brand.website ?? undefined,
            competitors: brand.competitors,
          },
          { includeRecommendations: false },
        );

        await saveGeoScanRun(brand.id, result);
        await upsertCompetitorSuggestionsFromScan(
          brand.id,
          brand.competitors,
          result.suggestedCompetitors,
        );
        scanned += 1;
      } catch (error) {
        failed += 1;
        console.error(`[geo-weekly-scan] brand=${brand.id}`, error);
      }
    }

    return NextResponse.json({ ok: true, scanned, failed, checked: brands.length });
  } catch (error) {
    console.error("[GET /api/cron/geo-weekly-scan]", error);
    return NextResponse.json({ error: formatOpenAIError(error) }, { status: 500 });
  }
}
