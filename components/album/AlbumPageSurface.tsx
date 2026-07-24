import type { AlbumPhotoItem } from "@/types/album";
import { ALBUM_PAGE_HEIGHT, ALBUM_PAGE_WIDTH } from "@/types/album";

interface AlbumPageSurfaceProps {
  items: AlbumPhotoItem[];
  className?: string;
}

export function AlbumPageSurface({ items, className }: AlbumPageSurfaceProps) {
  return (
    <div
      className={`relative overflow-hidden bg-[#fffef9] ${className ?? ""}`}
      style={{
        width: ALBUM_PAGE_WIDTH,
        height: ALBUM_PAGE_HEIGHT,
      }}
    >
      {items.map((item) => (
        <img
          key={item.id}
          src={item.src}
          alt=""
          className="absolute object-cover"
          style={{
            left: item.x,
            top: item.y,
            width: item.width,
            height: item.height,
            transform: `rotate(${item.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}
