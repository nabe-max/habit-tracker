import type { Album } from "@/types/album";

export function getAlbumCoverSrc(album: Album): string | null {
  for (const page of album.pages) {
    const first = page.items[0];
    if (first) return first.src;
  }
  return null;
}
