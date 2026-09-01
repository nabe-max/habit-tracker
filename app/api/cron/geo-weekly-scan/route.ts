import { after, NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { isCronAuthorized } from "@/lib/cron-auth";
import { listBrandsDueForScan } from "@/lib/geo/db";
import { getGeoConfig, isGeoDbConfigured } from "@/lib/geo/env";
import { rescanGeoBrand } from "@/lib/geo/rescan-brand";
import { MAX_BRANDS_PER_CRON } from "@/lib/geo/scan-schedule";
import { formatOpenAIError } from "@/lib/openai";

/** 日次バッチ。cron-job.org 側も毎日1回実行に設定してください。 */
export const maxDuration = 300;

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
    const batch = brands.slice(0, MAX_BRANDS_PER_CRON);
    const dryRun = req.nextUrl.searchParams.get("dry") === "1";

    if (dryRun) {
      return NextResponse.json({
        ok: true,
        dryRun: true,
        checked: brands.length,
        wouldQueue: batch.length,
        brandNames: batch.map((brand) => brand.brand_name),
      });
    }

    if (batch.length === 0) {
      return NextResponse.json({ ok: true, queued: 0, checked: brands.length });
    }

    const brandIds = batch.map((brand) => brand.id);

    after(async () => {
      for (const brandId of brandIds) {
        try {
          await rescanGeoBrand(brandId);
        } catch (error) {
          console.error(`[geo-daily-scan] brand=${brandId}`, error);
        }
      }
    });

    return NextResponse.json({
      ok: true,
      queued: batch.length,
      checked: brands.length,
      brandNames: batch.map((brand) => brand.brand_name),
      message: "Scans started in background",
    });
  } catch (error) {
    console.error("[GET /api/cron/geo-weekly-scan]", error);
    return NextResponse.json({ error: formatOpenAIError(error) }, { status: 500 });
  }
}
