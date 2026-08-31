import type { NextRequest } from "next/server";

export function isCronAuthorized(req: NextRequest, cronSecret: string): boolean {
  const secret = cronSecret.trim();
  if (!secret) return false;

  const authHeader = req.headers.get("authorization")?.trim();
  if (authHeader === `Bearer ${secret}`) return true;

  const token = new URL(req.url).searchParams.get("token")?.trim();
  return token === secret;
}
