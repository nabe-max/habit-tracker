"use client";

import Link from "next/link";

import { OsakaHeader } from "@/components/osaka/OsakaHeader";
import { PrepChecklist } from "@/components/osaka/PrepChecklist";
import { useOsakaUi } from "@/components/osaka/OsakaLocaleProvider";
import { OSAKA_PREP_ITEMS } from "@/data/osaka/prep";

export function OsakaPrepPageContent() {
  const { t, ui } = useOsakaUi();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50">
      <OsakaHeader />
      <main className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t(ui.prep.title)}</h1>
          <p className="mt-2 text-slate-600">
            {t(ui.prep.introBefore)}{" "}
            <Link
              href="/osaka/plan/classic-3day"
              className="text-orange-600 hover:underline"
            >
              {t(ui.prep.introLink)}
            </Link>
            {t(ui.prep.introAfter)}
          </p>
        </div>
        <PrepChecklist items={OSAKA_PREP_ITEMS} />
      </main>
    </div>
  );
}
