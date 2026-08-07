import { NextRequest, NextResponse } from "next/server";

import { consumeAuthToken, upsertUser } from "@/lib/morning/db";
import { isMorningConfigured } from "@/lib/morning/env";
import { setSessionCookie } from "@/lib/morning/session";

export async function GET(req: NextRequest) {
  if (!isMorningConfigured()) {
    return NextResponse.redirect(new URL("/morning/setup", req.url));
  }

  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/morning?error=invalid_link", req.url));
  }

  try {
    const email = await consumeAuthToken(token);
    if (!email) {
      return NextResponse.redirect(new URL("/morning?error=expired_link", req.url));
    }

    const user = await upsertUser(email);
    await setSessionCookie({ userId: user.id, email: user.email });

    return NextResponse.redirect(new URL("/morning", req.url));
  } catch (error) {
    console.error("[GET /api/morning/auth/verify]", error);
    return NextResponse.redirect(new URL("/morning?error=login_failed", req.url));
  }
}
