import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import {
  SHUUKATSU_USAGE_COOKIE,
  parseShuukatsuUsage,
  summarizeShuukatsuUsage,
} from "@/lib/shuukatsuUsage";

export async function GET() {
  const cookieStore = await cookies();
  const usage = parseShuukatsuUsage(cookieStore.get(SHUUKATSU_USAGE_COOKIE)?.value);
  return NextResponse.json(summarizeShuukatsuUsage(usage));
}
