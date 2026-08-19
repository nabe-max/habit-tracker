import { NextResponse } from "next/server";

import { runGeoScan } from "@/lib/geo/analyzer";
import type { GeoScanRequest } from "@/lib/geo/types";
import { formatOpenAIError } from "@/lib/openai";

export async function POST(req: Request) {
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

    const result = await runGeoScan({
      brandName,
      clientCategory,
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
