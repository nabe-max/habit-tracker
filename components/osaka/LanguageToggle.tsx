"use client";

import { cn } from "@/lib/utils";

import { useOsakaLocale, useOsakaUi } from "./OsakaLocaleProvider";

export function LanguageToggle() {
  const { locale, setLocale } = useOsakaLocale();
  const { ui } = useOsakaUi();

  return (
    <div
      className="flex rounded-full border border-orange-200 bg-orange-50/80 p-0.5 text-xs font-medium"
      role="group"
      aria-label="Language"
    >
      {(["en", "ja"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          className={cn(
            "rounded-full px-3 py-1.5 transition-colors",
            locale === code
              ? "bg-white text-orange-700 shadow-sm"
              : "text-slate-600 hover:text-orange-700",
          )}
        >
          {ui.langToggle[code]}
        </button>
      ))}
    </div>
  );
}
