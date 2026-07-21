"use client";

import { useCallback, useEffect, useState } from "react";
import { GA_EVENTS, trackEvent } from "@/lib/analytics";
import type { CompanyAnalysis, ShuukatsuUsageSummary } from "@/types/shuukatsu";

interface AnalyzeResponse extends CompanyAnalysis {
  error?: string;
  usage?: ShuukatsuUsageSummary;
}

interface UseShuukatsuAnalyzeReturn {
  analysis: CompanyAnalysis | null;
  isLoading: boolean;
  error: string | null;
  usage: ShuukatsuUsageSummary | null;
  isUsageLoading: boolean;
  isLimitReached: boolean;
  analyze: (companyName: string, url: string, keywords?: string) => Promise<void>;
  reset: () => void;
}

export function useShuukatsuAnalyze(): UseShuukatsuAnalyzeReturn {
  const [analysis, setAnalysis] = useState<CompanyAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usage, setUsage] = useState<ShuukatsuUsageSummary | null>(null);
  const [isUsageLoading, setIsUsageLoading] = useState(true);

  const fetchUsage = useCallback(async () => {
    try {
      const res = await fetch("/api/shuukatsu/usage");
      if (!res.ok) return;
      const data = (await res.json()) as ShuukatsuUsageSummary;
      setUsage(data);
    } catch {
      // ignore
    } finally {
      setIsUsageLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchUsage();
  }, [fetchUsage]);

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

      const data = (await res.json()) as AnalyzeResponse;

      if (!res.ok) {
        if (data.usage) {
          setUsage(data.usage);
        }
        throw new Error(data.error ?? "分析に失敗しました");
      }

      const { usage: nextUsage, ...analysisResult } = data;
      if (nextUsage) {
        setUsage(nextUsage);
      }
      setAnalysis(analysisResult);
      trackEvent(GA_EVENTS.COMPANY_ANALYSIS_SUCCESS, {
        has_keywords: Boolean(keywords),
        has_keyword_results: Boolean(analysisResult.keywordInsights?.length),
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

  const isLimitReached = usage !== null && usage.remaining <= 0;

  return {
    analysis,
    isLoading,
    error,
    usage,
    isUsageLoading,
    isLimitReached,
    analyze,
    reset,
  };
}
