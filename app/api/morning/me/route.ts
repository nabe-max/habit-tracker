import { NextResponse } from "next/server";

import { getPendingMessage, getUserById, listMessages } from "@/lib/morning/db";
import { getSessionFromCookies } from "@/lib/morning/session";

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await getUserById(session.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const [pending, history] = await Promise.all([
      getPendingMessage(user.id),
      listMessages(user.id),
    ]);

    return NextResponse.json({ user, pending, history });
  } catch (error) {
    console.error("[GET /api/morning/me]", error);
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
  }
}
