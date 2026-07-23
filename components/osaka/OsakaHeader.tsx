import Link from "next/link";
import { MapPin } from "lucide-react";

import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/osaka", label: "Home" },
  { href: "/osaka/plan/classic-3day", label: "3-Day Plan" },
  { href: "/osaka/prep", label: "Before You Go" },
  { href: "/osaka/help", label: "Stuck? Help" },
] as const;

export function OsakaHeader() {
  return (
    <header className="border-b border-orange-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link href="/osaka" className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-md shadow-orange-200">
            <MapPin className="size-5" />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight text-slate-800">
              Osaka Easy Day
            </p>
            <p className="text-sm text-slate-500">Travel calm, not confused</p>
          </div>
        </Link>
        <nav className="flex flex-wrap gap-2 text-sm">
          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "rounded-full px-3 py-1.5 font-medium text-slate-600 transition-colors hover:bg-orange-50 hover:text-orange-700",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
