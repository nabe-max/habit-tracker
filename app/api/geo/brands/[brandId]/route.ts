import { NextResponse } from "next/server";

import { deleteGeoBrand } from "@/lib/geo/db";
import { isGeoDbConfigured } from "@/lib/geo/env";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ brandId: string }> },
) {
  if (!isGeoDbConfigured()) {
    return NextResponse.json({ error: "Supabaseが未設定です" }, { status: 503 });
  }

  const { brandId } = await params;

  try {
    const body = (await req.json()) as { token?: string };
    const token = body.token?.trim();

    if (!token) {
      return NextResponse.json({ error: "アクセストークンが必要です" }, { status: 401 });
    }

    const deleted = await deleteGeoBrand(brandId, token);
    if (!deleted) {
      return NextResponse.json({ error: "アクセスできません" }, { status: 403 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[DELETE /api/geo/brands]", error);
    return NextResponse.json({ error: "プロジェクトの削除に失敗しました" }, { status: 500 });
  }
}
