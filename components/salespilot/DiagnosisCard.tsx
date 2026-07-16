import { ScanLine } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { SiteAnalysis } from "@/types/salespilot";

interface DiagnosisCardProps {
  analysis: SiteAnalysis;
}

function ScoreRing({ score }: { score: number }) {
  const color =
    score >= 80
      ? "text-emerald-500"
      : score >= 60
        ? "text-amber-500"
        : "text-rose-500";

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border bg-muted/30 px-10 py-8">
      <p className="text-sm font-medium text-muted-foreground">総合評価</p>
      <p className={cn("text-6xl font-bold tabular-nums", color)}>{score}</p>
      <p className="text-sm text-muted-foreground">点</p>
    </div>
  );
}

export function DiagnosisCard({ analysis }: DiagnosisCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>サイト診断結果</CardTitle>
        <CardDescription>
          {analysis.companyName} — {analysis.url}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
          <ScoreRing score={analysis.score} />
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <ScanLine className="size-4 text-primary" />
              <h3 className="font-medium">サイトの特徴（{analysis.features.length}件）</h3>
            </div>
            <ul className="space-y-2">
              {analysis.features.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-0.5 text-foreground">・</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
