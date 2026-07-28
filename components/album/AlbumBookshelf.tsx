"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { BookOpen, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AlbumBookSpine } from "@/components/album/AlbumBookSpine";
import { AlbumHeader } from "@/components/album/AlbumHeader";
import { useAlbumUi } from "@/components/album/AlbumLocaleProvider";
import { AlbumShelfEmptySlot } from "@/components/album/AlbumShelfEmptySlot";
import { ALBUM_SHELF_OPEN_KEY, AlbumShelfOpenOverlay } from "@/components/album/AlbumShelfOpenOverlay";
import { AlbumShelfReturnOverlay } from "@/components/album/AlbumShelfReturnOverlay";
import { Button } from "@/components/ui/button";
import { formatPageCount } from "@/data/album/locale";
import { interpolate } from "@/data/album/ui";
import {
  checkoutAlbum,
  consumeReturnAlbumId,
  getSlotIndex,
  globalSlotIndex,
  isCheckedOut,
  removeAlbumFromShelf,
  returnAlbum,
  slotsToRows,
  syncShelfLayout,
} from "@/lib/album/shelf-layout";
import { deleteAlbum, getAlbums } from "@/lib/album/storage";
import type { Album } from "@/types/album";

export function AlbumBookshelf() {
  const router = useRouter();
  const { locale, t, ui } = useAlbumUi();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [shelfSlots, setShelfSlots] = useState<(string | null)[]>([]);
  const [checkedOutIds, setCheckedOutIds] = useState<string[]>([]);
  const [opening, setOpening] = useState<{ album: Album; rect: DOMRect } | null>(null);
  const [returning, setReturning] = useState<{ album: Album; rect: DOMRect } | null>(null);
  const pendingReturnId = useRef<string | null>(null);

  const refreshShelf = useCallback(() => {
    const nextAlbums = getAlbums();
    const slots = syncShelfLayout(nextAlbums.map((album) => album.id));
    setAlbums(nextAlbums);
    setShelfSlots(slots);
    setCheckedOutIds(slots.filter((id): id is string => Boolean(id)).filter((id) => isCheckedOut(id)));
  }, []);

  useEffect(() => {
    refreshShelf();
    pendingReturnId.current = consumeReturnAlbumId();
  }, [refreshShelf]);

  useEffect(() => {
    const returnId = pendingReturnId.current;
    if (!returnId || albums.length === 0) return;

    const album = albums.find((item) => item.id === returnId);
    if (!album) {
      returnAlbum(returnId);
      pendingReturnId.current = null;
      return;
    }

    const slotIndex = getSlotIndex(returnId);
    const timer = window.setTimeout(() => {
      const slot = document.querySelector(`[data-slot-index="${slotIndex}"]`);
      if (slot instanceof HTMLElement) {
        setReturning({ album, rect: slot.getBoundingClientRect() });
      } else {
        returnAlbum(returnId);
      }
      pendingReturnId.current = null;
    }, 80);

    return () => window.clearTimeout(timer);
  }, [albums]);

  const finishOpen = useCallback(() => {
    if (!opening) return;
    sessionStorage.setItem(ALBUM_SHELF_OPEN_KEY, opening.album.id);
    router.push(`/album/${opening.album.id}/view`);
    setOpening(null);
    setCheckedOutIds((prev) =>
      prev.includes(opening.album.id) ? prev : [...prev, opening.album.id],
    );
  }, [opening, router]);

  const finishReturn = useCallback(() => {
    if (!returning) return;
    returnAlbum(returning.album.id);
    setReturning(null);
    refreshShelf();
  }, [returning, refreshShelf]);

  function handleDelete(id: string, title: string) {
    const message = interpolate(t(ui.shelf.deleteConfirm), { title });
    if (!confirm(message)) return;
    removeAlbumFromShelf(id);
    deleteAlbum(id);
    refreshShelf();
    toast.success(t(ui.shelf.deleted));
  }

  function handleOpenBook(album: Album, target: HTMLElement) {
    if (opening || returning) return;
    checkoutAlbum(album.id);
    setCheckedOutIds((prev) => (prev.includes(album.id) ? prev : [...prev, album.id]));
    const rect = target.getBoundingClientRect();
    setOpening({ album, rect });
  }

  const albumById = new Map(albums.map((album) => [album.id, album]));
  const shelves = slotsToRows(shelfSlots);
  const hasAlbums = albums.length > 0;

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
        {!hasAlbums ? (
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
                    {row.map((albumId, colIndex) => {
                      const slotIndex = globalSlotIndex(rowIndex, colIndex);
                      if (!albumId) {
                        return <div key={`empty-${slotIndex}`} className="w-8 shrink-0" aria-hidden />;
                      }

                      const album = albumById.get(albumId);
                      if (!album) return null;

                      const checkedOut = checkedOutIds.includes(albumId);

                      return (
                        <div
                          key={albumId}
                          data-slot-index={slotIndex}
                          className="group/spine relative flex flex-col items-center"
                        >
                          {!checkedOut ? (
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
                          ) : null}

                          {checkedOut ? (
                            <AlbumShelfEmptySlot
                              albumId={albumId}
                              highlighted={returning?.album.id === albumId}
                            />
                          ) : (
                            <button
                              type="button"
                              className="album-shelf-spine-btn cursor-pointer border-0 bg-transparent p-0"
                              onClick={(event) => handleOpenBook(album, event.currentTarget)}
                              aria-label={interpolate(t(ui.shelf.openBookAria), {
                                title: album.title,
                              })}
                              title={album.title}
                            >
                              <AlbumBookSpine album={album} interactive />
                            </button>
                          )}

                          <p className="mt-2 hidden max-w-[72px] truncate text-center text-[10px] text-amber-100/70 sm:block">
                            {formatPageCount(album.pages.length, locale)}
                          </p>
                        </div>
                      );
                    })}
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

      {returning ? (
        <AlbumShelfReturnOverlay
          album={returning.album}
          targetRect={returning.rect}
          onComplete={finishReturn}
        />
      ) : null}
    </div>
  );
}
