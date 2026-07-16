import { NextRequest, NextResponse } from "next/server";
import { getOpenAIClient, SYSTEM_PROMPT, buildUserPrompt } from "@/lib/openai";
import type { GenerateRequest, GenerateResponseItem } from "@/types/post";
import {
  TARGETS,
  TONES,
  COUNT_MIN,
  COUNT_MAX,
  isValidCount,
  THEME_MAX_LENGTH,
  PAST_POSTS_MAX_LENGTH,
} from "@/types/post";

function validate(body: GenerateRequest): string | null {
  if (!body.theme?.trim()) return "テーマは必須です";
  if (body.theme.length > THEME_MAX_LENGTH) {
    return `テーマは${THEME_MAX_LENGTH}文字以内です`;
  }
  if (!body.target?.trim()) return "ターゲットは必須です";
  if (!TARGETS.includes(body.target as (typeof TARGETS)[number])) {
    return "ターゲットが不正です";
  }
  if (!body.tone?.trim()) return "トーンは必須です";
  if (!TONES.includes(body.tone as (typeof TONES)[number])) {
    return "トーンが不正です";
  }
  if (!isValidCount(body.count)) {
    return `生成数は${COUNT_MIN}〜${COUNT_MAX}の整数で指定してください`;
  }
  if (body.pastPosts && body.pastPosts.length > PAST_POSTS_MAX_LENGTH) {
    return `過去投稿は${PAST_POSTS_MAX_LENGTH}文字以内です`;
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI APIキーが設定されていません" },
        { status: 500 },
      );
    }

    const body = (await req.json()) as GenerateRequest;
    const validationError = validate(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: buildUserPrompt({
            theme: body.theme.trim(),
            target: body.target,
            tone: body.tone,
            count: body.count,
            pastPosts: body.pastPosts?.trim(),
          }),
        },
      ],
      temperature: 0.8,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "AIからの応答が空でした" },
        { status: 500 },
      );
    }

    let parsed: { posts: GenerateResponseItem[] };
    try {
      parsed = JSON.parse(content) as { posts: GenerateResponseItem[] };
    } catch {
      return NextResponse.json(
        { error: "AIの応答をJSONとして解析できませんでした" },
        { status: 500 },
      );
    }

    if (!Array.isArray(parsed.posts)) {
      return NextResponse.json(
        { error: "応答形式が不正です" },
        { status: 500 },
      );
    }

    return NextResponse.json(parsed.posts);
  } catch (error) {
    console.error("[POST /api/generate]", error);
    const message =
      error instanceof Error ? error.message : "予期しないエラーが発生しました";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
