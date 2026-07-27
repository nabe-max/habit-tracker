"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BookOpen, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AlbumBookCover } from "@/components/album/AlbumBookCover";
import { AlbumHeader } from "@/components/album/AlbumHeader";
import { useAlbumUi } from "@/components/album/AlbumLocaleProvider";
import { ALBUM_SHELF_OPEN_KEY, AlbumShelfOpenOverlay } from "@/components/album/AlbumShelfOpenOverlay";
import { Button } from "@/components/ui/button";
import { formatPageCount } from "@/data/album/locale";
import { interpolate } from "@/data/album/ui";
import { deleteAlbum, getAlbums } from "@/lib/album/storage";
import type { Album } from "@/types/album";

export function AlbumBookshelf() {
  const router = useRouter();
  const { locale, t, ui } = useAlbumUi();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [opening, setOpening] = useState<{ album: Album; rect: DOMRect } | null>(null);

  useEffect(() => {
    setAlbums(getAlbums());
  }, []);

  const finishOpen = useCallback(() => {
    if (!opening) return;
    sessionStorage.setItem(ALBUM_SHELF_OPEN_KEY, opening.album.id);
    router.push(`/album/${opening.album.id}/view`);
    setOpening(null);
  }, [opening, router]);

  function handleDelete(id: string, title: string) {
    const message = interpolate(t(ui.shelf.deleteConfirm), { title });
    if (!confirm(message)) return;
    deleteAlbum(id);
    setAlbums(getAlbums());
    toast.success(t(ui.shelf.deleted));
  }

  function handleOpenBook(album: Album, target: HTMLElement) {
    if (opening) return;
    const rect = target.getBoundingClientRect();
    setOpening({ album, rect });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
      <AlbumHeader
        actions={
          <Button asChild className="bg-violet-600 hover:bg-violet-700">
            <Link href="/album/new">
              <Plus className="size-4" />
              {t(ui.shelf.newAlbum)}
            </Link>
          </Button>
        }
      />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {albums.length === 0 ? (
          <div className="rounded-3xl border border-violet-100 bg-white/90 px-6 py-16 text-center shadow-sm">
            <BookOpen className="mx-auto size-12 text-violet-300" />
            <h2 className="mt-4 text-xl font-semibold text-slate-800">
              {t(ui.shelf.emptyTitle)}
            </h2>
            <p className="mt-2 text-slate-600">{t(ui.shelf.emptyDesc)}</p>
            <Button asChild className="mt-6 bg-violet-600 hover:bg-violet-700">
              <Link href="/album/new">{t(ui.shelf.createFirst)}</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {albums.map((album) => (
              <article
                key={album.id}
                className="group flex flex-col"
              >
                <div className="album-shelf-row relative rounded-2xl px-3 pb-4 pt-3">
                  <button
                    type="button"
                    className="album-shelf-book relative mx-auto aspect-[3/4] w-full max-w-[220px] cursor-pointer border-0 bg-transparent p-0 text-left"
                    onClick={(event) => handleOpenBook(album, event.currentTarget)}
                    aria-label={interpolate(t(ui.shelf.openBookAria), { title: album.title })}
                  >
                    <AlbumBookCover album={album} interactive />
                  </button>
                  <div className="album-shelf-plank mt-3 h-3 rounded-sm" aria-hidden />
                </div>
                <div className="mt-2 px-1">
                  <h2 className="font-semibold text-slate-800">{album.title}</h2>
                  <p className="text-sm text-slate-500">
                    {formatPageCount(album.pages.length, locale)}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      className="bg-violet-600 hover:bg-violet-700"
                      onClick={(event) => {
                        const book = event.currentTarget.closest("article")?.querySelector(".album-shelf-book");
                        if (book instanceof HTMLElement) handleOpenBook(album, book);
                      }}
                    >
                      {t(ui.shelf.openBook)}
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/album/${album.id}/edit`}>{t(ui.shelf.edit)}</Link>
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="text-rose-600 hover:text-rose-700"
                      onClick={() => handleDelete(album.id, album.title)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {opening ? (
        <AlbumShelfOpenOverlay
          album={opening.album}
          originRect={opening.rect}
          onComplete={finishOpen}
        />
      ) : null}
    </div>
  );
}
