import { NextResponse } from "next/server";

import { getUserById, updateUserSettings } from "@/lib/morning/db";
import { getSessionFromCookies } from "@/lib/morning/session";

export async function PATCH(req: Request) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as {
      timezone?: string;
      morning_hour?: number;
      morning_minute?: number;
    };

    const user = await getUserById(session.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const morningHour = body.morning_hour ?? user.morning_hour;
    const morningMinute = body.morning_minute ?? user.morning_minute;
    const timezone = body.timezone ?? user.timezone;

    if (morningHour < 0 || morningHour > 23 || morningMinute < 0 || morningMinute > 59) {
      return NextResponse.json({ error: "Invalid time" }, { status: 400 });
    }

    const updated = await updateUserSettings(user.id, {
      timezone,
      morning_hour: morningHour,
      morning_minute: morningMinute,
    });

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error("[PATCH /api/morning/settings]", error);
    return NextResponse.json({ error: "設定の更新に失敗しました" }, { status: 500 });
  }
}
