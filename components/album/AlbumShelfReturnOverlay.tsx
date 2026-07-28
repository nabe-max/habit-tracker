"use client";

import { useEffect, useState } from "react";

import { AlbumBookCover } from "@/components/album/AlbumBookCover";
import { AlbumBookSpine } from "@/components/album/AlbumBookSpine";
import type { Album } from "@/types/album";

type AnimationPhase = "start" | "turn" | "move" | "insert";

interface AlbumShelfReturnOverlayProps {
  album: Album;
  targetRect: DOMRect;
  onComplete: () => void;
}

export function AlbumShelfReturnOverlay({
  album,
  targetRect,
  onComplete,
}: AlbumShelfReturnOverlayProps) {
  const [phase, setPhase] = useState<AnimationPhase>("start");
  const [visible, setVisible] = useState(false);
  const [viewport, setViewport] = useState({ width: 390, height: 844 });

  useEffect(() => {
    setViewport({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    const turn = window.setTimeout(() => setPhase("turn"), 80);
    const move = window.setTimeout(() => setPhase("move"), 480);
    const insert = window.setTimeout(() => setPhase("insert"), 960);
    const done = window.setTimeout(() => onComplete(), 1300);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(turn);
      window.clearTimeout(move);
      window.clearTimeout(insert);
      window.clearTimeout(done);
    };
  }, [onComplete]);

  const coverWidth = Math.min(300, Math.max(targetRect.width * 4.5, 240));
  const coverHeight = coverWidth * (4 / 3);

  const atShelf = phase === "move" || phase === "insert";
  const left = atShelf ? targetRect.left : viewport.width / 2 - coverWidth / 2;
  const top = atShelf
    ? targetRect.top + (phase === "insert" ? 0 : -28)
    : viewport.height / 2 - coverHeight / 2;
  const width = atShelf ? targetRect.width : coverWidth;
  const height = atShelf ? targetRect.height : coverHeight;
  const rotateY = phase === "start" ? -24 : phase === "turn" ? -6 : phase === "move" ? 8 : 0;
  const scale = phase === "insert" ? 1 : phase === "move" ? 1.04 : 1.06;
  const showCover = phase === "start" || phase === "turn";

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
            style={{ opacity: showCover ? 1 : 0 }}
          >
            <AlbumBookCover album={album} className="h-full w-full shadow-2xl" />
          </div>
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{ opacity: showCover ? 0 : 1 }}
          >
            <AlbumBookSpine album={album} className="h-full w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
