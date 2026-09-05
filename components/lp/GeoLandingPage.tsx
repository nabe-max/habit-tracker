import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarClock,
  MessageSquareText,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { MAX_MONITORED_CLIENTS } from "@/lib/geo/limits";

const PROBLEMS = [
  "SEOの順位はわかるが、ChatGPTなどAI検索での見え方がわからない",
  "クライアントから「AIに出てる？」と聞かれて、数字で答えられない",
  "プロンプトを手打ちで毎回チェックするのは続かない",
];

const STEPS = [
  {
    title: "クライアントを登録",
    description: "公式サイトあり / なしのどちらでも診断開始。プロンプトはAI提案も可能。",
  },
  {
    title: "初回診断",
    description: "AI回答に自社クライアントが載っているか、プロンプト別に確認。",
  },
  {
    title: "毎日自動監視",
    description: "毎朝スキャン。概要グラフと競合比較で推移をレポート。",
  },
];

const FEATURES = [
  {
    icon: BarChart3,
    title: "可視性スコアの推移",
    description: "Overviewでスコアと競合比較をグラフ表示。",
  },
  {
    icon: MessageSquareText,
    title: "プロンプト別の回答詳細",
    description: "どの質問で言及されたか、AI回答の抜粋まで確認。",
  },
  {
    icon: TrendingUp,
    title: "改善アクション提案",
    description: "代理店がそのまま提案できる改善案を自動生成。",
  },
  {
    icon: CalendarClock,
    title: "毎日自動スキャン",
    description: "手動チェック不要。cronで毎朝更新。",
  },
];

const SCREENSHOTS = [
  {
    title: "概要 — 可視性スコアと競合比較",
    src: "/lp/overview.png",
    alt: "GEO Lab 概要画面。可視性スコア67、競合比較グラフ、言及率を表示",
    priority: true,
  },
  {
    title: "プロンプト — AI回答の言及状況と改善アクション",
    src: "/lp/prompts.png",
    alt: "GEO Lab プロンプト監視画面。プロンプト別の言及有無、AI回答抜粋、改善アクション提案を表示",
    priority: false,
  },
  {
    title: "新規診断 — クライアント登録と1回診断",
    src: "/lp/scan.png",
    alt: "GEO Lab 新規診断画面。クライアント名・業種・Webサイト・監視プロンプトを入力して診断または毎日監視を開始できる",
    priority: false,
  },
] as const;

function ScreenshotFigure({
  title,
  src,
  alt,
  priority,
}: {
  title: string;
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <figure className="space-y-3">
      <figcaption className="text-sm font-medium text-slate-700">{title}</figcaption>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50">
        <Image
          src={src}
          alt={alt}
          width={1440}
          height={900}
          className="h-auto w-full"
          priority={priority}
        />
      </div>
    </figure>
  );
}

export function GeoLandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-lg font-semibold text-slate-900">GEO Lab</p>
            <p className="text-xs text-slate-500">代理店向け AI検索可視化</p>
          </div>
          <Button asChild className="bg-violet-600 text-white hover:bg-violet-500">
            <Link href="/geo">
              無料で診断する
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </header>

      <main>
        <section className="border-b border-violet-100 bg-white px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-12">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
                <Sparkles className="size-3.5" />
                For SEO & Marketing Agencies
              </div>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                クライアントのAI検索可視性を、
                <span className="text-violet-600">毎日モニタリング</span>
              </h1>
              <p className="mt-4 text-base text-slate-600 sm:text-lg">
                ChatGPTの回答で自社クライアントが何位に出るか。SEO・Web集客代行の代理店向けダッシュボード。
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="bg-violet-600 text-white hover:bg-violet-500">
                  <Link href="/geo">
                    <Search className="size-4" />
                    無料で診断する
                  </Link>
                </Button>
                <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
                  β版 · 最大{MAX_MONITORED_CLIENTS}クライアント無料
                </span>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-violet-100/60">
              <Image
                src="/lp/overview.png"
                alt="GEO Lab 概要ダッシュボードのデモ画面"
                width={1024}
                height={560}
                className="h-auto w-full"
                priority
              />
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-medium text-violet-600">課題</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              SEOは見えてる。でもAI検索は？
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-3">
              {PROBLEMS.map((problem) => (
                <li
                  key={problem}
                  className="rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-relaxed text-slate-600 shadow-sm"
                >
                  {problem}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-medium text-violet-600">機能</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              代理店のレポートにそのまま使える
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex size-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl space-y-16">
            <div>
              <p className="text-sm font-medium text-violet-600">画面イメージ</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                診断から毎日監視まで、1つの画面で
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                ※ デモ診断のサンプル画面です。掲載企業との提携関係はありません。
              </p>
            </div>

            {SCREENSHOTS.map((shot) => (
              <ScreenshotFigure key={shot.src} {...shot} />
            ))}
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-medium text-violet-600">使い方</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">3ステップで開始</h2>
            <ol className="mt-8 grid gap-6 sm:grid-cols-3">
              {STEPS.map((step, index) => (
                <li
                  key={step.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
                >
                  <span className="inline-flex size-8 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <h3 className="mt-4 font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-3xl rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-600 to-violet-700 px-6 py-12 text-center text-white shadow-xl shadow-violet-200 sm:px-10">
            <p className="text-sm font-medium text-violet-200">β版 · 期間限定</p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              監視クライアント最大{MAX_MONITORED_CLIENTS}社まで無料
            </h2>
            <p className="mt-3 text-sm text-violet-100 sm:text-base">
              登録不要。今すぐ1社診断して、AI検索での見え方を確認できます。
            </p>
            <Button
              asChild
              size="lg"
              className="mt-8 bg-white text-violet-700 hover:bg-violet-50"
            >
              <Link href="/geo">
                無料で診断する
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} GEO Lab</p>
          <p>画面はデモ診断のサンプルです。掲載企業との提携関係はありません。</p>
        </div>
      </footer>
    </div>
  );
}
