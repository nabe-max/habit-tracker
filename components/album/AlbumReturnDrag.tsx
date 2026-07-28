"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BookMarked } from "lucide-react";

import { AlbumBookCover } from "@/components/album/AlbumBookCover";
import { useAlbumUi } from "@/components/album/AlbumLocaleProvider";
import { markReturningToShelf } from "@/lib/album/shelf-layout";
import { cn } from "@/lib/utils";
import type { Album } from "@/types/album";

interface AlbumReturnDragProps {
  album: Album;
}

export function AlbumReturnDrag({ album }: AlbumReturnDragProps) {
  const router = useRouter();
  const { t, ui } = useAlbumUi();
  const dragRef = useRef<HTMLDivElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [overZone, setOverZone] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const pointerStart = useRef({ x: 0, y: 0 });
  const originStart = useRef({ x: 0, y: 0 });

  function pointInZone(clientX: number, clientY: number) {
    const zone = zoneRef.current?.getBoundingClientRect();
    if (!zone) return false;
    return (
      clientX >= zone.left &&
      clientX <= zone.right &&
      clientY >= zone.top &&
      clientY <= zone.bottom
    );
  }

  function finishReturn() {
    markReturningToShelf(album.id);
    router.push("/album");
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    event.preventDefault();
    dragRef.current?.setPointerCapture(event.pointerId);
    setDragging(true);
    pointerStart.current = { x: event.clientX, y: event.clientY };
    originStart.current = { ...offset };
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return;

    const dx = event.clientX - pointerStart.current.x;
    const dy = event.clientY - pointerStart.current.y;
    setOffset({
      x: originStart.current.x + dx,
      y: originStart.current.y + dy,
    });
    setOverZone(pointInZone(event.clientX, event.clientY));
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return;

    dragRef.current?.releasePointerCapture(event.pointerId);
    setDragging(false);

    if (pointInZone(event.clientX, event.clientY)) {
      finishReturn();
      return;
    }

    setOffset({ x: 0, y: 0 });
    setOverZone(false);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 pointer-events-none">
      <div
        ref={zoneRef}
        className={cn(
          "album-return-drop-zone pointer-events-auto mx-auto max-w-3xl px-4 pb-4 transition-all duration-200",
          overZone && "album-return-drop-zone--active",
        )}
      >
        <div className="album-return-shelf-bar flex items-center gap-3 rounded-t-xl border border-b-0 border-amber-900/30 bg-gradient-to-b from-[#2a221c] to-[#1a1512] px-4 py-3 shadow-lg">
          <BookMarked className="size-5 shrink-0 text-amber-200/70" />
          <p className="text-sm text-amber-100/80">{t(ui.view.returnHint)}</p>
        </div>
      </div>

      <div
        ref={dragRef}
        className={cn(
          "album-return-drag-book pointer-events-auto fixed bottom-24 right-4 touch-none select-none",
          dragging ? "z-50 cursor-grabbing" : "z-40 cursor-grab",
        )}
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px)`,
          transition: dragging ? "none" : "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        role="button"
        aria-label={t(ui.view.returnDragAria)}
      >
        <div className="w-[88px] rounded-md shadow-2xl ring-2 ring-violet-300/50">
          <AlbumBookCover album={album} className="aspect-[3/4] w-full" />
        </div>
        <p className="mt-1 text-center text-[10px] font-medium text-slate-600">
          {t(ui.view.returnDragLabel)}
        </p>
      </div>
    </div>
  );
}
