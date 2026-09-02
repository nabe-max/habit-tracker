import { getOpenAIClient } from "@/lib/openai";
import {
  MAX_CUSTOM_PROMPTS,
  MAX_PROMPT_LENGTH,
  MIN_PROMPT_LENGTH,
  normalizePromptText,
} from "@/lib/geo/prompts";

const SUGGESTION_MODEL = "gpt-4o-mini";
const DEFAULT_SUGGESTION_COUNT = 8;

export async function generatePromptSuggestions(params: {
  brandName: string;
  clientCategory: string;
  location?: string;
  website?: string;
  count?: number;
}): Promise<string[]> {
  const count = Math.min(params.count ?? DEFAULT_SUGGESTION_COUNT, MAX_CUSTOM_PROMPTS);
  const area = params.location?.trim() || "日本";

  const openai = getOpenAIClient();
  const completion = await openai.chat.completions.create({
    model: SUGGESTION_MODEL,
    temperature: 0.7,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "あなたはGEO（Generative Engine Optimization）の専門家です。AI検索（ChatGPT等）でブランドが見つかるかを測るための、自然な日本語プロンプトを提案してください。各プロンプトはユーザーがAIに実際に聞きそうな会話調の質問にしてください。JSONのみ返してください。",
      },
      {
        role: "user",
        content: JSON.stringify({
          brandName: params.brandName,
          clientCategory: params.clientCategory,
          area,
          website: params.website,
          count,
          rules: [
            "おすすめ・比較・評判・選び方など意図を分散させる",
            "ブランド名を直接含めすぎない（1〜2件まで）",
            `${MIN_PROMPT_LENGTH}〜${MAX_PROMPT_LENGTH}文字`,
            "1プロンプト1質問",
          ],
          format: { prompts: ["string"] },
        }),
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";

  try {
    const parsed = JSON.parse(raw) as { prompts?: string[] };
    if (Array.isArray(parsed.prompts)) {
      const seen = new Set<string>();
      const prompts: string[] = [];

      for (const item of parsed.prompts) {
        const normalized = normalizePromptText(item);
        if (normalized.length < MIN_PROMPT_LENGTH || normalized.length > MAX_PROMPT_LENGTH) {
          continue;
        }
        const key = normalized.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        prompts.push(normalized);
        if (prompts.length >= count) break;
      }

      if (prompts.length > 0) return prompts;
    }
  } catch {
    // fall through
  }

  return [
    `${area}でおすすめの${params.clientCategory}を教えてください。`,
    `${area}で評判のいい${params.clientCategory}はどこですか？`,
    `${params.clientCategory}を選ぶときのポイントと、${area}のおすすめを教えてください。`,
    `${area}の${params.clientCategory}で口コミが良いところを教えてください。`,
    `${params.clientCategory}の料金相場とおすすめを教えてください。`,
  ].map(normalizePromptText);
}
