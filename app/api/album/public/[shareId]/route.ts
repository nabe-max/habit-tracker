import { NextResponse } from "next/server";

import { getPublishedAlbumFromBlob } from "@/lib/album/publish-server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ shareId: string }> },
) {
  const { shareId } = await params;
  const record = await getPublishedAlbumFromBlob(shareId);

  if (!record) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json(record);
}
