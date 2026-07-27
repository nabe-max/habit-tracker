"use client";

import { useEffect, useState } from "react";

import { AlbumBookCover } from "@/components/album/AlbumBookCover";
import type { Album } from "@/types/album";

export const ALBUM_SHELF_OPEN_KEY = "album-shelf-open";

type AnimationPhase = "start" | "lift" | "center" | "open";

interface AlbumShelfOpenOverlayProps {
  album: Album;
  originRect: DOMRect;
  onComplete: () => void;
}

export function AlbumShelfOpenOverlay({ album, originRect, onComplete }: AlbumShelfOpenOverlayProps) {
  const [phase, setPhase] = useState<AnimationPhase>("start");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    const lift = window.setTimeout(() => setPhase("lift"), 50);
    const center = window.setTimeout(() => setPhase("center"), 450);
    const open = window.setTimeout(() => setPhase("open"), 900);
    const done = window.setTimeout(() => onComplete(), 1250);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(lift);
      window.clearTimeout(center);
      window.clearTimeout(open);
      window.clearTimeout(done);
    };
  }, [onComplete]);

  const centerWidth = Math.min(320, Math.max(originRect.width * 1.35, 240));
  const centerHeight = centerWidth * (4 / 3);

  const atOrigin = phase === "start" || phase === "lift";
  const left = atOrigin ? originRect.left : window.innerWidth / 2 - centerWidth / 2;
  const top = atOrigin
    ? originRect.top + (phase === "lift" ? -28 : 0)
    : window.innerHeight / 2 - centerHeight / 2;
  const width = atOrigin ? originRect.width : centerWidth;
  const height = atOrigin ? originRect.height : centerHeight;
  const rotateY = phase === "open" ? -32 : phase === "lift" ? -10 : 0;
  const scale = phase === "open" ? 1.05 : phase === "center" ? 1 : phase === "lift" ? 1.06 : 1;

  return (
    <div
      className="fixed inset-0 z-50 transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0, backgroundColor: "rgba(15, 23, 42, 0.45)" }}
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
          transition: "all 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <AlbumBookCover album={album} className="h-full w-full shadow-2xl" />
      </div>
    </div>
  );
}
