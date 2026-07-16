import { NextRequest, NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";
import {
  SALESPILOT_SYSTEM_PROMPT,
  buildEmailPrompt,
  type AiEmailResult,
} from "@/lib/salespilot-ai";
import type { SiteAnalysis } from "@/types/salespilot";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI APIキーが設定されていません" },
        { status: 500 },
      );
    }

    const body = (await req.json()) as SiteAnalysis;
    if (!body.url?.trim() || !body.companyName?.trim()) {
      return NextResponse.json(
        { error: "診断結果が不足しています" },
        { status: 400 },
      );
    }

    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SALESPILOT_SYSTEM_PROMPT },
        {
          role: "user",
          content: buildEmailPrompt({
            url: body.url,
            companyName: body.companyName,
            score: body.score,
            features: body.features,
            findings: body.technicalFindings,
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

    let parsed: AiEmailResult;
    try {
      parsed = JSON.parse(content) as AiEmailResult;
    } catch {
      return NextResponse.json(
        { error: "AIの応答をJSONとして解析できませんでした" },
        { status: 500 },
      );
    }

    const subject =
      parsed.subject?.trim() ||
      `${body.companyName}様のWebサイト改善のご提案`;
    const emailBody = parsed.body?.trim();

    if (!emailBody) {
      return NextResponse.json(
        { error: "営業メールの生成に失敗しました" },
        { status: 500 },
      );
    }

    return NextResponse.json({ subject, body: emailBody });
  } catch (error) {
    console.error("[POST /api/salespilot/email]", error);
    const message =
      error instanceof Error ? error.message : "予期しないエラーが発生しました";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
