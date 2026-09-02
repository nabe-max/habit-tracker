import { after, NextResponse } from "next/server";

import {
  addCustomPrompt,
  generatePromptSuggestionsForBrand,
  getPromptsState,
  rejectPromptSuggestion,
  removeCustomPrompt,
  trackPromptSuggestion,
  verifyGeoBrandAccess,
} from "@/lib/geo/db";
import { isGeoDbConfigured } from "@/lib/geo/env";
import { rescanGeoBrand } from "@/lib/geo/rescan-brand";

export const maxDuration = 60;

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

    const state = await getPromptsState(brandId);
    return NextResponse.json(state);
  } catch (error) {
    console.error("[GET /api/geo/prompts]", error);
    return NextResponse.json({ error: "プロンプト情報の取得に失敗しました" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ brandId: string }> },
) {
  if (!isGeoDbConfigured()) {
    return NextResponse.json({ error: "Supabaseが未設定です" }, { status: 503 });
  }

  if (!process.env.OPENAI_API_KEY?.trim()) {
    return NextResponse.json({ error: "OpenAI APIキーが設定されていません" }, { status: 503 });
  }

  const { brandId } = await params;

  try {
    const body = (await req.json()) as {
      token?: string;
      action?: "add" | "track" | "reject" | "generate";
      prompt?: string;
    };

    const token = body.token?.trim();
    const action = body.action ?? "add";
    const prompt = body.prompt?.trim();

    if (!token) {
      return NextResponse.json({ error: "アクセストークンが必要です" }, { status: 401 });
    }

    let state;
    let shouldRescan = false;

    if (action === "generate") {
      const brand = await verifyGeoBrandAccess(brandId, token);
      if (!brand) {
        return NextResponse.json({ error: "アクセスできません" }, { status: 403 });
      }
      state = await generatePromptSuggestionsForBrand(brandId);
    } else if (action === "track") {
      if (!prompt) {
        return NextResponse.json({ error: "プロンプトが必要です" }, { status: 400 });
      }
      state = await trackPromptSuggestion(brandId, token, prompt);
      shouldRescan = true;
    } else if (action === "reject") {
      if (!prompt) {
        return NextResponse.json({ error: "プロンプトが必要です" }, { status: 400 });
      }
      state = await rejectPromptSuggestion(brandId, token, prompt);
    } else {
      if (!prompt) {
        return NextResponse.json({ error: "プロンプトを入力してください" }, { status: 400 });
      }
      state = await addCustomPrompt(brandId, token, prompt);
      shouldRescan = true;
    }

    if (!state) {
      return NextResponse.json({ error: "アクセスできません" }, { status: 403 });
    }

    if (shouldRescan) {
      after(async () => {
        try {
          await rescanGeoBrand(brandId);
        } catch (error) {
          console.error("[POST /api/geo/prompts] auto-rescan failed", error);
        }
      });
    }

    return NextResponse.json({ ...state, rescanStarted: shouldRescan });
  } catch (error) {
    console.error("[POST /api/geo/prompts]", error);
    const message =
      error instanceof Error ? error.message : "プロンプトの更新に失敗しました";
    const status =
      message.includes("文字") || message.includes("最大") || message.includes("同じ")
        ? 400
        : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ brandId: string }> },
) {
  if (!isGeoDbConfigured()) {
    return NextResponse.json({ error: "Supabaseが未設定です" }, { status: 503 });
  }

  const { brandId } = await params;

  try {
    const body = (await req.json()) as { token?: string; prompt?: string };
    const token = body.token?.trim();
    const prompt = body.prompt?.trim();

    if (!token) {
      return NextResponse.json({ error: "アクセストークンが必要です" }, { status: 401 });
    }

    if (!prompt) {
      return NextResponse.json({ error: "プロンプトが必要です" }, { status: 400 });
    }

    const state = await removeCustomPrompt(brandId, token, prompt);
    if (!state) {
      return NextResponse.json({ error: "アクセスできません" }, { status: 403 });
    }

    after(async () => {
      try {
        await rescanGeoBrand(brandId);
      } catch (error) {
        console.error("[DELETE /api/geo/prompts] auto-rescan failed", error);
      }
    });

    return NextResponse.json({ ...state, rescanStarted: true });
  } catch (error) {
    console.error("[DELETE /api/geo/prompts]", error);
    const message =
      error instanceof Error ? error.message : "プロンプトの削除に失敗しました";
    const status = message.includes("見つかりません") ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
