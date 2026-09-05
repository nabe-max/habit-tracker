import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Search, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MAX_MONITORED_CLIENTS } from "@/lib/geo/limits";

const SHOWCASES = [
  {
    label: "概要",
    title: "可視性スコアと競合比較を、グラフで毎日追跡",
    description:
      "クライアントのAI検索での見え方をスコア化。競合ブランドとの比較も1画面で確認できます。",
    bullets: [
      "Visibility / Position の2軸で推移を可視化",
      "競合ごとの言及率・平均順位を並べて比較",
      "前回比の変化をバッジで即把握",
    ],
    src: "/lp/overview.png",
    alt: "GEO Lab 概要画面。可視性スコア、競合比較グラフ、言及率を表示",
    width: 1024,
    height: 560,
    imageFirst: true,
  },
  {
    label: "プロンプト",
    title: "プロンプト別に、AI回答の言及状況を確認",
    description:
      "どの質問でクライアントが出たか、出なかったか。AI回答の抜粋までプロンプト単位で見られます。",
    bullets: [
      "監視プロンプトごとの言及有無と順位",
      "ChatGPT等の回答抜粋をその場で確認",
      "改善アクションを自動提案（レポート転用可）",
    ],
    src: "/lp/prompts.png",
    alt: "GEO Lab プロンプト監視画面。言及状況、AI回答抜粋、改善アクションを表示",
    width: 1024,
    height: 593,
    imageFirst: false,
  },
  {
    label: "新規診断",
    title: "クライアント登録から、毎日監視まで最短3分",
    description:
      "公式サイトあり / なしのどちらでも診断開始。プロンプトは手入力またはAI提案でセットできます。",
    bullets: [
      "1回診断でその場の結果を確認",
      "毎日監視を開始してダッシュボードに追加",
      "β版は最大3クライアントまで無料",
    ],
    src: "/lp/scan.png",
    alt: "GEO Lab 新規診断画面。クライアント情報と監視プロンプトを入力",
    width: 1024,
    height: 597,
    imageFirst: true,
  },
] as const;

function ShowcaseSection({
  label,
  title,
  description,
  bullets,
  src,
  alt,
  width,
  height,
  imageFirst,
  priority,
}: (typeof SHOWCASES)[number] & { priority?: boolean }) {
  const copy = (
    <div className="space-y-5">
      <p className="text-sm font-semibold uppercase tracking-wide text-violet-600">{label}</p>
      <h2 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">{title}</h2>
      <p className="text-base leading-relaxed text-slate-600">{description}</p>
      <ul className="space-y-3">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex gap-3 text-sm leading-relaxed text-slate-700">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700">
              <Check className="size-3" />
            </span>
            {bullet}
          </li>
        ))}
      </ul>
    </div>
  );

  const image = (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        unoptimized
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="h-auto w-full"
        priority={priority}
      />
    </div>
  );

  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div className={imageFirst ? "order-1" : "order-1 lg:order-2"}>{image}</div>
      <div className={imageFirst ? "order-2" : "order-2 lg:order-1"}>{copy}</div>
    </div>
  );
}

export function GeoLandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
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
        <section className="px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
              <Sparkles className="size-3.5" />
              For SEO & Marketing Agencies
            </div>
            <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl sm:leading-tight">
              マーケティングには
              <span className="text-violet-600">AI検索分析</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              AI検索で競合よりも優位性を得よう
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="bg-violet-600 px-8 text-white hover:bg-violet-500">
                <Link href="/geo">
                  <Search className="size-4" />
                  無料で診断する
                </Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              β版 · 監視クライアント最大{MAX_MONITORED_CLIENTS}社まで無料 · 登録不要
            </p>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-slate-50 px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                診断から毎日監視まで、1つのダッシュボードで
              </h2>
              <p className="mt-3 text-sm text-slate-500">
                ※ デモ診断のサンプル画面です。掲載企業との提携関係はありません。
              </p>
            </div>

            <div className="space-y-24 sm:space-y-32">
              {SHOWCASES.map((showcase, index) => (
                <ShowcaseSection key={showcase.label} {...showcase} priority={index === 0} />
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-violet-600">β版 · 期間限定</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              今すぐ1社、無料で診断してみる
            </h2>
            <p className="mt-4 text-base text-slate-600">
              監視クライアント最大{MAX_MONITORED_CLIENTS}社まで無料。クレジットカード不要。
            </p>
            <Button
              asChild
              size="lg"
              className="mt-8 bg-violet-600 px-8 text-white hover:bg-violet-500"
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
        <div className="mx-auto flex max-w-6xl flex-col gap-2 text-center text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>© {new Date().getFullYear()} GEO Lab</p>
          <p>画面はデモ診断のサンプルです。掲載企業との提携関係はありません。</p>
        </div>
      </footer>
    </div>
  );
}
