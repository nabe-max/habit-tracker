"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpen, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AlbumHeader } from "@/components/album/AlbumHeader";
import { Button } from "@/components/ui/button";
import { deleteAlbum, getAlbums } from "@/lib/album/storage";
import type { Album } from "@/types/album";

export function AlbumBookshelf() {
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    setAlbums(getAlbums());
  }, []);

  function handleDelete(id: string, title: string) {
    if (!confirm(`「${title}」を削除しますか？`)) return;
    deleteAlbum(id);
    setAlbums(getAlbums());
    toast.success("アルバムを削除しました");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
      <AlbumHeader
        actions={
          <Button asChild className="bg-violet-600 hover:bg-violet-700">
            <Link href="/album/new">
              <Plus className="size-4" />
              新しいアルバム
            </Link>
          </Button>
        }
      />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {albums.length === 0 ? (
          <div className="rounded-3xl border border-violet-100 bg-white/90 px-6 py-16 text-center shadow-sm">
            <BookOpen className="mx-auto size-12 text-violet-300" />
            <h2 className="mt-4 text-xl font-semibold text-slate-800">
              本棚は空です
            </h2>
            <p className="mt-2 text-slate-600">
              写真を自由に配置して、本のようにめくれるアルバムを作れます。
            </p>
            <Button asChild className="mt-6 bg-violet-600 hover:bg-violet-700">
              <Link href="/album/new">最初のアルバムを作る</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {albums.map((album) => (
              <article
                key={album.id}
                className="group rounded-2xl border border-violet-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex aspect-[3/4] items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-fuchsia-100">
                  <BookOpen className="size-10 text-violet-400" />
                </div>
                <h2 className="mt-3 font-semibold text-slate-800">{album.title}</h2>
                <p className="text-sm text-slate-500">{album.pages.length} ページ</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button asChild size="sm" className="bg-violet-600 hover:bg-violet-700">
                    <Link href={`/album/${album.id}/view`}>本を開く</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/album/${album.id}/edit`}>編集</Link>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="text-rose-600 hover:text-rose-700"
                    onClick={() => handleDelete(album.id, album.title)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
