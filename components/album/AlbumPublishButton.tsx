"use client";

import { useState } from "react";
import { Copy, Globe, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useAlbumUi } from "@/components/album/AlbumLocaleProvider";
import { Button } from "@/components/ui/button";
import { saveAlbum } from "@/lib/album/storage";
import type { Album } from "@/types/album";

interface AlbumPublishButtonProps {
  album: Album;
  onPublished: (album: Album) => void;
}

function getPublicUrl(shareId: string): string {
  return `${window.location.origin}/album/p/${shareId}`;
}

export function AlbumPublishButton({
  album,
  onPublished,
}: AlbumPublishButtonProps) {
  const { t, ui } = useAlbumUi();
  const [isPublishing, setIsPublishing] = useState(false);

  async function handlePublish() {
    if (album.pages.length === 0) {
      toast.error(t(ui.publish.errors.invalid));
      return;
    }

    setIsPublishing(true);
    try {
      const res = await fetch("/api/album/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ album }),
      });
      const data = (await res.json()) as {
        shareId?: string;
        publishedAt?: string;
        error?: string;
      };

      if (!res.ok) {
        const message =
          data.error === "PAYLOAD_TOO_LARGE"
            ? t(ui.publish.errors.tooLarge)
            : data.error === "BLOB_NOT_CONFIGURED"
              ? t(ui.publish.errors.blob)
              : t(ui.publish.errors.failed);
        toast.error(message);
        return;
      }

      if (!data.shareId) {
        toast.error(t(ui.publish.errors.failed));
        return;
      }

      const updated: Album = {
        ...album,
        shareId: data.shareId,
        publishedAt: data.publishedAt ?? new Date().toISOString(),
      };
      saveAlbum(updated);
      onPublished(updated);

      const url = getPublicUrl(data.shareId);
      try {
        await navigator.clipboard.writeText(url);
        toast.success(t(ui.publish.success));
      } catch {
        toast.success(url);
      }
    } catch {
      toast.error(t(ui.publish.errors.failed));
    } finally {
      setIsPublishing(false);
    }
  }

  async function copyLink() {
    if (!album.shareId) return;
    try {
      await navigator.clipboard.writeText(getPublicUrl(album.shareId));
      toast.success(t(ui.publish.success));
    } catch {
      toast.error(t(ui.publish.errors.failed));
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        size="sm"
        variant={album.shareId ? "outline" : "default"}
        className={album.shareId ? "" : "bg-violet-600 hover:bg-violet-700"}
        disabled={isPublishing}
        onClick={handlePublish}
      >
        {isPublishing ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Globe className="size-4" />
        )}
        {album.shareId ? t(ui.publish.republish) : t(ui.publish.button)}
      </Button>
      {album.shareId && (
        <Button type="button" size="sm" variant="ghost" onClick={copyLink}>
          <Copy className="size-4" />
          {t(ui.publish.copyLink)}
        </Button>
      )}
    </div>
  );
}

interface AlbumPublishPanelProps {
  album: Album;
  onPublished: (album: Album) => void;
}

export function AlbumPublishPanel({ album, onPublished }: AlbumPublishPanelProps) {
  const { t, ui } = useAlbumUi();

  return (
    <div className="rounded-2xl border border-violet-100 bg-violet-50/50 p-4">
      <AlbumPublishButton album={album} onPublished={onPublished} />
      <p className="mt-2 text-xs text-slate-600">{t(ui.publish.publicViewHint)}</p>
      {album.shareId && (
        <p className="mt-2 break-all text-xs font-medium text-violet-700">
          /album/p/{album.shareId}
        </p>
      )}
    </div>
  );
}
