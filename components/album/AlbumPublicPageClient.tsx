"use client";

import Link from "next/link";

import { AlbumBookViewer } from "@/components/album/AlbumBookViewer";
import { AlbumHeader } from "@/components/album/AlbumHeader";
import { useAlbumUi } from "@/components/album/AlbumLocaleProvider";
import { Button } from "@/components/ui/button";
import type { Album } from "@/types/album";

interface AlbumPublicPageClientProps {
  album: Album;
}

export function AlbumPublicPageClient({ album }: AlbumPublicPageClientProps) {
  const { t, ui } = useAlbumUi();

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
      <AlbumHeader
        title={album.title}
        actions={
          <Button asChild size="sm" className="bg-violet-600 hover:bg-violet-700">
            <Link href="/album/new">{t(ui.public.createOwn)}</Link>
          </Button>
        }
      />
      <main className="mx-auto max-w-3xl space-y-4 px-4 py-8 sm:px-6">
        <p className="text-center text-sm text-slate-500">{t(ui.publish.publicViewHint)}</p>
        <AlbumBookViewer album={album} />
      </main>
    </div>
  );
}
