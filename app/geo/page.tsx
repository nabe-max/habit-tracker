import type { Metadata } from "next";
import { Building2, MapPin, Sparkles } from "lucide-react";

import { GeoScanner } from "@/components/geo/GeoScanner";

export const metadata: Metadata = {
  title: "GEO Lab | AI検索可視化ダッシュボード",
  description:
    "ChatGPTなどのAI検索で自社ブランドが答えに含まれるかを可視化し、GEO改善アクションを提案します。",
};

export default function GeoPage() {
  return (
    <div className="min-h-screen bg-[#f8f7ff] text-slate-900">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.12),_transparent_35%)]" />

      <header className="relative border-b border-violet-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
          <div>
            <p className="text-lg font-semibold text-slate-900">GEO Lab</p>
            <p className="text-sm text-slate-500">AI検索可視化ダッシュボード</p>
          </div>
          <div className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-xs text-violet-700">
            B2B SaaS MVP
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <section className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
            <Sparkles className="size-3.5" />
            Generative Engine Optimization
          </div>
          <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            AI検索で、自社は「答え」に選ばれているか？
          </h1>
          <p className="mt-3 max-w-3xl text-slate-600">
            ChatGPTに業界のおすすめを聞いたとき、あなたの会社名は出てくるか。GEO
            LabはAI検索での可視性をスコア化し、改善アクションまで提案します。
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm">
              <Building2 className="size-5 text-violet-600" />
              <p className="mt-3 font-medium text-slate-900">業界別プロンプト</p>
              <p className="mt-1 text-sm text-slate-500">設備工事・美容・SaaSなどに最適化</p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm">
              <Sparkles className="size-5 text-violet-600" />
              <p className="mt-3 font-medium text-slate-900">可視性スコア</p>
              <p className="mt-1 text-sm text-slate-500">AI回答にブランドが出る割合を可視化</p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm">
              <MapPin className="size-5 text-violet-600" />
              <p className="mt-3 font-medium text-slate-900">競合比較</p>
              <p className="mt-1 text-sm text-slate-500">競合との言及率を並べて確認</p>
            </div>
          </div>
        </section>

        <GeoScanner />
      </main>
    </div>
  );
}
