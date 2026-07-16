"use client";

import { useCallback, useState } from "react";
import { GA_EVENTS, trackEvent } from "@/lib/analytics";
import type { CompanyAnalysis } from "@/types/shuukatsu";

interface UseShuukatsuAnalyzeReturn {
  analysis: CompanyAnalysis | null;
  isLoading: boolean;
  error: string | null;
  analyze: (companyName: string, url: string, keywords?: string) => Promise<void>;
  reset: () => void;
}

export function useShuukatsuAnalyze(): UseShuukatsuAnalyzeReturn {
  const [analysis, setAnalysis] = useState<CompanyAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (companyName: string, url: string, keywords?: string) => {
    setIsLoading(true);
    setError(null);

    trackEvent(GA_EVENTS.COMPANY_ANALYSIS_START, {
      has_keywords: Boolean(keywords),
    });

    try {
      const res = await fetch("/api/shuukatsu/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, url, keywords }),
      });

      const data = (await res.json()) as CompanyAnalysis & { error?: string };

      if (!res.ok) {
        throw new Error(data.error ?? "分析に失敗しました");
      }

      setAnalysis(data);
      trackEvent(GA_EVENTS.COMPANY_ANALYSIS_SUCCESS, {
        has_keywords: Boolean(keywords),
        has_keyword_results: Boolean(data.keywordInsights?.length),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "分析に失敗しました";
      setAnalysis(null);
      setError(message);
      trackEvent(GA_EVENTS.COMPANY_ANALYSIS_ERROR, {
        error_message: message.slice(0, 100),
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setAnalysis(null);
    setError(null);
  }, []);

  return { analysis, isLoading, error, analyze, reset };
}
