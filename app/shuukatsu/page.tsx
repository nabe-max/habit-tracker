"use client";

import { AlertCircle } from "lucide-react";

import { AnalysisResult } from "@/components/shuukatsu/AnalysisResult";
import { CompanyInputForm } from "@/components/shuukatsu/CompanyInputForm";
import { HeroSection } from "@/components/shuukatsu/HeroSection";
import { ShuukatsuHeader } from "@/components/shuukatsu/ShuukatsuHeader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useShuukatsuAnalyze } from "@/hooks/useShuukatsuAnalyze";

function AnalysisSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-64 w-full rounded-2xl bg-sky-100/60" />
      <Skeleton className="h-48 w-full rounded-2xl bg-amber-100/60" />
    </div>
  );
}

export default function ShuukatsuPage() {
  const { analysis, isLoading, error, analyze } = useShuukatsuAnalyze();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-amber-50">
      <ShuukatsuHeader />
      <main className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6">
        <HeroSection />

        <CompanyInputForm
          isLoading={isLoading}
          onSubmit={(companyName, url, keywords) =>
            analyze(companyName, url, keywords)
          }
        />

        {error && (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>エラー</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading && <AnalysisSkeleton />}

        {analysis && !isLoading && <AnalysisResult analysis={analysis} />}
      </main>
    </div>
  );
}
