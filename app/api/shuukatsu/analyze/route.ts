import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getOpenAIClient, formatOpenAIError } from "@/lib/openai";
import {
  SHUUKATSU_SYSTEM_PROMPT,
  buildCompanyAnalysisPrompt,
  type AiCompanyAnalysisResult,
} from "@/lib/shuukatsu-ai";
import {
  SHUUKATSU_USAGE_COOKIE,
  SHUUKATSU_USAGE_LIMIT_MESSAGE,
  getCurrentMonthKey,
  isShuukatsuUsageLimitReached,
  parseShuukatsuUsage,
  serializeShuukatsuUsage,
  summarizeShuukatsuUsage,
} from "@/lib/shuukatsuUsage";
import { fetchAndAnalyzeSite, normalizeUrl } from "@/lib/siteAnalyzer";
import type { AnalyzeCompanyRequest, CompanyAnalysis } from "@/types/shuukatsu";

function asStringArray(value: unknown, max = 5): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string").slice(0, max);
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI APIキーが設定されていません" },
        { status: 500 },
      );
    }

    const body = (await req.json()) as AnalyzeCompanyRequest;
    if (!body.companyName?.trim()) {
      return NextResponse.json(
        { error: "会社名を入力してください" },
        { status: 400 },
      );
    }

    if (!body.url?.trim()) {
      return NextResponse.json(
        { error: "公式サイトURLを入力してください" },
        { status: 400 },
      );
    }

    const cookieStore = await cookies();
    const currentUsage = parseShuukatsuUsage(
      cookieStore.get(SHUUKATSU_USAGE_COOKIE)?.value,
    );
    if (isShuukatsuUsageLimitReached(currentUsage)) {
      return NextResponse.json(
        {
          error: SHUUKATSU_USAGE_LIMIT_MESSAGE,
          usage: summarizeShuukatsuUsage(currentUsage),
        },
        { status: 429 },
      );
    }

    const companyName = body.companyName.trim();
    const keywords = body.keywords?.trim() || undefined;
    const normalizedUrl = normalizeUrl(body.url);
    const site = await fetchAndAnalyzeSite(normalizedUrl);
    const textSnippet = site.textSnippet;
    const pageTitle = site.findings.title;

    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SHUUKATSU_SYSTEM_PROMPT },
        {
          role: "user",
          content: buildCompanyAnalysisPrompt({
            companyName,
            url: normalizedUrl,
            keywords,
            textSnippet,
            pageTitle,
          }),
        },
      ],
      temperature: 0.6,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "AIからの応答が空でした" },
        { status: 500 },
      );
    }

    let parsed: AiCompanyAnalysisResult;
    try {
      parsed = JSON.parse(content) as AiCompanyAnalysisResult;
    } catch {
      return NextResponse.json(
        { error: "AIの応答をJSONとして解析できませんでした" },
        { status: 500 },
      );
    }

    const result: CompanyAnalysis = {
      companyName,
      url: normalizedUrl,
      keywords,
      overview: parsed.overview?.trim() || "",
      business: parsed.business?.trim() || "",
      strengths: asStringArray(parsed.strengths),
      jobHuntingPoints: asStringArray(parsed.jobHuntingPoints),
      interviewTips: asStringArray(parsed.interviewTips),
      keywordInsights: keywords
        ? asStringArray(parsed.keywordInsights, 8)
        : undefined,
      motivationDraft: parsed.motivationDraft?.trim() || "",
      dataSource: "website",
      analyzedAt: new Date().toISOString(),
    };

    if (!result.overview || !result.motivationDraft) {
      return NextResponse.json(
        { error: "企業分析の生成に失敗しました" },
        { status: 500 },
      );
    }

    const nextUsage = {
      month: getCurrentMonthKey(),
      count: currentUsage.count + 1,
    };
    cookieStore.set(SHUUKATSU_USAGE_COOKIE, serializeShuukatsuUsage(nextUsage), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 32,
      path: "/",
    });

    return NextResponse.json({
      ...result,
      usage: summarizeShuukatsuUsage(nextUsage),
    });
  } catch (error) {
    console.error("[POST /api/shuukatsu/analyze]", error);
    return NextResponse.json(
      { error: formatOpenAIError(error) },
      { status: 500 },
    );
  }
}
