import type { GeoPromptResult } from "@/lib/geo/types";

function normalizeName(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

export function detectMention(text: string, brandName: string): boolean {
  const normalizedText = normalizeName(text);
  const normalizedBrand = normalizeName(brandName);
  if (!normalizedBrand) return false;
  return normalizedText.includes(normalizedBrand);
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
