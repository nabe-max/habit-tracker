import { randomBytes } from "crypto";

import { NextResponse } from "next/server";

import { runGeoScan } from "@/lib/geo/analyzer";
import {
  createGeoBrand,
  saveGeoScanRun,
  upsertCompetitorSuggestionsFromScan,
} from "@/lib/geo/db";
import { isGeoDbConfigured } from "@/lib/geo/env";
import { formatGeoServiceError } from "@/lib/geo/errors";
import type { GeoScanRequest } from "@/lib/geo/types";
import {
  parseGeoRegistration,
  validateGeoRegistration,
} from "@/lib/geo/registration";

export const maxDuration = 60;

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
      setupMode?: "domain" | "manual";
      customPromptsText?: string;
    };

    const registration = parseGeoRegistration(body);
    const validationError = validateGeoRegistration(registration);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const viewToken = randomBytes(24).toString("hex");
    const brand = await createGeoBrand({
      viewToken,
      brandName: registration.brandName,
      clientCategory: registration.clientCategory,
      location: registration.location,
      website: registration.website,
      competitors: registration.competitors,
      customPrompts: registration.manualOnly ? registration.customPrompts : [],
    });

    const result = await runGeoScan({
      brandName: registration.brandName,
      clientCategory: registration.clientCategory,
      location: registration.location,
      website: registration.website,
      competitors: registration.competitors,
      customPrompts: registration.customPrompts,
      manualOnly: registration.manualOnly,
    });

    await saveGeoScanRun(brand.id, result);
    await upsertCompetitorSuggestionsFromScan(brand.id, brand.competitors, result.suggestedCompetitors);

    return NextResponse.json({
      brandId: brand.id,
      viewToken,
      brandName: registration.brandName,
      clientCategory: registration.clientCategory,
      result,
    });
  } catch (error) {
    console.error("[POST /api/geo/monitor]", error);
    return NextResponse.json({ error: formatGeoServiceError(error) }, { status: 500 });
  }
}
