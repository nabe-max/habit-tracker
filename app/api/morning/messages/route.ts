import { NextResponse } from "next/server";

import { getUserById, upsertPendingMessage } from "@/lib/morning/db";
import { computeNextMorningDelivery } from "@/lib/morning/schedule";
import { getSessionFromCookies } from "@/lib/morning/session";

export async function POST(req: Request) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as { body?: string };
    const text = body.body?.trim();

    if (!text) {
      return NextResponse.json({ error: "メッセージを入力してください" }, { status: 400 });
    }
    if (text.length > 500) {
      return NextResponse.json({ error: "500文字以内にしてください" }, { status: 400 });
    }

    const user = await getUserById(session.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const deliverAt = computeNextMorningDelivery(
      user.timezone,
      user.morning_hour,
      user.morning_minute,
    );
    const message = await upsertPendingMessage(user.id, text, deliverAt);

    return NextResponse.json({ message });
  } catch (error) {
    console.error("[POST /api/morning/messages]", error);
    return NextResponse.json({ error: "保存に失敗しました" }, { status: 500 });
  }
}
