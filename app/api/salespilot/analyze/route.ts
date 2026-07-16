import { NextRequest, NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";
import {
  SALESPILOT_SYSTEM_PROMPT,
  buildAnalysisPrompt,
  type AiAnalysisResult,
} from "@/lib/salespilot-ai";
import { buildDiagnosis } from "@/lib/siteDiagnosis";
import {
  fetchAndAnalyzeSite,
  guessCompanyName,
  normalizeUrl,
} from "@/lib/siteAnalyzer";
import type { AnalyzeRequest, SiteAnalysis } from "@/types/salespilot";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI APIキーが設定されていません" },
        { status: 500 },
      );
    }

    const body = (await req.json()) as AnalyzeRequest;
    if (!body.url?.trim()) {
      return NextResponse.json({ error: "URLを入力してください" }, { status: 400 });
    }

    const url = normalizeUrl(body.url);
    const { findings, textSnippet } = await fetchAndAnalyzeSite(url);
    const { score, features } = buildDiagnosis(findings, textSnippet);

    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SALESPILOT_SYSTEM_PROMPT },
        {
          role: "user",
          content: buildAnalysisPrompt({
            url,
            companyName: body.companyName?.trim(),
            findings,
            textSnippet,
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

    let parsed: AiAnalysisResult;
    try {
      parsed = JSON.parse(content) as AiAnalysisResult;
    } catch {
      return NextResponse.json(
        { error: "AIの応答をJSONとして解析できませんでした" },
        { status: 500 },
      );
    }

    const companyName =
      body.companyName?.trim() ||
      parsed.companyName?.trim() ||
      guessCompanyName(url, findings.title, textSnippet);

    const result: SiteAnalysis = {
      url,
      companyName,
      score,
      features,
      technicalFindings: findings,
      email: {
        subject:
          parsed.email?.subject?.trim() ||
          `${companyName}様のWebサイト改善のご提案`,
        body: parsed.email?.body?.trim() || "",
      },
      analyzedAt: new Date().toISOString(),
    };

    if (!result.email?.body) {
      return NextResponse.json(
        { error: "営業メールの生成に失敗しました" },
        { status: 500 },
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[POST /api/salespilot/analyze]", error);
    const message =
      error instanceof Error ? error.message : "予期しないエラーが発生しました";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
