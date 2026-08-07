import { NextResponse } from "next/server";

import { clearSessionCookie } from "@/lib/morning/session";

export async function POST() {
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
