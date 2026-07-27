"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

import { AlbumBookViewer } from "@/components/album/AlbumBookViewer";
import { AlbumHeader } from "@/components/album/AlbumHeader";
import { useAlbumUi } from "@/components/album/AlbumLocaleProvider";
import { ALBUM_SHELF_OPEN_KEY } from "@/components/album/AlbumShelfOpenOverlay";
import { Button } from "@/components/ui/button";
import { getAlbum } from "@/lib/album/storage";
import { cn } from "@/lib/utils";
import type { Album } from "@/types/album";

interface AlbumViewPageClientProps {
  id: string;
}

export function AlbumViewPageClient({ id }: AlbumViewPageClientProps) {
  const router = useRouter();
  const { t, ui } = useAlbumUi();
  const [album, setAlbum] = useState<Album | null>(null);
  const [fromShelf, setFromShelf] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const data = getAlbum(id);
    if (!data) {
      router.replace("/album");
      return;
    }
    setAlbum(data);

    const openedFromShelf = sessionStorage.getItem(ALBUM_SHELF_OPEN_KEY) === id;
    if (openedFromShelf) {
      sessionStorage.removeItem(ALBUM_SHELF_OPEN_KEY);
      setFromShelf(true);
    } else {
      setRevealed(true);
    }
  }, [id, router]);

  useEffect(() => {
    if (!fromShelf) return;
    const raf = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(raf);
  }, [fromShelf]);

  if (!album) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        {t(ui.edit.loading)}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
      <AlbumHeader
        title={album.title}
        actions={
          <Button asChild size="sm" variant="outline">
            <Link href={`/album/${album.id}/edit`}>
              <Pencil className="size-4" />
              {t(ui.view.edit)}
            </Link>
          </Button>
        }
      />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div
          className={cn(
            "transition-all duration-500 ease-out",
            revealed
              ? "translate-y-0 scale-100 opacity-100"
              : "translate-y-6 scale-[0.96] opacity-0",
          )}
        >
          <AlbumBookViewer album={album} autoOpenCover={fromShelf} />
        </div>
      </main>
    </div>
  );
}
