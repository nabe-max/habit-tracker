import { NextResponse } from "next/server";

import { runGeoScan } from "@/lib/geo/analyzer";
import {
  parseGeoRegistration,
  validateGeoRegistration,
} from "@/lib/geo/registration";
import { generatePromptSuggestions } from "@/lib/geo/prompt-suggestions";
import type { GeoScanRequest } from "@/lib/geo/types";
import { formatOpenAIError } from "@/lib/openai";

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY?.trim()) {
    return NextResponse.json({ error: "OpenAI APIキーが設定されていません" }, { status: 503 });
  }

  try {
    const body = (await req.json()) as Partial<GeoScanRequest> & {
      setupMode?: "domain" | "manual";
      customPromptsText?: string;
    };

    const registration = parseGeoRegistration(body);
    const validationError = validateGeoRegistration(registration);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    let prompts = registration.customPrompts;

    if (prompts.length === 0 && !registration.manualOnly) {
      prompts = await generatePromptSuggestions({
        brandName: registration.brandName,
        clientCategory: registration.clientCategory,
        location: registration.location,
        website: registration.website,
      });
    }

    if (prompts.length === 0) {
      return NextResponse.json({ error: "診断するプロンプトがありません" }, { status: 400 });
    }

    const result = await runGeoScan({
      brandName: registration.brandName,
      clientCategory: registration.clientCategory,
      location: registration.location,
      website: registration.website,
      customPrompts: prompts,
    });

    return NextResponse.json({ result });
  } catch (error) {
    console.error("[POST /api/geo/scan]", error);
    return NextResponse.json({ error: formatOpenAIError(error) }, { status: 500 });
  }
}
