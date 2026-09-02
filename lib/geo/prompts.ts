export const MAX_CUSTOM_PROMPTS = 10;
export const MIN_PROMPT_LENGTH = 5;
export const MAX_PROMPT_LENGTH = 500;

export function normalizePromptText(prompt: string): string {
  return prompt.trim().replace(/\s+/g, " ");
}

function promptKey(prompt: string): string {
  return normalizePromptText(prompt).toLowerCase();
}

export function buildDefaultGeoPrompts(params: {
  brandName: string;
  clientCategory: string;
  location?: string;
}): string[] {
  const { brandName, clientCategory, location } = params;
  const area = location?.trim() || "日本";
  const category = clientCategory.trim() || "サービス";

  return [
    `${area}でおすすめの${category}を教えてください。`,
    `${area}で評判のいい${category}はどこですか？`,
    `${area}の${category}で口コミが良いところを教えてください。`,
    `${area}で${brandName}のような${category}を探しています。`,
    `${category}を選ぶときのポイントと、${area}のおすすめを教えてください。`,
    `${brandName}の評判や特徴を教えてください。`,
  ];
}

/** @deprecated use buildDefaultGeoPrompts */
export const buildGeoPrompts = buildDefaultGeoPrompts;

export function resolveGeoPrompts(params: {
  brandName: string;
  clientCategory: string;
  location?: string;
  customPrompts?: string[];
  manualOnly?: boolean;
}): string[] {
  const customs = (params.customPrompts ?? [])
    .map((prompt) => normalizePromptText(prompt))
    .filter(Boolean);

  if (params.manualOnly) {
    return customs;
  }

  const defaults = buildDefaultGeoPrompts(params);
  const seen = new Set<string>();
  const merged: string[] = [];

  for (const prompt of [...defaults, ...customs]) {
    const key = promptKey(prompt);
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(prompt);
  }

  return merged;
}

export function isDuplicatePrompt(
  prompt: string,
  existing: string[],
): boolean {
  const key = promptKey(prompt);
  return existing.some((item) => promptKey(item) === key);
}

export function parsePromptLines(text: string): string[] {
  const seen = new Set<string>();
  const prompts: string[] = [];

  for (const line of text.split(/\n/)) {
    const normalized = normalizePromptText(line);
    if (!normalized) continue;
    const key = promptKey(normalized);
    if (seen.has(key)) continue;
    seen.add(key);
    prompts.push(normalized);
  }

  return prompts;
}

export function isManualPromptBrand(brand: {
  website: string | null;
  custom_prompts?: string[];
}): boolean {
  return !brand.website?.trim() && (brand.custom_prompts?.length ?? 0) > 0;
}
