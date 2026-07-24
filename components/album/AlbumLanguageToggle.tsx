"use client";

import { cn } from "@/lib/utils";

import { useAlbumLocale, useAlbumUi } from "./AlbumLocaleProvider";

export function AlbumLanguageToggle() {
  const { locale, setLocale } = useAlbumLocale();
  const { ui } = useAlbumUi();

  return (
    <div
      className="flex rounded-full border border-violet-200 bg-violet-50/80 p-0.5 text-xs font-medium"
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
              ? "bg-white text-violet-700 shadow-sm"
              : "text-slate-600 hover:text-violet-700",
          )}
        >
          {ui.langToggle[code]}
        </button>
      ))}
    </div>
  );
}
