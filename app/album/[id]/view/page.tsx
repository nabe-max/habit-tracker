import { AlbumViewPageClient } from "@/components/album/AlbumViewPageClient";

export default async function AlbumViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AlbumViewPageClient id={id} />;
}
