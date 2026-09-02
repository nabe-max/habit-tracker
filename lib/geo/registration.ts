import {
  MAX_CUSTOM_PROMPTS,
  MAX_PROMPT_LENGTH,
  MIN_PROMPT_LENGTH,
  normalizePromptText,
  parsePromptLines,
} from "@/lib/geo/prompts";

export type GeoSetupMode = "domain" | "manual";

export function normalizeWebsite(value?: string): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  return trimmed;
}

export function isValidWebsite(value: string): boolean {
  try {
    const url = new URL(value.includes("://") ? value : `https://${value}`);
    return Boolean(url.hostname.includes("."));
  } catch {
    return false;
  }
}

export interface ParsedGeoRegistration {
  setupMode: GeoSetupMode;
  brandName: string;
  clientCategory: string;
  location?: string;
  website?: string;
  competitors: string[];
  customPrompts: string[];
  manualOnly: boolean;
}

export function parseGeoRegistration(body: {
  setupMode?: GeoSetupMode;
  brandName?: string;
  clientCategory?: string;
  location?: string;
  website?: string;
  competitors?: string[];
  competitorsText?: string;
  customPrompts?: string[];
  customPromptsText?: string;
}): ParsedGeoRegistration {
  const setupMode: GeoSetupMode = body.setupMode === "manual" ? "manual" : "domain";
  const brandName = body.brandName?.trim() ?? "";
  const clientCategory = body.clientCategory?.trim() ?? "";
  const location = body.location?.trim();
  const website = normalizeWebsite(body.website) ?? undefined;
  const competitors = body.competitors?.length
    ? body.competitors
    : (body.competitorsText ?? "")
        .split(/[,、\n]/)
        .map((value) => value.trim())
        .filter(Boolean);

  const customPrompts =
    body.customPrompts?.length
      ? body.customPrompts.map((prompt) => normalizePromptText(prompt)).filter(Boolean)
      : parsePromptLines(body.customPromptsText ?? "");

  return {
    setupMode,
    brandName,
    clientCategory,
    location,
    website,
    competitors: competitors.slice(0, 5),
    customPrompts: customPrompts.slice(0, MAX_CUSTOM_PROMPTS),
    manualOnly: setupMode === "manual",
  };
}

export function validateGeoRegistration(input: ParsedGeoRegistration): string | null {
  if (!input.brandName) {
    return "クライアント名を入力してください";
  }

  if (!input.clientCategory) {
    return "クライアント業種を入力してください";
  }

  if (input.setupMode === "domain") {
    if (!input.website) {
      return "Webサイト（ドメイン）を入力してください";
    }
    if (!isValidWebsite(input.website)) {
      return "WebサイトのURL形式が正しくありません";
    }
    return null;
  }

  if (!input.location) {
    return "エリアを入力してください";
  }

  if (input.customPrompts.length === 0) {
    return "監視プロンプトを1件以上入力してください";
  }

  for (const prompt of input.customPrompts) {
    if (prompt.length < MIN_PROMPT_LENGTH) {
      return `プロンプトは${MIN_PROMPT_LENGTH}文字以上で入力してください`;
    }
    if (prompt.length > MAX_PROMPT_LENGTH) {
      return `プロンプトは${MAX_PROMPT_LENGTH}文字以内で入力してください`;
    }
  }

  return null;
}
