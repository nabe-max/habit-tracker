"use client";

import { useCallback, useState } from "react";
import type { SiteAnalysis } from "@/types/salespilot";

interface UseSalesPilotAnalyzeReturn {
  analysis: SiteAnalysis | null;
  isDiagnosing: boolean;
  isGeneratingEmail: boolean;
  error: string | null;
  diagnose: (url: string, companyName?: string) => Promise<void>;
  generateEmail: () => Promise<void>;
  reset: () => void;
}

export function useSalesPilotAnalyze(): UseSalesPilotAnalyzeReturn {
  const [analysis, setAnalysis] = useState<SiteAnalysis | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const diagnose = useCallback(async (url: string, companyName?: string) => {
    setIsDiagnosing(true);
    setError(null);

    try {
      const res = await fetch("/api/salespilot/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, companyName }),
      });

      const data = (await res.json()) as SiteAnalysis & { error?: string };

      if (!res.ok) {
        throw new Error(data.error ?? "診断に失敗しました");
      }

      setAnalysis(data);
    } catch (err) {
      setAnalysis(null);
      setError(err instanceof Error ? err.message : "診断に失敗しました");
    } finally {
      setIsDiagnosing(false);
    }
  }, []);

  const generateEmail = useCallback(async () => {
    if (!analysis) return;

    setIsGeneratingEmail(true);
    setError(null);

    try {
      const res = await fetch("/api/salespilot/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(analysis),
      });

      const data = (await res.json()) as {
        subject?: string;
        body?: string;
        error?: string;
      };

      if (!res.ok) {
        throw new Error(data.error ?? "メール生成に失敗しました");
      }

      if (!data.subject || !data.body) {
        throw new Error("メール生成に失敗しました");
      }

      setAnalysis((prev) =>
        prev
          ? {
              ...prev,
              email: { subject: data.subject!, body: data.body! },
            }
          : null,
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "メール生成に失敗しました",
      );
    } finally {
      setIsGeneratingEmail(false);
    }
  }, [analysis]);

  const reset = useCallback(() => {
    setAnalysis(null);
    setError(null);
  }, []);

  return {
    analysis,
    isDiagnosing,
    isGeneratingEmail,
    error,
    diagnose,
    generateEmail,
    reset,
  };
}
