import { normalizeBrandKey, normalizeBrandName } from "@/lib/geo/brand-extraction";
import type { GeoPromptResult, GeoSuggestedCompetitor } from "@/lib/geo/types";

const SUGGESTION_THRESHOLD = 2;
const MAX_COMPETITORS = 5;

function isSameBrand(a: string, b: string): boolean {
  const left = normalizeBrandKey(a);
  const right = normalizeBrandKey(b);
  if (!left || !right) return false;
  return left === right || left.includes(right) || right.includes(left);
}

function isExcludedBrand(
  name: string,
  brandName: string,
  competitors: string[],
  rejected: string[],
): boolean {
  if (isSameBrand(name, brandName)) return true;
  if (competitors.some((competitor) => isSameBrand(name, competitor))) return true;
  if (rejected.some((item) => isSameBrand(name, item))) return true;
  return false;
}

export function computeScanCoOccurrences(
  brandName: string,
  promptResults: GeoPromptResult[],
  competitors: string[],
  rejected: string[] = [],
): GeoSuggestedCompetitor[] {
  const counts = new Map<string, number>();

  for (const result of promptResults) {
    if (!result.mentioned) continue;

    for (const detected of result.detectedBrands) {
      if (isExcludedBrand(detected, brandName, competitors, rejected)) continue;

      const key = normalizeBrandKey(detected);
      const existing = [...counts.keys()].find((item) => normalizeBrandKey(item) === key);
      const label = existing ?? normalizeBrandName(detected);
      counts.set(label, (counts.get(label) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([name, mentionCount]) => ({ name, mentionCount }))
    .sort((a, b) => b.mentionCount - a.mentionCount);
}

export function filterSuggestedCompetitors(
  suggestions: GeoSuggestedCompetitor[],
  threshold = SUGGESTION_THRESHOLD,
): GeoSuggestedCompetitor[] {
  return suggestions.filter((item) => item.mentionCount >= threshold);
}

export function canAddCompetitor(current: string[]): boolean {
  return current.length < MAX_COMPETITORS;
}

export function addCompetitor(current: string[], name: string): string[] {
  const trimmed = normalizeBrandName(name);
  if (!trimmed || !canAddCompetitor(current)) return current;
  if (current.some((item) => isSameBrand(item, trimmed))) return current;
  return [...current, trimmed].slice(0, MAX_COMPETITORS);
}

export { MAX_COMPETITORS, SUGGESTION_THRESHOLD };
