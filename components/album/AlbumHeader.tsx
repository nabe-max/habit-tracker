"use client";

import Link from "next/link";
import { BookMarked } from "lucide-react";

import { cn } from "@/lib/utils";

import { AlbumLanguageToggle } from "./AlbumLanguageToggle";
import { useAlbumUi } from "./AlbumLocaleProvider";

interface AlbumHeaderProps {
  title?: string;
  actions?: React.ReactNode;
}

export function AlbumHeader({ title, actions }: AlbumHeaderProps) {
  const { t, ui } = useAlbumUi();

  return (
    <header className="border-b border-violet-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link href="/album" className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-md shadow-violet-200">
            <BookMarked className="size-5" />
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-800">Album Book</p>
            <p className="text-sm text-slate-500">
              {title ?? t(ui.brandTagline)}
            </p>
          </div>
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <AlbumLanguageToggle />
          <Link
            href="/album"
            className={cn(
              "rounded-full px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-violet-50 hover:text-violet-700",
            )}
          >
            {t(ui.nav.shelf)}
          </Link>
          {actions}
        </div>
      </div>
    </header>
  );
}
