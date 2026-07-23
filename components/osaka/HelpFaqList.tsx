"use client";

import { useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";

import type { OsakaFaqItem } from "@/data/osaka/types";

interface HelpFaqListProps {
  items: OsakaFaqItem[];
}

export function HelpFaqList({ items }: HelpFaqListProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className="overflow-hidden rounded-2xl border border-orange-100 bg-white"
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full items-start justify-between gap-3 px-4 py-4 text-left"
            >
              <span>
                <span className="text-xs font-medium uppercase tracking-wide text-orange-600">
                  {item.category}
                </span>
                <span className="mt-1 block font-medium text-slate-800">
                  {item.question}
                </span>
              </span>
              <ChevronDown
                className={`size-5 shrink-0 text-slate-400 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="space-y-3 border-t border-orange-50 px-4 pb-4 pt-3">
                <ol className="list-decimal space-y-2 pl-4 text-sm text-slate-600">
                  {item.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
                {item.phrase && (
                  <div className="rounded-xl bg-slate-50 p-3 text-sm">
                    <p className="font-medium text-slate-800">{item.phrase.en}</p>
                    <p className="mt-1 text-slate-700">{item.phrase.ja}</p>
                    <p className="text-slate-500">{item.phrase.romaji}</p>
                  </div>
                )}
                {item.link && (
                  <a
                    href={item.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-orange-600 hover:underline"
                  >
                    {item.link.label}
                    <ExternalLink className="size-3.5" />
                  </a>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
