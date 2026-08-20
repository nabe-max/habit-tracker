import type { Metadata } from "next";

import { GeoApp, GeoAppHero } from "@/components/geo/GeoApp";

export const metadata: Metadata = {
  title: "GEO Lab | 代理店向け AI検索可視化",
  description:
    "SEO・集客代行の代理店向け。ChatGPT等のAI可視性をOverviewダッシュボードで常時確認し、週次プロンプト監視で推移を追跡します。",
};

export default function GeoPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-lg font-semibold text-slate-900">GEO Lab</p>
            <p className="text-xs text-slate-500">代理店向け AI検索可視化</p>
          </div>
          <div className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-xs text-violet-700">
            Agency MVP
          </div>
        </div>
      </header>

      <GeoAppHero />
      <GeoApp />
    </div>
  );
}
