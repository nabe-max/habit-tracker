import { Mail } from "lucide-react";

import { CopyButton } from "@/components/salespilot/CopyButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SiteAnalysis } from "@/types/salespilot";

interface EmailCardProps {
  analysis: SiteAnalysis & { email: NonNullable<SiteAnalysis["email"]> };
}

export function EmailCard({ analysis }: EmailCardProps) {
  const fullEmail = `件名：${analysis.email.subject}\n\n${analysis.email.body}`;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Mail className="size-5" />
            </div>
            <div>
            <CardTitle>営業メール</CardTitle>
            <CardDescription>
              診断結果をもとにAIが営業メールを生成
            </CardDescription>
            </div>
          </div>
          <CopyButton text={fullEmail} label="全文コピー" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium">件名</p>
            <CopyButton text={analysis.email.subject} />
          </div>
          <p className="rounded-lg border bg-muted/30 px-4 py-3 text-sm">
            {analysis.email.subject}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium">本文</p>
            <CopyButton text={analysis.email.body} />
          </div>
          <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-lg border bg-muted/30 px-4 py-3 font-sans text-sm leading-relaxed">
            {analysis.email.body}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
