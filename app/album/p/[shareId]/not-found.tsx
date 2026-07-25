import Link from "next/link";

import { AlbumHeader } from "@/components/album/AlbumHeader";
import { Button } from "@/components/ui/button";

export default function PublicAlbumNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
      <AlbumHeader />
      <main className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-xl font-semibold text-slate-800">Album not found</h1>
        <p className="mt-2 text-slate-600">
          This link may be expired or incorrect.
        </p>
        <Button asChild className="mt-6 bg-violet-600 hover:bg-violet-700">
          <Link href="/album">Create your own album</Link>
        </Button>
      </main>
    </div>
  );
}
