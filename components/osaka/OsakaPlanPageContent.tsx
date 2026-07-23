"use client";

import Link from "next/link";

import { OsakaHeader } from "@/components/osaka/OsakaHeader";
import { PlanDayTabs } from "@/components/osaka/PlanDayTabs";
import { useOsakaLocale, useOsakaUi } from "@/components/osaka/OsakaLocaleProvider";
import { pickText } from "@/data/osaka/locale";
import type { OsakaPlan } from "@/data/osaka/types";

interface OsakaPlanPageContentProps {
  plan: OsakaPlan;
}

export function OsakaPlanPageContent({ plan }: OsakaPlanPageContentProps) {
  const { locale } = useOsakaLocale();
  const { t, ui } = useOsakaUi();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50">
      <OsakaHeader />
      <main className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6">
        <div>
          <p className="text-sm font-medium text-orange-600">
            {t(ui.plan.baseLabel)}: {pickText(plan.baseArea, locale)}
          </p>
          <h1 className="text-2xl font-bold text-slate-900">
            {pickText(plan.name, locale)}
          </h1>
          <p className="mt-2 text-slate-600">{pickText(plan.tagline, locale)}</p>
          <p className="mt-3 text-sm text-slate-500">
            {t(ui.plan.newHereBefore)}{" "}
            <Link href="/osaka/prep" className="text-orange-600 hover:underline">
              {t(ui.plan.prepLink)}
            </Link>{" "}
            {t(ui.plan.newHereAfter)}
          </p>
        </div>
        <PlanDayTabs days={plan.days} />
      </main>
    </div>
  );
}
