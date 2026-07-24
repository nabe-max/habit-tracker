import { AlbumEditPageClient } from "@/components/album/AlbumEditPageClient";

export default async function AlbumEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AlbumEditPageClient id={id} />;
}
