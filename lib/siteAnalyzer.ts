import type { TechnicalFindings } from "@/types/salespilot";

const FETCH_TIMEOUT_MS = 15_000;
const MAX_HTML_LENGTH = 120_000;

export function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("URLを入力してください");

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  const parsed = new URL(withProtocol);
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("http または https のURLを入力してください");
  }

  return parsed.toString();
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTagContent(html: string, tag: string): string | null {
  const match = html.match(
    new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"),
  );
  if (!match?.[1]) return null;
  return stripHtml(match[1]).slice(0, 500) || null;
}

function extractMetaContent(html: string, name: string): string | null {
  const patterns = [
    new RegExp(
      `<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${name}["']`,
      "i",
    ),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return match[1].trim();
  }

  return null;
}

function countMatches(html: string, pattern: RegExp): number {
  return (html.match(pattern) ?? []).length;
}

export async function fetchAndAnalyzeSite(url: string): Promise<{
  html: string;
  findings: TechnicalFindings;
  textSnippet: string;
}> {
  const start = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "SalesPilotAI/1.0 (Web sales analysis; +https://habit-tracker-blond-one.vercel.app/salespilot)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("サイトの取得がタイムアウトしました");
    }
    throw new Error("サイトにアクセスできませんでした");
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new Error(`サイトの取得に失敗しました（HTTP ${response.status}）`);
  }

  const html = (await response.text()).slice(0, MAX_HTML_LENGTH);
  const responseTimeMs = Date.now() - start;
  const textSnippet = stripHtml(html).slice(0, 6_000);

  const findings: TechnicalFindings = {
    isHttps: url.startsWith("https://"),
    hasViewportMeta: /name=["']viewport["']/i.test(html),
    title: extractTagContent(html, "title"),
    metaDescription: extractMetaContent(html, "description"),
    responseTimeMs,
    ctaCount: countMatches(html, /<(a|button)[^>]*>/gi),
    formCount: countMatches(html, /<form[\s>]/gi),
    h1Count: countMatches(html, /<h1[\s>]/gi),
    hasTelLink: /href=["']tel:/i.test(html),
    hasMailtoLink: /href=["']mailto:/i.test(html),
    contentLength: textSnippet.length,
  };

  return { html, findings, textSnippet };
}

export function guessCompanyName(
  url: string,
  title: string | null,
  textSnippet: string,
): string {
  if (title) {
    const cleaned = title
      .split(/[|｜\-–—]/)[0]
      ?.replace(/(公式サイト|ホーム|HOME|トップページ)/gi, "")
      .trim();
    if (cleaned && cleaned.length <= 40) return cleaned;
  }

  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    const base = hostname.split(".")[0] ?? hostname;
    return base;
  } catch {
    return textSnippet.slice(0, 20) || "対象企業";
  }
}
