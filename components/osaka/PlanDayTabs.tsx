"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";

import { pickText } from "@/data/osaka/locale";
import type { OsakaPlanDay, OsakaPhrase } from "@/data/osaka/types";
import { googleMapsSearchUrl } from "@/lib/osaka/maps";
import { Button } from "@/components/ui/button";

import { useOsakaLocale, useOsakaUi } from "./OsakaLocaleProvider";

interface PlanDayTabsProps {
  days: OsakaPlanDay[];
}

function PhraseBlock({ phrase, locale }: { phrase: OsakaPhrase; locale: "en" | "ja" }) {
  if (locale === "ja") {
    return (
      <>
        <p className="mt-1 font-medium text-slate-800">{phrase.ja}</p>
        <p className="text-slate-500">{phrase.romaji}</p>
        <p className="text-slate-600">{phrase.en}</p>
      </>
    );
  }
  return (
    <>
      <p className="mt-1 text-slate-700">{phrase.en}</p>
      <p>{phrase.ja}</p>
      <p className="text-slate-500">{phrase.romaji}</p>
    </>
  );
}

export function PlanDayTabs({ days }: PlanDayTabsProps) {
  const { locale } = useOsakaLocale();
  const { t, ui } = useOsakaUi();
  const [active, setActive] = useState(0);
  const day = days[active];

  if (!day) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {days.map((d, index) => (
          <Button
            key={d.day}
            type="button"
            variant={active === index ? "default" : "outline"}
            onClick={() => setActive(index)}
            className={
              active === index
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "border-orange-200"
            }
          >
            {t(ui.plan.dayLabel)} {d.day}
          </Button>
        ))}
      </div>

      <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800">{pickText(day.title, locale)}</h2>
        <p className="mt-2 text-slate-600">{pickText(day.summary, locale)}</p>

        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <span className="font-semibold">{t(ui.plan.headsUp)} </span>
          {pickText(day.headsUp, locale)}
        </div>

        <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm">
          <p className="font-medium text-slate-800">{t(ui.plan.phraseTitle)}</p>
          <PhraseBlock phrase={day.phrase} locale={locale} />
        </div>

        <ol className="mt-6 space-y-4">
          {day.spots.map((spot) => (
            <li
              key={`${spot.time}-${pickText(spot.title, locale)}`}
              className="rounded-2xl border border-orange-50 bg-orange-50/30 p-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-sm font-semibold text-orange-600">
                  {spot.time}
                </span>
                <a
                  href={googleMapsSearchUrl(spot.mapsQuery)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-orange-600 hover:underline"
                >
                  {t(ui.plan.openMaps)}
                  <ExternalLink className="size-3.5" />
                </a>
              </div>
              <h3 className="mt-1 font-semibold text-slate-800">
                {pickText(spot.title, locale)}
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                {pickText(spot.description, locale)}
              </p>
              {spot.tip && (
                <p className="mt-2 text-xs text-slate-500">
                  {t(ui.plan.tip)} {pickText(spot.tip, locale)}
                </p>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
