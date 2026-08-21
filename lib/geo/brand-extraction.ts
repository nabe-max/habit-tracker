import { getOpenAIClient } from "@/lib/openai";

const SCAN_MODEL = "gpt-4o-mini";

const GENERIC_TERMS = new Set([
  "おすすめ",
  "大手",
  "人気",
  "有名",
  "その他",
  "など",
  "例",
  "top",
  "best",
]);

export function normalizeBrandKey(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

export function normalizeBrandName(value: string): string {
  return value.trim();
}

export function isLikelyBrandName(value: string): boolean {
  const trimmed = normalizeBrandName(value);
  if (trimmed.length < 2 || trimmed.length > 40) return false;
  if (GENERIC_TERMS.has(normalizeBrandKey(trimmed))) return false;
  if (/^[\d\s\-・、。]+$/.test(trimmed)) return false;
  return true;
}

export function dedupeBrandNames(names: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const name of names) {
    const normalized = normalizeBrandName(name);
    if (!isLikelyBrandName(normalized)) continue;

    const key = normalizeBrandKey(normalized);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(normalized);
  }

  return result;
}

export async function extractBrandsFromAnswers(
  items: Array<{ id: string; answer: string }>,
  clientCategory: string,
): Promise<Record<string, string[]>> {
  if (items.length === 0) return {};

  const openai = getOpenAIClient();
  const completion = await openai.chat.completions.create({
    model: SCAN_MODEL,
    temperature: 0,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `あなたは${clientCategory}分野のブランド抽出器です。AI回答から具体的なブランド名・会社名・サービス名・店舗名だけを抽出してください。カテゴリ語・形容詞・説明文は除外し、JSONのみ返してください。`,
      },
      {
        role: "user",
        content: JSON.stringify({
          answers: items.map((item) => ({ id: item.id, text: item.answer.slice(0, 1200) })),
          format: { results: [{ id: "string", brands: ["string"] }] },
        }),
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  const output: Record<string, string[]> = {};

  try {
    const parsed = JSON.parse(raw) as { results?: Array<{ id?: string; brands?: string[] }> };
    for (const entry of parsed.results ?? []) {
      if (!entry.id) continue;
      output[entry.id] = dedupeBrandNames(entry.brands ?? []);
    }
  } catch {
    for (const item of items) {
      output[item.id] = [];
    }
  }

  for (const item of items) {
    if (!output[item.id]) output[item.id] = [];
  }

  return output;
}
