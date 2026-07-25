import Link from "next/link";
import { notFound } from "next/navigation";

import { AlbumPublicPageClient } from "@/components/album/AlbumPublicPageClient";
import {
  getPublishedAlbumFromBlob,
  toViewerAlbum,
} from "@/lib/album/publish-server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = await params;
  const record = await getPublishedAlbumFromBlob(shareId);
  return {
    title: record ? `${record.title} | Album Book` : "Album Book",
  };
}

export default async function PublicAlbumPage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = await params;
  const record = await getPublishedAlbumFromBlob(shareId);
  if (!record) notFound();

  return <AlbumPublicPageClient album={toViewerAlbum(record)} />;
}
