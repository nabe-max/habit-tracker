"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";

import type { OsakaPrepItem } from "@/data/osaka/types";

const STORAGE_KEY = "osaka-prep-checked";

interface PrepChecklistProps {
  items: OsakaPrepItem[];
}

export function PrepChecklist({ items }: PrepChecklistProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setChecked(JSON.parse(raw) as Record<string, boolean>);
    } catch {
      // ignore
    }
  }, []);

  function toggle(id: string) {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => {
        const isChecked = Boolean(checked[item.id]);
        return (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className={`flex w-full gap-3 rounded-2xl border p-4 text-left transition-colors ${
                isChecked
                  ? "border-emerald-200 bg-emerald-50/80"
                  : "border-orange-100 bg-white hover:border-orange-200"
              }`}
            >
              <span
                className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border ${
                  isChecked
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-slate-300 bg-white"
                }`}
              >
                {isChecked ? <Check className="size-3.5" /> : null}
              </span>
              <span>
                <span className="font-medium text-slate-800">{item.title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-slate-600">
                  {item.detail}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
