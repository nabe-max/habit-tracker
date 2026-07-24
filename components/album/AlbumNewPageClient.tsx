"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { AlbumHeader } from "@/components/album/AlbumHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveAlbum } from "@/lib/album/storage";
import { createAlbum } from "@/types/album";

export function AlbumNewPageClient() {
  const router = useRouter();
  const [title, setTitle] = useState("");

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim() || "無題のアルバム";
    const album = createAlbum(trimmed);
    saveAlbum(album);
    router.push(`/album/${album.id}/edit`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
      <AlbumHeader title="新しいアルバム" />
      <main className="mx-auto max-w-md px-4 py-12 sm:px-6">
        <form
          onSubmit={handleCreate}
          className="space-y-4 rounded-2xl border border-violet-100 bg-white p-6 shadow-sm"
        >
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-slate-700">
              アルバムのタイトル
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例: 大阪旅行 2026"
              className="border-violet-100"
            />
          </div>
          <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700">
            作成して編集へ
          </Button>
        </form>
      </main>
    </div>
  );
}
