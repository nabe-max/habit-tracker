export const SHUUKATSU_MONTHLY_LIMIT = 3;
export const SHUUKATSU_USAGE_COOKIE = "shuukatsu_usage";

export interface ShuukatsuUsage {
  month: string;
  count: number;
}

export interface ShuukatsuUsageSummary {
  limit: number;
  used: number;
  remaining: number;
  month: string;
}

export function getCurrentMonthKey(): string {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
  })
    .format(new Date())
    .slice(0, 7);
}

export function parseShuukatsuUsage(raw: string | undefined): ShuukatsuUsage {
  const month = getCurrentMonthKey();
  if (!raw) {
    return { month, count: 0 };
  }

  try {
    const parsed = JSON.parse(raw) as ShuukatsuUsage;
    if (parsed.month !== month || typeof parsed.count !== "number") {
      return { month, count: 0 };
    }
    return { month, count: Math.max(0, parsed.count) };
  } catch {
    return { month, count: 0 };
  }
}

export function summarizeShuukatsuUsage(
  usage: ShuukatsuUsage,
): ShuukatsuUsageSummary {
  const used = Math.min(usage.count, SHUUKATSU_MONTHLY_LIMIT);
  return {
    limit: SHUUKATSU_MONTHLY_LIMIT,
    used,
    remaining: Math.max(0, SHUUKATSU_MONTHLY_LIMIT - used),
    month: usage.month,
  };
}

export function isShuukatsuUsageLimitReached(usage: ShuukatsuUsage): boolean {
  return usage.count >= SHUUKATSU_MONTHLY_LIMIT;
}

export function serializeShuukatsuUsage(usage: ShuukatsuUsage): string {
  return JSON.stringify(usage);
}

export const SHUUKATSU_USAGE_LIMIT_MESSAGE =
  "今月の無料利用回数（3回）に達しました。来月1日（日本時間）にリセットされます。";
