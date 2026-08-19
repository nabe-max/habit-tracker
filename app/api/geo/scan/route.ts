import { NextResponse } from "next/server";

import { runGeoScan } from "@/lib/geo/analyzer";
import type { GeoIndustry, GeoScanRequest } from "@/lib/geo/types";
import { formatOpenAIError } from "@/lib/openai";

const INDUSTRIES: GeoIndustry[] = [
  "construction",
  "beauty",
  "saas",
  "restaurant",
  "professional",
  "general",
];

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY?.trim()) {
    return NextResponse.json({ error: "OpenAI APIキーが設定されていません" }, { status: 503 });
  }

  try {
    const body = (await req.json()) as Partial<GeoScanRequest> & {
      competitorsText?: string;
    };

    const brandName = body.brandName?.trim();
    const industry = body.industry;
    const location = body.location?.trim();
    const website = body.website?.trim();
    const competitors = body.competitors?.length
      ? body.competitors
      : (body.competitorsText ?? "")
          .split(/[,、\n]/)
          .map((value) => value.trim())
          .filter(Boolean);

    if (!brandName) {
      return NextResponse.json({ error: "ブランド名を入力してください" }, { status: 400 });
    }

    if (!industry || !INDUSTRIES.includes(industry)) {
      return NextResponse.json({ error: "業界を選択してください" }, { status: 400 });
    }

    const result = await runGeoScan({
      brandName,
      industry,
      location,
      website,
      competitors: competitors.slice(0, 5),
    });

    return NextResponse.json({ result });
  } catch (error) {
    console.error("[POST /api/geo/scan]", error);
    return NextResponse.json({ error: formatOpenAIError(error) }, { status: 500 });
  }
}
