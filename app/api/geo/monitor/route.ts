import { randomBytes } from "crypto";

import { NextResponse } from "next/server";

import { runGeoScan } from "@/lib/geo/analyzer";
import {
  createGeoBrand,
  generatePromptSuggestionsForBrand,
  saveGeoScanRun,
  upsertCompetitorSuggestionsFromScan,
} from "@/lib/geo/db";
import { isGeoDbConfigured } from "@/lib/geo/env";
import { formatGeoServiceError } from "@/lib/geo/errors";
import { getMonitorClientLimitMessage } from "@/lib/geo/limits";
import type { GeoScanRequest, GeoScanResult } from "@/lib/geo/types";
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
      setupMode?: "domain" | "manual";
      customPromptsText?: string;
      existingBrandIds?: string[];
    };

    const existingBrandIds = Array.isArray(body.existingBrandIds)
      ? body.existingBrandIds.filter((id): id is string => typeof id === "string" && id.length > 0)
      : [];
    const limitMessage = getMonitorClientLimitMessage(existingBrandIds.length);
    if (limitMessage) {
      return NextResponse.json({ error: limitMessage }, { status: 403 });
    }

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
      customPrompts: registration.customPrompts,
    });

    try {
      await generatePromptSuggestionsForBrand(brand.id);
    } catch (error) {
      console.error("[POST /api/geo/monitor] prompt suggestion generation failed", error);
    }

    let result: GeoScanResult | null = null;

    if (registration.customPrompts.length > 0) {
      result = await runGeoScan({
        brandName: registration.brandName,
        clientCategory: registration.clientCategory,
        location: registration.location,
        website: registration.website,
        customPrompts: registration.customPrompts,
      });

      await saveGeoScanRun(brand.id, result);
      await upsertCompetitorSuggestionsFromScan(brand.id, brand.competitors, result.suggestedCompetitors);
    }

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
