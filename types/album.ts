export const ALBUM_PAGE_WIDTH = 360;
export const ALBUM_PAGE_HEIGHT = 480;

export interface AlbumPhotoItem {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export interface AlbumPage {
  id: string;
  items: AlbumPhotoItem[];
}

export interface Album {
  id: string;
  title: string;
  pages: AlbumPage[];
  createdAt: string;
  updatedAt: string;
}

export function createEmptyPage(): AlbumPage {
  return {
    id: crypto.randomUUID(),
    items: [],
  };
}

export function createAlbum(title: string): Album {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title,
    pages: [createEmptyPage()],
    createdAt: now,
    updatedAt: now,
  };
}
