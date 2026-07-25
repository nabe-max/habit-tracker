import { list, put } from "@vercel/blob";

import type { Album, AlbumPage } from "@/types/album";

export const MAX_PUBLISH_BYTES = 4 * 1024 * 1024;

export interface PublishedAlbumRecord {
  shareId: string;
  title: string;
  pages: AlbumPage[];
  publishedAt: string;
  updatedAt: string;
}

function blobPath(shareId: string): string {
  return `published-albums/${shareId}.json`;
}

export function isBlobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

export async function publishAlbumToBlob(
  album: Album,
  existingShareId?: string,
): Promise<PublishedAlbumRecord> {
  if (!isBlobConfigured()) {
    throw new Error("BLOB_NOT_CONFIGURED");
  }

  const now = new Date().toISOString();
  const shareId = existingShareId ?? crypto.randomUUID();
  const record: PublishedAlbumRecord = {
    shareId,
    title: album.title,
    pages: album.pages,
    publishedAt: existingShareId ? album.publishedAt ?? now : now,
    updatedAt: now,
  };

  const body = JSON.stringify(record);
  if (body.length > MAX_PUBLISH_BYTES) {
    throw new Error("PAYLOAD_TOO_LARGE");
  }

  await put(blobPath(shareId), body, {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });

  return record;
}

export async function getPublishedAlbumFromBlob(
  shareId: string,
): Promise<PublishedAlbumRecord | null> {
  if (!isBlobConfigured()) {
    return null;
  }

  const pathname = blobPath(shareId);
  const { blobs } = await list({ prefix: pathname, limit: 1 });

  const match = blobs.find((blob) => blob.pathname === pathname);
  if (!match) return null;

  const response = await fetch(match.url, { cache: "no-store" });
  if (!response.ok) return null;

  return (await response.json()) as PublishedAlbumRecord;
}

export function toViewerAlbum(record: PublishedAlbumRecord): Album {
  return {
    id: record.shareId,
    title: record.title,
    pages: record.pages,
    createdAt: record.publishedAt,
    updatedAt: record.updatedAt,
    shareId: record.shareId,
    publishedAt: record.publishedAt,
  };
}
