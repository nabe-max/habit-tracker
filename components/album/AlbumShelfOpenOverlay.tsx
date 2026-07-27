"use client";

import { useEffect, useState } from "react";

import { AlbumBookCover } from "@/components/album/AlbumBookCover";
import { AlbumBookSpine } from "@/components/album/AlbumBookSpine";
import type { Album } from "@/types/album";

export const ALBUM_SHELF_OPEN_KEY = "album-shelf-open";

type AnimationPhase = "start" | "pull" | "turn" | "open";

interface AlbumShelfOpenOverlayProps {
  album: Album;
  originRect: DOMRect;
  onComplete: () => void;
}

export function AlbumShelfOpenOverlay({ album, originRect, onComplete }: AlbumShelfOpenOverlayProps) {
  const [phase, setPhase] = useState<AnimationPhase>("start");
  const [visible, setVisible] = useState(false);
  const [viewport, setViewport] = useState({ width: 390, height: 844 });

  useEffect(() => {
    setViewport({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    const pull = window.setTimeout(() => setPhase("pull"), 80);
    const turn = window.setTimeout(() => setPhase("turn"), 520);
    const open = window.setTimeout(() => setPhase("open"), 980);
    const done = window.setTimeout(() => onComplete(), 1350);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(pull);
      window.clearTimeout(turn);
      window.clearTimeout(open);
      window.clearTimeout(done);
    };
  }, [onComplete]);

  const coverWidth = Math.min(300, Math.max(originRect.width * 4.5, 240));
  const coverHeight = coverWidth * (4 / 3);

  const atShelf = phase === "start" || phase === "pull";
  const left = atShelf ? originRect.left : viewport.width / 2 - coverWidth / 2;
  const top = atShelf
    ? originRect.top + (phase === "pull" ? -36 : 0)
    : viewport.height / 2 - coverHeight / 2;
  const width = atShelf ? originRect.width : coverWidth;
  const height = atShelf ? originRect.height : coverHeight;
  const rotateY = phase === "open" ? -28 : phase === "turn" ? -8 : phase === "pull" ? 12 : 0;
  const scale = phase === "open" ? 1.04 : phase === "turn" || phase === "pull" ? 1.08 : 1;
  const showCover = phase === "turn" || phase === "open";

  return (
    <div
      className="fixed inset-0 z-50 transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0, backgroundColor: "rgba(8, 6, 4, 0.72)" }}
      aria-hidden
    >
      <div
        className="album-shelf-open-book pointer-events-none"
        style={{
          position: "fixed",
          left,
          top,
          width,
          height,
          transform: `rotateY(${rotateY}deg) scale(${scale})`,
          transformOrigin: "left center",
          transition: "all 0.48s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <div className="relative h-full w-full">
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{ opacity: showCover ? 0 : 1 }}
          >
            <AlbumBookSpine album={album} className="h-full w-full" />
          </div>
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{ opacity: showCover ? 1 : 0 }}
          >
            <AlbumBookCover album={album} className="h-full w-full shadow-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
