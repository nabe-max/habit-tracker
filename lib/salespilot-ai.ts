import type { TechnicalFindings } from "@/types/salespilot";

export const SALESPILOT_SYSTEM_PROMPT = `あなたはWeb制作営業の専門家です。
中小企業・個人事業者向けのWebサイト改善提案と、返信率の高い営業メールを作成します。

ルール:
- 日本語で出力
- 改善点は具体的かつやんわりした表現（「ダサい」「古い」とは書かない）
- 営業メール1通目には価格を書かない
- 「ご要望を伺う」「15分無料相談」「スルーOK」を含める
- 必ずJSONのみ返す（Markdown禁止、コードブロック禁止）`;

export function buildAnalysisPrompt(params: {
  url: string;
  companyName?: string;
  findings: TechnicalFindings;
  textSnippet: string;
}): string {
  const { url, companyName, findings, textSnippet } = params;

  return `以下のWebサイトをWeb制作営業の観点で分析し、診断結果と営業メールを作成してください。

URL: ${url}
${companyName ? `会社名（入力）: ${companyName}` : ""}

【技術チェック結果】
- SSL(HTTPS): ${findings.isHttps ? "対応" : "未対応"}
- viewport(meta): ${findings.hasViewportMeta ? "あり" : "なし"}
- title: ${findings.title ?? "なし"}
- meta description: ${findings.metaDescription ?? "なし"}
- 応答時間: ${findings.responseTimeMs}ms
- CTA要素数(a/button): ${findings.ctaCount}
- フォーム数: ${findings.formCount}
- h1数: ${findings.h1Count}
- telリンク: ${findings.hasTelLink ? "あり" : "なし"}
- mailtoリンク: ${findings.hasMailtoLink ? "あり" : "なし"}

【ページ本文抜粋】
${textSnippet}

以下のJSON形式のみで返してください:
{
  "companyName": "推定または入力された会社名",
  "score": 0から100の整数（Web制作営業観点の総合評価。低いほど改善余地大）,
  "improvements": ["改善点1", "改善点2", "改善点3", "改善点4", "改善点5"],
  "email": {
    "subject": "件名",
    "body": "営業メール本文（署名まで含む。渡辺（nabe）/ Web制作 / Next.js / nwata639@gmail.com）"
  }
}

improvementsは5件以内。技術チェック結果と本文から読み取れる問題を優先してください。
scoreの目安: 90+=優秀, 70-89=改善余地あり, 50-69=要改善, 50未満=要リニューアル`;
}

export function buildEmailPrompt(params: {
  url: string;
  companyName: string;
  score: number;
  features: string[];
  findings: TechnicalFindings;
}): string {
  const { url, companyName, score, features, findings } = params;

  return `以下のWebサイト診断結果をもとに、Web制作営業の初回メールを1通作成してください。

URL: ${url}
会社名: ${companyName}
総合評価: ${score}点
サイトの特徴:
${features.map((item) => `- ${item}`).join("\n")}

【技術チェック結果】
- SSL(HTTPS): ${findings.isHttps ? "対応" : "未対応"}
- viewport(meta): ${findings.hasViewportMeta ? "あり" : "なし"}
- title: ${findings.title ?? "なし"}
- 応答時間: ${findings.responseTimeMs}ms
- CTA要素数(a/button): ${findings.ctaCount}

以下のJSON形式のみで返してください:
{
  "subject": "件名",
  "body": "営業メール本文（署名まで含む。渡辺（nabe）/ Web制作 / Next.js / nwata639@gmail.com）"
}`;
}

export interface AiEmailResult {
  subject: string;
  body: string;
}

export interface AiAnalysisResult {
  companyName: string;
  score: number;
  improvements: string[];
  email: {
    subject: string;
    body: string;
  };
}
