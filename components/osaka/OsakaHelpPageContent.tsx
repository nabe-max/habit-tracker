"use client";

import { OsakaHeader } from "@/components/osaka/OsakaHeader";
import { HelpFaqList } from "@/components/osaka/HelpFaqList";
import { useOsakaUi } from "@/components/osaka/OsakaLocaleProvider";
import { OSAKA_FAQ } from "@/data/osaka/faq";

export function OsakaHelpPageContent() {
  const { t, ui } = useOsakaUi();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50">
      <OsakaHeader />
      <main className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t(ui.help.title)}</h1>
          <p className="mt-2 text-slate-600">{t(ui.help.intro)}</p>
        </div>
        <HelpFaqList items={OSAKA_FAQ} />
      </main>
    </div>
  );
}
