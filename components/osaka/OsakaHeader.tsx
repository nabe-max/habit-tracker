"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";

import { cn } from "@/lib/utils";

import { LanguageToggle } from "./LanguageToggle";
import { useOsakaUi } from "./OsakaLocaleProvider";

const LINKS = [
  { href: "/osaka", key: "home" as const },
  { href: "/osaka/plan/classic-3day", key: "plan" as const },
  { href: "/osaka/prep", key: "prep" as const },
  { href: "/osaka/help", key: "help" as const },
];

export function OsakaHeader() {
  const { t, ui } = useOsakaUi();

  return (
    <header className="border-b border-orange-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-5 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/osaka" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-md shadow-orange-200">
              <MapPin className="size-5" />
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight text-slate-800">
                Osaka Easy Day
              </p>
              <p className="text-sm text-slate-500">{t(ui.brandTagline)}</p>
            </div>
          </Link>
          <LanguageToggle />
        </div>
        <nav className="flex flex-wrap gap-2 text-sm">
          {LINKS.map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "rounded-full px-3 py-1.5 font-medium text-slate-600 transition-colors hover:bg-orange-50 hover:text-orange-700",
              )}
            >
              {t(ui.nav[key])}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
