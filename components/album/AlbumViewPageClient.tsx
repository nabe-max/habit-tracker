"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

import { AlbumBookViewer } from "@/components/album/AlbumBookViewer";
import { AlbumHeader } from "@/components/album/AlbumHeader";
import { Button } from "@/components/ui/button";
import { getAlbum } from "@/lib/album/storage";
import type { Album } from "@/types/album";

interface AlbumViewPageClientProps {
  id: string;
}

export function AlbumViewPageClient({ id }: AlbumViewPageClientProps) {
  const router = useRouter();
  const [album, setAlbum] = useState<Album | null>(null);

  useEffect(() => {
    const data = getAlbum(id);
    if (!data) {
      router.replace("/album");
      return;
    }
    setAlbum(data);
  }, [id, router]);

  if (!album) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        読み込み中...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
      <AlbumHeader
        title={album.title}
        actions={
          <Button asChild size="sm" variant="outline">
            <Link href={`/album/${album.id}/edit`}>
              <Pencil className="size-4" />
              編集
            </Link>
          </Button>
        }
      />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <AlbumBookViewer album={album} />
      </main>
    </div>
  );
}
