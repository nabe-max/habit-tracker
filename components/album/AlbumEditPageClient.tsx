"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { AlbumEditor } from "@/components/album/AlbumEditor";
import { AlbumHeader } from "@/components/album/AlbumHeader";
import { useAlbumUi } from "@/components/album/AlbumLocaleProvider";
import { Button } from "@/components/ui/button";
import { getAlbum } from "@/lib/album/storage";
import type { Album } from "@/types/album";

interface AlbumEditPageClientProps {
  id: string;
}

export function AlbumEditPageClient({ id }: AlbumEditPageClientProps) {
  const router = useRouter();
  const { t, ui } = useAlbumUi();
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
        {t(ui.edit.loading)}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
      <AlbumHeader
        title={album.title}
        actions={
          <Button asChild size="sm" className="bg-violet-600 hover:bg-violet-700">
            <Link href={`/album/${album.id}/view`}>
              {t(ui.edit.viewAsBook)}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        }
      />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <AlbumEditor album={album} onAlbumChange={setAlbum} />
      </main>
    </div>
  );
}
