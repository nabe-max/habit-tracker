export const MAX_CUSTOM_PROMPTS = 10;
export const MIN_PROMPT_LENGTH = 5;
export const MAX_PROMPT_LENGTH = 500;

export function normalizePromptText(prompt: string): string {
  return prompt.trim().replace(/\s+/g, " ");
}

function promptKey(prompt: string): string {
  return normalizePromptText(prompt).toLowerCase();
}

export function resolveGeoPrompts(params: {
  customPrompts?: string[];
}): string[] {
  const seen = new Set<string>();
  const prompts: string[] = [];

  for (const prompt of params.customPrompts ?? []) {
    const normalized = normalizePromptText(prompt);
    if (!normalized) continue;
    const key = promptKey(normalized);
    if (seen.has(key)) continue;
    seen.add(key);
    prompts.push(normalized);
  }

  return prompts;
}

export function isDuplicatePrompt(prompt: string, existing: string[]): boolean {
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

/** 旧標準プロンプト。custom_prompts が空の既存ブランドを cron 再開するときのフォールバック用 */
export function buildLegacyDefaultPrompts(params: {
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
