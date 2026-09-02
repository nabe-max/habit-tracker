import { after, NextResponse } from "next/server";

import {
  addManualCompetitor,
  getCompetitorsState,
  rejectCompetitorSuggestion,
  trackCompetitorSuggestion,
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
      action?: "track" | "reject" | "add";
      name?: string;
      trackedName?: string;
      displayName?: string;
      domain?: string;
    };

    const token = body.token?.trim();
    const action = body.action;

    if (!token) {
      return NextResponse.json({ error: "アクセストークンが必要です" }, { status: 401 });
    }

    let state;
    let shouldRescan = false;

    if (action === "add") {
      state = await addManualCompetitor(brandId, token, {
        trackedName: body.trackedName ?? "",
        displayName: body.displayName ?? "",
        domain: body.domain,
      });
      shouldRescan = true;
    } else {
      const name = body.name?.trim();
      if (!action || !name) {
        return NextResponse.json({ error: "action と name が必要です" }, { status: 400 });
      }

      state =
        action === "track"
          ? await trackCompetitorSuggestion(brandId, token, name)
          : await rejectCompetitorSuggestion(brandId, token, name);
      shouldRescan = action === "track";
    }

    if (!state) {
      return NextResponse.json({ error: "アクセスできません" }, { status: 403 });
    }

    if (shouldRescan) {
      after(async () => {
        try {
          await rescanGeoBrand(brandId);
        } catch (error) {
          console.error("[POST /api/geo/competitors] auto-rescan failed", error);
        }
      });
    }

    return NextResponse.json({ ...state, rescanStarted: shouldRescan });
  } catch (error) {
    console.error("[POST /api/geo/competitors]", error);
    const message = error instanceof Error ? error.message : "競合の更新に失敗しました";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
