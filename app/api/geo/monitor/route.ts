import { randomBytes } from "crypto";

import { NextResponse } from "next/server";

import { runGeoScan } from "@/lib/geo/analyzer";
import {
  createGeoBrand,
  saveGeoScanRun,
  upsertCompetitorSuggestionsFromScan,
} from "@/lib/geo/db";
import { isGeoDbConfigured } from "@/lib/geo/env";
import type { GeoScanRequest } from "@/lib/geo/types";
import { formatOpenAIError } from "@/lib/openai";

export async function POST(req: Request) {
  if (!isGeoDbConfigured()) {
    return NextResponse.json(
      { error: "Supabaseが未設定です。プロンプト監視にはDB設定が必要です。" },
      { status: 503 },
    );
  }

  if (!process.env.OPENAI_API_KEY?.trim()) {
    return NextResponse.json({ error: "OpenAI APIキーが設定されていません" }, { status: 503 });
  }

  try {
    const body = (await req.json()) as Partial<GeoScanRequest> & {
      competitorsText?: string;
    };

    const brandName = body.brandName?.trim();
    const clientCategory = body.clientCategory?.trim();
    const location = body.location?.trim();
    const website = body.website?.trim();
    const competitors = body.competitors?.length
      ? body.competitors
      : (body.competitorsText ?? "")
          .split(/[,、\n]/)
          .map((value) => value.trim())
          .filter(Boolean);

    if (!brandName) {
      return NextResponse.json({ error: "クライアント名を入力してください" }, { status: 400 });
    }

    if (!clientCategory) {
      return NextResponse.json({ error: "クライアント業種を入力してください" }, { status: 400 });
    }

    const viewToken = randomBytes(24).toString("hex");
    const brand = await createGeoBrand({
      viewToken,
      brandName,
      clientCategory,
      location,
      website,
      competitors: competitors.slice(0, 5),
    });

    const result = await runGeoScan({
      brandName,
      clientCategory,
      location,
      website,
      competitors: competitors.slice(0, 5),
    });

    await saveGeoScanRun(brand.id, result);
    await upsertCompetitorSuggestionsFromScan(brand.id, brand.competitors, result.suggestedCompetitors);

    return NextResponse.json({
      brandId: brand.id,
      viewToken,
      brandName,
      clientCategory,
      result,
    });
  } catch (error) {
    console.error("[POST /api/geo/monitor]", error);
    return NextResponse.json({ error: formatOpenAIError(error) }, { status: 500 });
  }
}
