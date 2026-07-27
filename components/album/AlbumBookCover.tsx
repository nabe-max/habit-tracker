"use client";

import { BookOpen } from "lucide-react";

import { getAlbumCoverSrc } from "@/lib/album/cover";
import { cn } from "@/lib/utils";
import type { Album } from "@/types/album";

interface AlbumBookCoverProps {
  album: Album;
  coverSrc?: string | null;
  className?: string;
  titleClassName?: string;
  interactive?: boolean;
}

export function AlbumBookCover({
  album,
  coverSrc,
  className,
  titleClassName,
  interactive = false,
}: AlbumBookCoverProps) {
  const src = coverSrc ?? getAlbumCoverSrc(album);

  return (
    <div
      className={cn(
        "relative flex h-full w-full overflow-hidden rounded-r-md rounded-l-sm shadow-[4px_8px_20px_rgba(88,28,135,0.25)]",
        interactive && "transition-transform duration-200 group-hover:-translate-y-1 group-hover:shadow-[6px_14px_28px_rgba(88,28,135,0.35)]",
        className,
      )}
      style={{ perspective: "800px" }}
    >
      <div
        className="absolute inset-y-0 left-0 z-10 w-[10%] bg-gradient-to-r from-amber-900 to-amber-800 shadow-inner"
        aria-hidden
      />
      <div className="absolute inset-0 left-[8%] overflow-hidden rounded-r-md bg-gradient-to-br from-amber-100 to-orange-200">
        {src ? (
          <img src={src} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-violet-200 via-fuchsia-100 to-amber-100 px-3">
            <BookOpen className="size-10 text-violet-500/70" />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent px-3 pb-3 pt-10">
          <p className={cn("line-clamp-2 text-sm font-semibold text-white drop-shadow", titleClassName)}>
            {album.title}
          </p>
        </div>
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-black/15 to-transparent"
          aria-hidden
        />
      </div>
    </div>
  );
}
