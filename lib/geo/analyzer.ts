import { getOpenAIClient } from "@/lib/openai";
import { buildGeoPrompts } from "@/lib/geo/prompts";
import {
  buildExcerpt,
  calculateVisibilityScore,
  classifySentiment,
  detectCompetitorMentions,
  detectMention,
  rankCompetitors,
} from "@/lib/geo/scoring";
import type { GeoScanRequest, GeoScanResult } from "@/lib/geo/types";

const SCAN_MODEL = "gpt-4o-mini";

async function askAi(prompt: string): Promise<string> {
  const openai = getOpenAIClient();
  const completion = await openai.chat.completions.create({
    model: SCAN_MODEL,
    temperature: 0.4,
    messages: [
      {
        role: "system",
        content:
          "あなたは日本のユーザー向けに、具体的で実用的なおすすめを日本語で答えるアシスタントです。可能な限り具体的な会社名・サービス名・店名を挙げてください。",
      },
      { role: "user", content: prompt },
    ],
  });

  return completion.choices[0]?.message?.content?.trim() ?? "";
}

async function buildRecommendations(params: {
  brandName: string;
  visibilityScore: number;
  promptResults: GeoScanResult["promptResults"];
  competitors: string[];
}): Promise<string[]> {
  const openai = getOpenAIClient();
  const missedPrompts = params.promptResults
    .filter((result) => !result.mentioned)
    .map((result) => result.prompt);

  const completion = await openai.chat.completions.create({
    model: SCAN_MODEL,
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "GEO（Generative Engine Optimization）の専門家として、AI検索でブランドの可視性を上げるための具体的な改善提案を日本語で3つ返してください。JSONのみ返してください。",
      },
      {
        role: "user",
        content: JSON.stringify({
          brandName: params.brandName,
          visibilityScore: params.visibilityScore,
          missedPrompts,
          competitors: params.competitors,
          format: { recommendations: ["string", "string", "string"] },
        }),
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  try {
    const parsed = JSON.parse(raw) as { recommendations?: string[] };
    if (Array.isArray(parsed.recommendations) && parsed.recommendations.length > 0) {
      return parsed.recommendations.slice(0, 3);
    }
  } catch {
    // fall through
  }

  return [
    "公式サイトにFAQ・事例・サービス説明を追加し、AIが引用しやすい構造化コンテンツを整備する",
    "業界キーワードを含むブログ記事・比較記事を公開し、第三者サイトでの言及を増やす",
    "Googleビジネスプロフィール・口コミ・メディア掲載を強化し、信頼シグナルを増やす",
  ];
}

export async function runGeoScan(request: GeoScanRequest): Promise<GeoScanResult> {
  const competitors = (request.competitors ?? []).map((name) => name.trim()).filter(Boolean);
  const prompts = buildGeoPrompts({
    industry: request.industry,
    brandName: request.brandName,
    location: request.location,
  });

  const promptResults: GeoScanResult["promptResults"] = [];

  for (const prompt of prompts) {
    const answer = await askAi(prompt);
    const mentioned = detectMention(answer, request.brandName);
    promptResults.push({
      prompt,
      mentioned,
      competitorsMentioned: detectCompetitorMentions(answer, competitors),
      excerpt: buildExcerpt(answer, request.brandName),
      sentiment: classifySentiment(answer, request.brandName),
    });
  }

  const mentionCount = promptResults.filter((result) => result.mentioned).length;
  const visibilityScore = calculateVisibilityScore(mentionCount, promptResults.length);
  const recommendations = await buildRecommendations({
    brandName: request.brandName,
    visibilityScore,
    promptResults,
    competitors,
  });

  return {
    brandName: request.brandName,
    industry: request.industry,
    visibilityScore,
    mentionCount,
    totalPrompts: promptResults.length,
    competitorScores: rankCompetitors(promptResults, competitors),
    promptResults,
    recommendations,
    scannedAt: new Date().toISOString(),
  };
}
