import type { Metadata } from "next";
import { Briefcase, FileBarChart, Sparkles, Users } from "lucide-react";

import { GeoScanner } from "@/components/geo/GeoScanner";

export const metadata: Metadata = {
  title: "GEO Lab | 代理店向け AI検索可視化",
  description:
    "SEO・集客代行の代理店向け。クライアントブランドがChatGPT等のAI回答に載っているかを計測し、クライアント提案用レポートを生成します。",
};

export default function GeoPage() {
  return (
    <div className="min-h-screen bg-[#f8f7ff] text-slate-900">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.12),_transparent_35%)]" />

      <header className="relative border-b border-violet-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
          <div>
            <p className="text-lg font-semibold text-slate-900">GEO Lab</p>
            <p className="text-sm text-slate-500">代理店向け AI検索可視化</p>
          </div>
          <div className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-xs text-violet-700">
            Agency MVP
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <section className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
            <Sparkles className="size-3.5" />
            For SEO & Marketing Agencies
          </div>
          <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            クライアントは、ChatGPTの「おすすめ」に載っているか？
          </h1>
          <p className="mt-3 max-w-3xl text-slate-600">
            SEO・MEO・Web制作の代理店向けツール。クライアント名と業種を入力するだけで、
            AI検索での可視性スコア・競合比較・改善提案を取得。提案資料にそのまま使えるレポートを生成します。
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm">
              <Users className="size-5 text-violet-600" />
              <p className="mt-3 font-medium text-slate-900">クライアント横断対応</p>
              <p className="mt-1 text-sm text-slate-500">業種を自由入力。どんなクライアントでも同じワークフローで計測</p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm">
              <FileBarChart className="size-5 text-violet-600" />
              <p className="mt-3 font-medium text-slate-900">提案用レポート</p>
              <p className="mt-1 text-sm text-slate-500">可視性スコア・競合比較・改善アクションをクライアント提案に転用</p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm">
              <Briefcase className="size-5 text-violet-600" />
              <p className="mt-3 font-medium text-slate-900">新メニューとして販売</p>
              <p className="mt-1 text-sm text-slate-500">「ChatGPT診断」をSEO/MEOの上位プランとして追加可能</p>
            </div>
          </div>
        </section>

        <GeoScanner />
      </main>
    </div>
  );
}
