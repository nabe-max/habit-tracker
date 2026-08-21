import { NextResponse } from "next/server";

import {
  getCompetitorsState,
  rejectCompetitorSuggestion,
  trackCompetitorSuggestion,
  verifyGeoBrandAccess,
} from "@/lib/geo/db";
import { isGeoDbConfigured } from "@/lib/geo/env";

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

    const state = await getCompetitorsState(brandId);
    return NextResponse.json(state);
  } catch (error) {
    console.error("[GET /api/geo/competitors]", error);
    return NextResponse.json({ error: "競合情報の取得に失敗しました" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ brandId: string }> },
) {
  if (!isGeoDbConfigured()) {
    return NextResponse.json({ error: "Supabaseが未設定です" }, { status: 503 });
  }

  const { brandId } = await params;

  try {
    const body = (await req.json()) as {
      token?: string;
      action?: "track" | "reject";
      name?: string;
    };

    const token = body.token?.trim();
    const action = body.action;
    const name = body.name?.trim();

    if (!token) {
      return NextResponse.json({ error: "アクセストークンが必要です" }, { status: 401 });
    }

    if (!action || !name) {
      return NextResponse.json({ error: "action と name が必要です" }, { status: 400 });
    }

    const state =
      action === "track"
        ? await trackCompetitorSuggestion(brandId, token, name)
        : await rejectCompetitorSuggestion(brandId, token, name);

    if (!state) {
      return NextResponse.json({ error: "アクセスできません" }, { status: 403 });
    }

    return NextResponse.json(state);
  } catch (error) {
    console.error("[POST /api/geo/competitors]", error);
    return NextResponse.json({ error: "競合の更新に失敗しました" }, { status: 500 });
  }
}
