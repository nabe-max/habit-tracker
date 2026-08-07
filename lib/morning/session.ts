import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

import { getMorningConfig } from "@/lib/morning/env";
import type { MorningSession } from "@/types/morning";

const COOKIE_NAME = "morning_session";

function getSecret() {
  const secret = getMorningConfig().sessionSecret;
  if (!secret) throw new Error("MORNING_SESSION_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(session: MorningSession): Promise<string> {
  return new SignJWT({ userId: session.userId, email: session.email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<MorningSession | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (typeof payload.userId !== "string" || typeof payload.email !== "string") {
      return null;
    }
    return { userId: payload.userId, email: payload.email };
  } catch {
    return null;
  }
}

export async function setSessionCookie(session: MorningSession): Promise<void> {
  const token = await createSessionToken(session);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSessionFromCookies(): Promise<MorningSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
