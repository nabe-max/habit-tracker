import { NextRequest, NextResponse } from "next/server";
import { buildDiagnosis } from "@/lib/siteDiagnosis";
import {
  fetchAndAnalyzeSite,
  guessCompanyName,
  normalizeUrl,
} from "@/lib/siteAnalyzer";
import type { AnalyzeRequest, SiteAnalysis } from "@/types/salespilot";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AnalyzeRequest;
    if (!body.url?.trim()) {
      return NextResponse.json({ error: "URLを入力してください" }, { status: 400 });
    }

    const url = normalizeUrl(body.url);
    const { findings, textSnippet } = await fetchAndAnalyzeSite(url);
    const { score, features } = buildDiagnosis(findings, textSnippet);

    const companyName =
      body.companyName?.trim() ||
      guessCompanyName(url, findings.title, textSnippet);

    const result: SiteAnalysis = {
      url,
      companyName,
      score,
      features,
      technicalFindings: findings,
      analyzedAt: new Date().toISOString(),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("[POST /api/salespilot/diagnose]", error);
    const message =
      error instanceof Error ? error.message : "予期しないエラーが発生しました";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
