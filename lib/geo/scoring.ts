import type { GeoPromptResult } from "@/lib/geo/types";

function normalizeName(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

export function namesMatch(a: string, b: string): boolean {
  const left = normalizeName(a);
  const right = normalizeName(b);
  if (!left || !right) return false;
  return left === right || left.includes(right) || right.includes(left);
}

function findBrandIndex(text: string, brandName: string): number {
  const lower = text.toLowerCase();
  const trimmed = brandName.trim();
  const candidates = [trimmed, trimmed.split(/\s+/)[0] ?? ""].filter(Boolean);

  let best = -1;
  for (const candidate of candidates) {
    const index = lower.indexOf(candidate.toLowerCase());
    if (index !== -1 && (best === -1 || index < best)) {
      best = index;
    }
  }

  return best;
}

export function detectMention(text: string, brandName: string): boolean {
  return findBrandIndex(text, brandName) !== -1;
}

export function detectCompetitorMentions(text: string, competitors: string[]): string[] {
  return competitors.filter((name) => detectMention(text, name));
}

export function classifySentiment(text: string, brandName: string): GeoPromptResult["sentiment"] {
  if (!detectMention(text, brandName)) return "none";

  const positive = /おすすめ|評判|信頼|人気|便利|高評価|リーズナブル|丁寧|安心/i;
  const negative = /注意|避け|問題|クレーム|高い|悪い|残念/i;

  if (positive.test(text)) return "positive";
  if (negative.test(text)) return "negative";
  return "neutral";
}

export function buildExcerpt(text: string, brandName: string, maxLength = 180): string {
  const index = text.toLowerCase().indexOf(brandName.toLowerCase());
  if (index === -1) {
    return `${text.slice(0, maxLength)}${text.length > maxLength ? "…" : ""}`;
  }

  const start = Math.max(0, index - 60);
  const excerpt = text.slice(start, start + maxLength);
  return `${start > 0 ? "…" : ""}${excerpt}${start + maxLength < text.length ? "…" : ""}`;
}

export function calculateVisibilityScore(mentionCount: number, totalPrompts: number): number {
  if (totalPrompts === 0) return 0;
  return Math.round((mentionCount / totalPrompts) * 100);
}

export function buildRankings(
  text: string,
  trackedNames: string[],
): Array<{ name: string; position: number }> {
  const found: Array<{ name: string; index: number }> = [];

  for (const name of trackedNames) {
    const trimmed = name.trim();
    if (!trimmed) continue;

    const index = findBrandIndex(text, trimmed);
    if (index !== -1) {
      found.push({ name: trimmed, index });
    }
  }

  found.sort((a, b) => a.index - b.index);

  const seen = new Set<string>();
  const ordered: Array<{ name: string; index: number }> = [];
  for (const item of found) {
    const key = normalizeName(item.name);
    if (seen.has(key)) continue;
    seen.add(key);
    ordered.push(item);
  }

  return ordered.map((item, index) => ({
    name: item.name,
    position: index + 1,
  }));
}

export function averagePosition(
  promptResults: GeoPromptResult[],
  brandName: string,
): number | null {
  const positions = promptResults
    .flatMap((result) => result.rankings)
    .filter((entry) => namesMatch(entry.name, brandName))
    .map((entry) => entry.position);

  if (positions.length === 0) return null;

  const avg = positions.reduce((sum, value) => sum + value, 0) / positions.length;
  return Math.round(avg * 10) / 10;
}

export function rankCompetitors(
  promptResults: GeoPromptResult[],
  competitors: string[],
): Array<{ name: string; mentionCount: number; rate: number }> {
  const total = promptResults.length;

  return competitors
    .map((name) => {
      const mentionCount = promptResults.filter((result) =>
        result.competitorsMentioned.some(
          (competitor) => normalizeName(competitor) === normalizeName(name),
        ),
      ).length;
      return {
        name,
        mentionCount,
        rate: total > 0 ? Math.round((mentionCount / total) * 100) : 0,
      };
    })
    .sort((a, b) => b.mentionCount - a.mentionCount);
}

export function positionInRankings(
  rankings: Array<{ name: string; position: number }>,
  brandName: string,
): number | null {
  const entry = rankings.find((item) => namesMatch(item.name, brandName));
  return entry?.position ?? null;
}

export function buildPositionRankings(
  promptResults: GeoPromptResult[],
  brandName: string,
  competitors: string[],
): Array<{ name: string; avgPosition: number | null; mentionCount: number; rate: number }> {
  const total = promptResults.length;
  const names = [brandName, ...competitors];

  return names
    .map((name) => {
      const mentionCount = promptResults.filter((result) =>
        result.rankings.some((entry) => namesMatch(entry.name, name)),
      ).length;

      return {
        name,
        avgPosition: averagePosition(promptResults, name),
        mentionCount,
        rate: total > 0 ? Math.round((mentionCount / total) * 100) : 0,
      };
    })
    .sort((a, b) => {
      if (a.avgPosition === null && b.avgPosition === null) return b.rate - a.rate;
      if (a.avgPosition === null) return 1;
      if (b.avgPosition === null) return -1;
      return a.avgPosition - b.avgPosition;
    });
}
