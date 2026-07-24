"use client";

import { useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";

import { AlbumPageSurface } from "@/components/album/AlbumPageSurface";
import { FlipPage } from "@/components/album/FlipPage";
import { Button } from "@/components/ui/button";
import { interpolate } from "@/data/album/ui";
import type { Album } from "@/types/album";
import { ALBUM_PAGE_HEIGHT, ALBUM_PAGE_WIDTH } from "@/types/album";

import { useAlbumUi } from "./AlbumLocaleProvider";

interface AlbumBookViewerProps {
  album: Album;
}

type FlipBookRef = {
  pageFlip: () => {
    flipNext: () => void;
    flipPrev: () => void;
  };
};

export function AlbumBookViewer({ album }: AlbumBookViewerProps) {
  const { t, ui } = useAlbumUi();
  const bookRef = useRef<FlipBookRef>(null);
  const [page, setPage] = useState(0);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function updateScale() {
      const maxW = Math.min(window.innerWidth - 24, 420);
      setScale(Math.min(1, maxW / ALBUM_PAGE_WIDTH));
    }
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const width = ALBUM_PAGE_WIDTH * scale;
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
          <FlipPage className="flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-200">
            <div className="border-y-4 border-amber-800/20 px-8 text-center">
              <BookOpen className="mx-auto mb-4 size-10 text-amber-900/70" />
              <h2 className="text-2xl font-bold text-amber-950">{album.title}</h2>
              <p className="mt-2 text-sm text-amber-900/70">{t(ui.book.coverHint)}</p>
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
