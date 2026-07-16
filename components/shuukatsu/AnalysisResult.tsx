import type { ReactNode } from "react";
import {
  Briefcase,
  Building2,
  Lightbulb,
  MessageCircle,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { CopyButton } from "@/components/salespilot/CopyButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GA_EVENTS, trackEvent } from "@/lib/analytics";
import type { CompanyAnalysis } from "@/types/shuukatsu";

interface AnalysisResultProps {
  analysis: CompanyAnalysis;
}

const SECTION_STYLES = {
  overview: "bg-sky-50 text-sky-700",
  business: "bg-violet-50 text-violet-700",
  strengths: "bg-emerald-50 text-emerald-700",
  jobHunting: "bg-amber-50 text-amber-700",
  interview: "bg-rose-50 text-rose-700",
  keyword: "bg-violet-50 text-violet-700",
} as const;

function Section({
  icon: Icon,
  title,
  tone,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  tone: keyof typeof SECTION_STYLES;
  children: ReactNode;
}) {
  return (
    <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-4">
      <div className="flex items-center gap-2">
        <div
          className={`flex size-8 items-center justify-center rounded-lg ${SECTION_STYLES[tone]}`}
        >
          <Icon className="size-4" />
        </div>
        <h3 className="font-medium text-slate-800">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-2 text-sm text-slate-600"
        >
          <span className="mt-0.5 text-sky-500">・</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function AnalysisResult({ analysis }: AnalysisResultProps) {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-sky-100 bg-white/90 shadow-lg shadow-sky-100/40">
        <CardHeader className="border-b border-sky-50 bg-gradient-to-r from-sky-50 to-cyan-50">
          <CardTitle className="text-slate-800">{analysis.companyName}</CardTitle>
          <CardDescription>
            <a
              href={analysis.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-600 hover:underline"
            >
              {analysis.url}
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <Section icon={Building2} title="総合印象" tone="overview">
            <p className="text-sm leading-relaxed text-slate-600">
              {analysis.overview}
            </p>
          </Section>

          <Section icon={Briefcase} title="事業内容" tone="business">
            <p className="text-sm leading-relaxed text-slate-600">
              {analysis.business}
            </p>
          </Section>

          <Section icon={TrendingUp} title="強み" tone="strengths">
            <BulletList items={analysis.strengths} />
          </Section>

          <Section icon={Lightbulb} title="就活ポイント" tone="jobHunting">
            <BulletList items={analysis.jobHuntingPoints} />
          </Section>

          <Section icon={MessageCircle} title="面接で聞かれそうなこと" tone="interview">
            <BulletList items={analysis.interviewTips} />
          </Section>

          {analysis.keywordInsights && analysis.keywordInsights.length > 0 && (
            <Section
              icon={Search}
              title={`キーワード関連情報${analysis.keywords ? `（${analysis.keywords}）` : ""}`}
              tone="keyword"
            >
              <BulletList items={analysis.keywordInsights} />
            </Section>
          )}
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-amber-100 bg-white/90 shadow-lg shadow-amber-100/40">
        <CardHeader className="border-b border-amber-50 bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-lg bg-amber-400 text-white">
                <Sparkles className="size-5" />
              </div>
              <div>
                <CardTitle className="text-slate-800">志望動機のたたき台</CardTitle>
                <CardDescription className="text-slate-500">
                  そのまま編集してES・面接に使えます
                </CardDescription>
              </div>
            </div>
            <CopyButton
              text={analysis.motivationDraft}
              label="コピー"
              onCopied={() => trackEvent(GA_EVENTS.MOTIVATION_COPY)}
            />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <pre className="whitespace-pre-wrap rounded-2xl border border-amber-100 bg-amber-50/50 px-4 py-3 font-sans text-sm leading-relaxed text-slate-700">
            {analysis.motivationDraft}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
