"use client";

import { useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";

import { AlbumPageSurface } from "@/components/album/AlbumPageSurface";
import { FlipPage } from "@/components/album/FlipPage";
import { Button } from "@/components/ui/button";
import { interpolate } from "@/data/album/ui";
import { getAlbumCoverSrc } from "@/lib/album/cover";
import type { Album } from "@/types/album";
import { ALBUM_PAGE_HEIGHT, ALBUM_PAGE_WIDTH } from "@/types/album";

import { useAlbumUi } from "./AlbumLocaleProvider";

interface AlbumBookViewerProps {
  album: Album;
  autoOpenCover?: boolean;
}

type FlipBookRef = {
  pageFlip: () => {
    flipNext: () => void;
    flipPrev: () => void;
  };
};

export function AlbumBookViewer({ album, autoOpenCover = false }: AlbumBookViewerProps) {
  const { t, ui } = useAlbumUi();
  const bookRef = useRef<FlipBookRef>(null);
  const [page, setPage] = useState(0);
  const [scale, setScale] = useState(1);
  const coverSrc = getAlbumCoverSrc(album);

  useEffect(() => {
    function updateScale() {
      const maxW = Math.min(window.innerWidth - 24, 420);
      setScale(Math.min(1, maxW / ALBUM_PAGE_WIDTH));
    }
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  useEffect(() => {
    if (!autoOpenCover) return;
    const timer = window.setTimeout(() => {
      bookRef.current?.pageFlip().flipNext();
    }, 650);
    return () => window.clearTimeout(timer);
  }, [autoOpenCover]);

  const height = ALBUM_PAGE_HEIGHT * scale;
  const totalPages = album.pages.length + 2;

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="origin-top"
        style={{
          transform: `scale(${scale})`,
          width: ALBUM_PAGE_WIDTH,
          height: ALBUM_PAGE_HEIGHT,
          marginBottom: (ALBUM_PAGE_HEIGHT - height) * -1 + 16,
        }}
      >
        <HTMLFlipBook
          ref={bookRef}
          width={ALBUM_PAGE_WIDTH}
          height={ALBUM_PAGE_HEIGHT}
          size="fixed"
          minWidth={280}
          maxWidth={ALBUM_PAGE_WIDTH}
          minHeight={373}
          maxHeight={ALBUM_PAGE_HEIGHT}
          showCover
          mobileScrollSupport
          drawShadow
          flippingTime={600}
          usePortrait
          startPage={0}
          startZIndex={0}
          autoSize={false}
          maxShadowOpacity={0.4}
          clickEventForward
          useMouseEvents
          swipeDistance={30}
          showPageCorners
          disableFlipByClick={false}
          onFlip={(e) => setPage(Number(e.data))}
          className="album-flip-book"
          style={{}}
        >
          <FlipPage className="relative overflow-hidden bg-gradient-to-br from-amber-100 to-orange-200">
            {coverSrc ? (
              <>
                <img src={coverSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
              </>
            ) : null}
            <div className="relative flex h-full flex-col items-center justify-end px-8 pb-10 text-center">
              {!coverSrc ? <BookOpen className="mx-auto mb-4 size-10 text-amber-900/70" /> : null}
              <h2 className="text-2xl font-bold text-white drop-shadow-md">{album.title}</h2>
              <p className="mt-2 text-sm text-white/85">{t(ui.book.coverHint)}</p>
            </div>
          </FlipPage>

          {album.pages.map((pageData) => (
            <FlipPage key={pageData.id}>
              <AlbumPageSurface items={pageData.items} />
            </FlipPage>
          ))}

          <FlipPage className="flex items-center justify-center bg-gradient-to-br from-orange-100 to-amber-50">
            <p className="text-sm font-medium text-amber-900/60">{t(ui.book.end)}</p>
          </FlipPage>
        </HTMLFlipBook>
      </div>

      <div className="flex items-center gap-3">
        <Button type="button" variant="outline" size="sm" onClick={() => bookRef.current?.pageFlip().flipPrev()}>
          <ChevronLeft className="size-4" />
          {t(ui.book.prev)}
        </Button>
        <span className="text-sm text-slate-600">
          {interpolate(t(ui.book.pageOf), { current: page + 1, total: totalPages })}
        </span>
        <Button type="button" variant="outline" size="sm" onClick={() => bookRef.current?.pageFlip().flipNext()}>
          {t(ui.book.next)}
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
