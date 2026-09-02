import { normalizeBrandKey, normalizeBrandName } from "@/lib/geo/brand-extraction";
import type { GeoPromptResult, GeoSuggestedCompetitor, GeoTrackedCompetitor } from "@/lib/geo/types";

const SUGGESTION_THRESHOLD = 2;
const MAX_COMPETITORS = 5;

function isSameBrand(a: string, b: string): boolean {
  const left = normalizeBrandKey(a);
  const right = normalizeBrandKey(b);
  if (!left || !right) return false;
  return left === right || left.includes(right) || right.includes(left);
}

export function parseTrackedCompetitors(raw: unknown): GeoTrackedCompetitor[] {
  if (!Array.isArray(raw)) return [];

  const result: GeoTrackedCompetitor[] = [];

  for (const item of raw) {
    if (typeof item === "string") {
      const trimmed = item.trim();
      if (!trimmed) continue;

      if (trimmed.startsWith("{")) {
        try {
          const parsed = JSON.parse(trimmed) as Partial<GeoTrackedCompetitor>;
          const trackedName = normalizeBrandName(parsed.trackedName ?? "");
          const displayName = (parsed.displayName ?? trackedName).trim();
          if (trackedName && displayName) {
            result.push({
              trackedName,
              displayName,
              domain: parsed.domain?.trim() || undefined,
            });
          }
          continue;
        } catch {
          // fall through to plain name
        }
      }

      const name = normalizeBrandName(trimmed);
      if (name) {
        result.push({ trackedName: name, displayName: name });
      }
      continue;
    }

    if (item && typeof item === "object") {
      const obj = item as Record<string, unknown>;
      const trackedName = normalizeBrandName(String(obj.trackedName ?? obj.tracked_name ?? ""));
      const displayName = String(obj.displayName ?? obj.display_name ?? trackedName).trim();
      if (!trackedName || !displayName) continue;

      result.push({
        trackedName,
        displayName,
        domain: obj.domain ? String(obj.domain).trim() : undefined,
      });
    }
  }

  return result.slice(0, MAX_COMPETITORS);
}

export function getTrackedNames(competitors: GeoTrackedCompetitor[]): string[] {
  return competitors.map((competitor) => competitor.trackedName);
}

export function resolveDisplayName(
  trackedName: string,
  competitors: GeoTrackedCompetitor[],
): string {
  const match = competitors.find((competitor) =>
    isSameBrand(competitor.trackedName, trackedName),
  );
  return match?.displayName ?? trackedName;
}

function isExcludedBrand(
  name: string,
  brandName: string,
  competitors: GeoTrackedCompetitor[],
  rejected: string[],
): boolean {
  if (isSameBrand(name, brandName)) return true;
  if (competitors.some((competitor) => isSameBrand(name, competitor.trackedName))) return true;
  if (rejected.some((item) => isSameBrand(name, item))) return true;
  return false;
}

export function computeScanCoOccurrences(
  brandName: string,
  promptResults: GeoPromptResult[],
  competitors: GeoTrackedCompetitor[],
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

export function canAddCompetitor(current: GeoTrackedCompetitor[]): boolean {
  return current.length < MAX_COMPETITORS;
}

export function addCompetitor(
  current: GeoTrackedCompetitor[],
  competitor: GeoTrackedCompetitor,
): GeoTrackedCompetitor[] {
  const trackedName = normalizeBrandName(competitor.trackedName);
  const displayName = competitor.displayName.trim();
  if (!trackedName || !displayName || !canAddCompetitor(current)) return current;
  if (current.some((item) => isSameBrand(item.trackedName, trackedName))) return current;

  return [
    ...current,
    {
      trackedName,
      displayName,
      domain: competitor.domain?.trim() || undefined,
    },
  ].slice(0, MAX_COMPETITORS);
}

export { MAX_COMPETITORS, SUGGESTION_THRESHOLD, isSameBrand };
