import type { Metadata } from "next";

import { MorningDashboard } from "@/components/morning/MorningDashboard";
import { isMorningConfigured } from "@/lib/morning/env";

export const metadata: Metadata = {
  title: "Morning You | 昨日の自分から、今朝届く",
  description: "夜に書いたモチベーションの一言が、翌朝メールで届くサービス。",
};

export default function MorningPage() {
  const configured = isMorningConfigured();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <header className="border-b border-amber-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-lg font-semibold text-slate-800">Morning You</p>
            <p className="text-sm text-slate-500">昨夜の自分 → 今朝のメール</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        {!configured ? (
          <div className="rounded-2xl border border-amber-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
            <p className="font-medium text-slate-800">セットアップが必要です</p>
            <p className="mt-2">
              Supabase と Resend の環境変数を設定してください。詳しくは{" "}
              <a href="/morning/setup" className="text-amber-700 underline">
                セットアップガイド
              </a>
              を見てください。
            </p>
          </div>
        ) : (
          <>
            <section className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                明日の朝、昨日の自分から届く
              </h1>
              <p className="mt-3 text-slate-600">
                夜にモチベーションの一言を残す。翌朝、メールで未来の自分に届く。
              </p>
            </section>
            <MorningDashboard />
          </>
        )}
      </main>
    </div>
  );
}
