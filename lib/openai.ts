import OpenAI from "openai";

export const SYSTEM_PROMPT = `あなたは世界トップクラスのSNSマーケターです。
SNSで高いエンゲージメントを獲得する投稿を作成してください。

もし過去投稿が入力されている場合は、文体・構成・テンション・語尾・改行・リズムを分析し、同じ型で投稿を作成してください。

必ずJSONのみ返してください。Markdownは禁止です。コードブロックは禁止です。`;

export function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI APIキーが設定されていません");
  }
  return new OpenAI({ apiKey });
}

export function buildUserPrompt(params: {
  theme: string;
  target: string;
  tone: string;
  count: number;
  pastPosts?: string;
}): string {
  const { theme, target, tone, count, pastPosts } = params;

  return `テーマ: ${theme}
ターゲット: ${target}
トーン: ${tone}
生成数: ${count}
${pastPosts ? `\n過去投稿:\n${pastPosts}` : ""}

各投稿には以下を含めてください:
- title: タイトル
- body: 本文（140〜200文字）
- hashtags: ハッシュタグ（2〜5個、#付き）

以下のJSON形式のみで返してください:
{"posts":[{"title":"...","body":"...","hashtags":["#副業","#AI"]}]}`;
}
