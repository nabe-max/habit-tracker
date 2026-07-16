import type { TechnicalFindings } from "@/types/salespilot";

export interface DiagnosisResult {
  score: number;
  features: string[];
}

const SLOW_MS = 3000;

function truncate(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, max)}…`;
}

function guessSiteType(textSnippet: string, title: string | null): string {
  const text = `${title ?? ""} ${textSnippet}`.toLowerCase();

  const patterns: [RegExp, string][] = [
    [/カフェ|coffee|喫茶|restaurant|レストラン|飲食|居酒屋/, "飲食店・カフェ系のサイト"],
    [/美容|サロン|エステ|hair|ネイル/, "美容・サロン系のサイト"],
    [/医院|クリニック|歯科|整骨|病院/, "医療・クリニック系のサイト"],
    [/工務店|建設|リフォーム|construction/, "建設・工務店系のサイト"],
    [/税理士|弁護士|司法書士|行政書士/, "士業・専門サービス系のサイト"],
    [/スクール|教室|塾|レッスン/, "スクール・教育系のサイト"],
    [/ec|ショップ|cart|購入|通販/, "EC・オンラインショップ要素あり"],
  ];

  for (const [pattern, label] of patterns) {
    if (pattern.test(text)) return label;
  }

  return "コーポレート・サービス紹介型のサイト";
}

function computeQualityScore(findings: TechnicalFindings): number {
  let score = 100;

  if (!findings.isHttps) score -= 15;
  if (!findings.hasViewportMeta) score -= 15;
  if (findings.ctaCount < 5) score -= 10;
  if (findings.responseTimeMs >= SLOW_MS) score -= 15;
  if (!findings.title || findings.title.trim().length < 10) score -= 10;
  if (!findings.metaDescription) score -= 5;
  if (
    findings.formCount === 0 &&
    !findings.hasTelLink &&
    !findings.hasMailtoLink
  ) {
    score -= 10;
  }
  if (findings.h1Count !== 1) score -= 5;

  return Math.max(0, Math.min(100, score));
}

export function buildDiagnosis(
  findings: TechnicalFindings,
  textSnippet: string,
): DiagnosisResult {
  const features: string[] = [];

  features.push(
    findings.isHttps
      ? "SSL（HTTPS）対応済みで安全に通信できる"
      : "SSL未対応（http）でセキュリティ警告のリスクあり",
  );

  features.push(
    findings.hasViewportMeta
      ? "スマホ向けviewport設定あり"
      : "viewport未設定でスマホ表示に課題がありそう",
  );

  if (findings.title) {
    features.push(`ページタイトルは「${truncate(findings.title, 36)}」`);
  } else {
    features.push("ページタイトル（title）が未設定");
  }

  features.push(
    findings.metaDescription
      ? "SEO用のmeta descriptionが設定されている"
      : "meta descriptionが未設定",
  );

  const sec = (findings.responseTimeMs / 1000).toFixed(1);
  features.push(
    findings.responseTimeMs < 1500
      ? `表示速度が速い（約${sec}秒）`
      : findings.responseTimeMs < SLOW_MS
        ? `表示速度は普通（約${sec}秒）`
        : `表示速度がやや遅い（約${sec}秒）`,
  );

  features.push(`リンク・ボタンが${findings.ctaCount}個（CTA候補）`);

  const contactParts: string[] = [];
  if (findings.formCount > 0) {
    contactParts.push(`フォーム${findings.formCount}件`);
  }
  if (findings.hasTelLink) contactParts.push("電話リンクあり");
  if (findings.hasMailtoLink) contactParts.push("メールリンクあり");

  features.push(
    contactParts.length > 0
      ? `問い合わせ導線: ${contactParts.join("、")}`
      : "問い合わせフォーム・電話・メール導線が見当たらない",
  );

  features.push(
    findings.h1Count === 1
      ? "h1見出しが1つでページ構造はシンプル"
      : findings.h1Count === 0
        ? "h1見出しが見つからない"
        : `h1見出しが${findings.h1Count}個ある`,
  );

  features.push(
    findings.contentLength > 2000
      ? "本文テキスト量が多め（情報量豊富）"
      : findings.contentLength > 500
        ? "本文テキスト量は標準的"
        : "本文テキスト量が少なめ（画像中心の可能性）",
  );

  features.push(guessSiteType(textSnippet, findings.title));

  return {
    score: computeQualityScore(findings),
    features: features.slice(0, 10),
  };
}
