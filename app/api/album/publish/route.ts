import { NextRequest, NextResponse } from "next/server";

import { publishAlbumToBlob } from "@/lib/album/publish-server";
import type { Album } from "@/types/album";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { album?: Album };
    const album = body.album;

    if (!album?.title || !Array.isArray(album.pages) || album.pages.length === 0) {
      return NextResponse.json({ error: "INVALID_ALBUM" }, { status: 400 });
    }

    const record = await publishAlbumToBlob(album, album.shareId);
    return NextResponse.json({
      shareId: record.shareId,
      publishedAt: record.publishedAt,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "BLOB_NOT_CONFIGURED") {
        return NextResponse.json(
          { error: "BLOB_NOT_CONFIGURED" },
          { status: 503 },
        );
      }
      if (error.message === "PAYLOAD_TOO_LARGE") {
        return NextResponse.json(
          { error: "PAYLOAD_TOO_LARGE" },
          { status: 413 },
        );
      }
    }
    console.error("[POST /api/album/publish]", error);
    return NextResponse.json({ error: "PUBLISH_FAILED" }, { status: 500 });
  }
}
