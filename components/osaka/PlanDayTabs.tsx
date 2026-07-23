"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";

import type { OsakaPlanDay } from "@/data/osaka/types";
import { googleMapsSearchUrl } from "@/lib/osaka/maps";
import { Button } from "@/components/ui/button";

interface PlanDayTabsProps {
  days: OsakaPlanDay[];
}

export function PlanDayTabs({ days }: PlanDayTabsProps) {
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
            Day {d.day}
          </Button>
        ))}
      </div>

      <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800">{day.title}</h2>
        <p className="mt-2 text-slate-600">{day.summary}</p>

        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <span className="font-semibold">Heads-up: </span>
          {day.headsUp}
        </div>

        <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm">
          <p className="font-medium text-slate-800">Phrase of the day</p>
          <p className="mt-1 text-slate-700">{day.phrase.en}</p>
          <p>{day.phrase.ja}</p>
          <p className="text-slate-500">{day.phrase.romaji}</p>
        </div>

        <ol className="mt-6 space-y-4">
          {day.spots.map((spot) => (
            <li
              key={`${spot.time}-${spot.title}`}
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
                  Open in Maps
                  <ExternalLink className="size-3.5" />
                </a>
              </div>
              <h3 className="mt-1 font-semibold text-slate-800">{spot.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{spot.description}</p>
              {spot.tip && (
                <p className="mt-2 text-xs text-slate-500">Tip: {spot.tip}</p>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
