"use client";

import { getAlbumCoverSrc } from "@/lib/album/cover";
import { getSpineHeight, getSpineStyle, getSpineWidth } from "@/lib/album/spine";
import { cn } from "@/lib/utils";
import type { Album } from "@/types/album";

interface AlbumBookSpineProps {
  album: Album;
  className?: string;
  interactive?: boolean;
}

export function AlbumBookSpine({ album, className, interactive = false }: AlbumBookSpineProps) {
  const style = getSpineStyle(album.id);
  const width = getSpineWidth(album.id);
  const height = getSpineHeight(album.id);
  const coverSrc = getAlbumCoverSrc(album);

  return (
    <div
      className={cn(
        "album-book-spine relative shrink-0 overflow-hidden rounded-sm shadow-[2px_0_6px_rgba(0,0,0,0.45)]",
        interactive &&
          "transition-transform duration-200 group-hover/spine:-translate-y-1.5 group-hover/spine:shadow-[3px_4px_12px_rgba(0,0,0,0.55)]",
        className,
      )}
      style={{
        width,
        height,
        background: `linear-gradient(90deg, ${style.bg} 0%, color-mix(in srgb, ${style.bg} 82%, white) 55%, ${style.bg} 100%)`,
        color: style.text,
      }}
    >
      {coverSrc ? (
        <div
          className="absolute inset-x-0 top-0 h-5 bg-cover bg-center opacity-90"
          style={{ backgroundImage: `url(${coverSrc})` }}
          aria-hidden
        />
      ) : null}
      <div
        className="absolute inset-x-0 top-0 h-1.5"
        style={{ backgroundColor: style.accent }}
        aria-hidden
      />
      <p
        className="absolute inset-x-0 bottom-2 top-7 flex items-center justify-center px-0.5 text-[9px] font-semibold leading-tight tracking-wide"
        style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
      >
        <span className="line-clamp-6 max-h-full overflow-hidden">{album.title}</span>
      </p>
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-px bg-white/15"
        aria-hidden
      />
    </div>
  );
}
