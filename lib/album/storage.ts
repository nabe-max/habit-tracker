import type { Album } from "@/types/album";

const STORAGE_KEY = "photo-albums";

export type ImageReadErrorCode = "not_image" | "too_large" | "read_failed";

export class ImageReadError extends Error {
  constructor(public code: ImageReadErrorCode) {
    super(code);
  }
}

export function getAlbums(): Album[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Album[]) : [];
  } catch {
    return [];
  }
}

export function getAlbum(id: string): Album | undefined {
  return getAlbums().find((album) => album.id === id);
}

export function saveAlbum(album: Album): void {
  const albums = getAlbums().filter((a) => a.id !== album.id);
  const next = { ...album, updatedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([next, ...albums]));
}

export function deleteAlbum(id: string): void {
  const albums = getAlbums().filter((a) => a.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(albums));
}

export function readImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new ImageReadError("not_image"));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      reject(new ImageReadError("too_large"));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new ImageReadError("read_failed"));
    reader.readAsDataURL(file);
  });
}
