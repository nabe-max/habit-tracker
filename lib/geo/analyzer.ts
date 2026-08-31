import { getOpenAIClient } from "@/lib/openai";
import { resolveGeoPrompts } from "@/lib/geo/prompts";
import { extractBrandsFromAnswers } from "@/lib/geo/brand-extraction";
import { computeScanCoOccurrences } from "@/lib/geo/competitors";
import {
  buildExcerpt,
  buildPositionRankings,
  buildRankings,
  calculateVisibilityScore,
  classifySentiment,
  detectCompetitorMentions,
  detectMention,
  averagePosition,
  positionInRankings,
  rankCompetitors,
} from "@/lib/geo/scoring";
import type { GeoScanRequest, GeoScanResult } from "@/lib/geo/types";

const SCAN_MODEL = "gpt-4o-mini";

async function askAi(prompt: string, clientCategory: string): Promise<string> {
  const openai = getOpenAIClient();
  const completion = await openai.chat.completions.create({
    model: SCAN_MODEL,
    temperature: 0.4,
    messages: [
      {
        role: "system",
        content: `あなたは日本のユーザー向けに、${clientCategory}のおすすめを具体的に日本語で答えるアシスタントです。可能な限り具体的なブランド名・会社名・店名を挙げてください。`,
      },
      { role: "user", content: prompt },
    ],
  });

  return completion.choices[0]?.message?.content?.trim() ?? "";
}

async function buildRecommendations(params: {
  brandName: string;
  clientCategory: string;
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
          "GEO（Generative Engine Optimization）の専門家として、マーケティング代理店がクライアントに提案できる具体的な改善アクションを日本語で3つ返してください。代理店がそのままレポートに転記できる粒度で書いてください。JSONのみ返してください。",
      },
      {
        role: "user",
        content: JSON.stringify({
          brandName: params.brandName,
          clientCategory: params.clientCategory,
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
    "公式サイトにFAQ・サービス説明・事例を追加し、AIが引用しやすい構造化コンテンツを整備する",
    "業界キーワードを含むブログ記事・比較記事を公開し、第三者サイトでの言及を増やす",
    "Googleビジネスプロフィール・口コミ・メディア掲載を強化し、信頼シグナルを増やす",
  ];
}

export async function runGeoScan(
  request: GeoScanRequest,
  options?: { includeRecommendations?: boolean; includeBrandExtraction?: boolean },
): Promise<GeoScanResult> {
  const includeRecommendations = options?.includeRecommendations ?? true;
  const includeBrandExtraction = options?.includeBrandExtraction ?? true;
  const competitors = (request.competitors ?? []).map((name) => name.trim()).filter(Boolean);
  const clientCategory = request.clientCategory.trim();
  const prompts = resolveGeoPrompts({
    brandName: request.brandName,
    clientCategory,
    location: request.location,
    customPrompts: request.customPrompts,
  });

  const promptResults: GeoScanResult["promptResults"] = [];
  const answers: Array<{ id: string; answer: string }> = [];

  for (const [index, prompt] of prompts.entries()) {
    const answer = await askAi(prompt, clientCategory);
    const id = `prompt-${index}`;
    answers.push({ id, answer });

    promptResults.push({
      prompt,
      mentioned: detectMention(answer, request.brandName),
      competitorsMentioned: detectCompetitorMentions(answer, competitors),
      detectedBrands: [],
      excerpt: buildExcerpt(answer, request.brandName),
      sentiment: classifySentiment(answer, request.brandName),
      position: null,
      rankings: [],
    });
  }

  const extractedBrands = includeBrandExtraction
    ? await extractBrandsFromAnswers(answers, clientCategory)
    : {};

  for (const [index, result] of promptResults.entries()) {
    const id = `prompt-${index}`;
    const answer = answers[index]?.answer ?? "";
    const detectedBrands = extractedBrands[id] ?? [];
    result.detectedBrands = detectedBrands;

    const trackedNames = [request.brandName, ...competitors, ...detectedBrands];
    const rankings = buildRankings(answer, trackedNames);
    result.rankings = rankings;
    result.position = positionInRankings(rankings, request.brandName);
  }

  const mentionCount = promptResults.filter((result) => result.mentioned).length;
  const visibilityScore = calculateVisibilityScore(mentionCount, promptResults.length);
  const positionScore = averagePosition(promptResults, request.brandName);
  const positionRankings = buildPositionRankings(promptResults, request.brandName, competitors);
  const suggestedCompetitors = computeScanCoOccurrences(
    request.brandName,
    promptResults,
    competitors,
  );
  const recommendations = includeRecommendations
    ? await buildRecommendations({
        brandName: request.brandName,
        clientCategory,
        visibilityScore,
        promptResults,
        competitors,
      })
    : [];

  return {
    brandName: request.brandName,
    clientCategory,
    visibilityScore,
    positionScore,
    mentionCount,
    totalPrompts: promptResults.length,
    competitorScores: rankCompetitors(promptResults, competitors),
    positionRankings,
    suggestedCompetitors,
    promptResults,
    recommendations,
    scannedAt: new Date().toISOString(),
  };
}
