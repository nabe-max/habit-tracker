"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BookOpen, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AlbumBookSpine } from "@/components/album/AlbumBookSpine";
import { AlbumHeader } from "@/components/album/AlbumHeader";
import { useAlbumUi } from "@/components/album/AlbumLocaleProvider";
import { ALBUM_SHELF_OPEN_KEY, AlbumShelfOpenOverlay } from "@/components/album/AlbumShelfOpenOverlay";
import { Button } from "@/components/ui/button";
import { formatPageCount } from "@/data/album/locale";
import { interpolate } from "@/data/album/ui";
import { chunkAlbums } from "@/lib/album/spine";
import { deleteAlbum, getAlbums } from "@/lib/album/storage";
import type { Album } from "@/types/album";

const BOOKS_PER_SHELF = 7;

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

  const shelves = chunkAlbums(albums, BOOKS_PER_SHELF);

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
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
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
          <div className="space-y-6">
            <p className="text-center text-sm text-slate-600">{t(ui.shelf.pickHint)}</p>
            <div className="album-bookshelf-cabinet mx-auto max-w-3xl overflow-hidden rounded-lg shadow-2xl">
              {shelves.map((row, rowIndex) => (
                <div key={rowIndex} className="album-shelf-tier">
                  <div className="album-shelf-back flex min-h-[188px] items-end gap-[3px] px-5 pb-1 pt-6">
                    {row.map((album) => (
                      <div
                        key={album.id}
                        className="group/spine relative flex flex-col items-center"
                      >
                        <div className="absolute -top-7 z-10 hidden min-w-max gap-1 rounded-md bg-black/75 px-2 py-1 group-hover/spine:flex">
                          <Link
                            href={`/album/${album.id}/edit`}
                            className="rounded p-1 text-white/90 hover:bg-white/15"
                            aria-label={t(ui.shelf.edit)}
                            onClick={(event) => event.stopPropagation()}
                          >
                            <Pencil className="size-3.5" />
                          </Link>
                          <button
                            type="button"
                            className="rounded p-1 text-rose-300 hover:bg-white/15"
                            aria-label={t(ui.shelf.deleteAria)}
                            onClick={(event) => {
                              event.stopPropagation();
                              handleDelete(album.id, album.title);
                            }}
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                        <button
                          type="button"
                          className="album-shelf-spine-btn cursor-pointer border-0 bg-transparent p-0"
                          onClick={(event) => handleOpenBook(album, event.currentTarget)}
                          aria-label={interpolate(t(ui.shelf.openBookAria), { title: album.title })}
                          title={album.title}
                        >
                          <AlbumBookSpine album={album} interactive />
                        </button>
                        <p className="mt-2 hidden max-w-[72px] truncate text-center text-[10px] text-amber-100/70 sm:block">
                          {formatPageCount(album.pages.length, locale)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="album-shelf-plank-dark h-4" aria-hidden />
                </div>
              ))}
            </div>
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
