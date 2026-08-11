import { NextResponse } from "next/server";

import { createAuthToken } from "@/lib/morning/db";
import { sendLoginEmail } from "@/lib/morning/email";
import { getMorningConfig, isMorningConfigured } from "@/lib/morning/env";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  if (!isMorningConfigured()) {
    return NextResponse.json(
      { error: "Morning You is not configured on the server" },
      { status: 503 },
    );
  }

  try {
    const body = (await req.json()) as { email?: string };
    const email = body.email?.trim().toLowerCase();

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await createAuthToken(email, token, expiresAt);

    const loginUrl = `${getMorningConfig().appUrl}/api/morning/auth/verify?token=${token}`;
    await sendLoginEmail(email, loginUrl);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[POST /api/morning/auth/request]", error);
    return NextResponse.json({ error: "Failed to send login link" }, { status: 500 });
  }
}
