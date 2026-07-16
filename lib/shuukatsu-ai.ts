export const SHUUKATSU_SYSTEM_PROMPT = `あなたは就活のプロフェッショナルアドバイザーです。
就活生が企業研究・面接対策・志望動機作成に使える、具体的で実用的な分析を日本語で作成します。

ルール:
- 推測と事実を区別し、不確かな情報は「〜と考えられます」などと書く
- 就活生がすぐ使える表現で書く
- ネガティブすぎる表現は避ける
- 必ずJSONのみ返す（Markdown禁止、コードブロック禁止）`;

export function buildCompanyAnalysisPrompt(params: {
  companyName: string;
  url: string;
  keywords?: string;
  textSnippet?: string;
  pageTitle?: string | null;
}): string {
  const { companyName, url, keywords, textSnippet, pageTitle } = params;

  const keywordSection = keywords
    ? `
【詳細検索キーワード】
${keywords}

キーワードに関連する企業情報を keywordInsights に3〜5件でまとめてください。
サイト上に情報がなければ「公式サイト上では確認できませんでした」と明記してください。`
    : `
keywordInsights は空配列 [] にしてください。`;

  return `以下の企業について、就活生向けの企業分析を作成してください。

会社名: ${companyName}
公式サイト: ${url}
${pageTitle ? `ページタイトル: ${pageTitle}` : ""}

公式サイトの内容をもとに分析してください。

${textSnippet ? `【公式サイト本文抜粋】\n${textSnippet}` : ""}
${keywordSection}

以下のJSON形式のみで返してください:
{
  "overview": "総合印象（2〜3文）",
  "business": "事業内容（3〜5文）",
  "strengths": ["強み1", "強み2", "強み3"],
  "jobHuntingPoints": ["就活生向けポイント1", "就活生向けポイント2", "就活生向けポイント3"],
  "interviewTips": ["面接で聞かれそうなこと1", "面接で聞かれそうなこと2", "面接で聞かれそうなこと3"],
  "keywordInsights": ["キーワード関連の情報1", "キーワード関連の情報2"],
  "motivationDraft": "志望動機のたたき台（200〜400文字。就活生がそのまま編集して使える文体）"
}

strengths, jobHuntingPoints, interviewTips はそれぞれ3件程度。`;
}

export interface AiCompanyAnalysisResult {
  overview: string;
  business: string;
  strengths: string[];
  jobHuntingPoints: string[];
  interviewTips: string[];
  keywordInsights?: string[];
  motivationDraft: string;
}
