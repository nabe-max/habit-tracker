"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Image as KonvaImage, Layer, Stage, Transformer } from "react-konva";
import useImage from "use-image";
import type Konva from "konva";
import { ImagePlus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { readImageFile, ImageReadError, saveAlbum } from "@/lib/album/storage";
import { Button } from "@/components/ui/button";
import { formatPageTab } from "@/data/album/locale";
import type { Album, AlbumPhotoItem } from "@/types/album";
import { ALBUM_PAGE_HEIGHT, ALBUM_PAGE_WIDTH, createEmptyPage } from "@/types/album";

import { useAlbumUi } from "./AlbumLocaleProvider";

interface AlbumEditorProps {
  album: Album;
  onAlbumChange: (album: Album) => void;
}

function CanvasImage({
  item,
  isSelected,
  onSelect,
  onChange,
}: {
  item: AlbumPhotoItem;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (patch: Partial<AlbumPhotoItem>) => void;
}) {
  const [image] = useImage(item.src);
  const shapeRef = useRef<Konva.Image>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <KonvaImage
        ref={shapeRef}
        image={image}
        x={item.x}
        y={item.y}
        width={item.width}
        height={item.height}
        rotation={item.rotation}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onChange({ x: e.target.x(), y: e.target.y() });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          if (!node) return;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            x: node.x(),
            y: node.y(),
            width: Math.max(40, node.width() * scaleX),
            height: Math.max(40, node.height() * scaleY),
            rotation: node.rotation(),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 40 || newBox.height < 40) return oldBox;
            return newBox;
          }}
        />
      )}
    </>
  );
}

export function AlbumEditor({ album, onAlbumChange }: AlbumEditorProps) {
  const { locale, t, ui } = useAlbumUi();
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const currentPage = album.pages[pageIndex];

  const persist = useCallback(
    (next: Album) => {
      onAlbumChange(next);
      saveAlbum(next);
    },
    [onAlbumChange],
  );

  const updatePageItems = useCallback(
    (items: AlbumPhotoItem[]) => {
      if (!currentPage) return;
      const pages = [...album.pages];
      pages[pageIndex] = { ...currentPage, items };
      persist({ ...album, pages });
    },
    [album, currentPage, pageIndex, persist],
  );

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !currentPage) return;

    try {
      const src = await readImageFile(file);
      const item: AlbumPhotoItem = {
        id: crypto.randomUUID(),
        src,
        x: ALBUM_PAGE_WIDTH / 2 - 80,
        y: ALBUM_PAGE_HEIGHT / 2 - 60,
        width: 160,
        height: 120,
        rotation: 0,
      };
      updatePageItems([...currentPage.items, item]);
      setSelectedId(item.id);
      toast.success(t(ui.editor.photoAdded));
    } catch (err) {
      if (err instanceof ImageReadError) {
        const map = {
          not_image: ui.errors.notImage,
          too_large: ui.errors.tooLarge,
          read_failed: ui.errors.readFailed,
        };
        toast.error(t(map[err.code]));
      } else {
        toast.error(t(ui.editor.addFailed));
      }
    }
  }

  function deleteSelected() {
    if (!selectedId || !currentPage) return;
    updatePageItems(currentPage.items.filter((item) => item.id !== selectedId));
    setSelectedId(null);
  }

  function addPage() {
    persist({ ...album, pages: [...album.pages, createEmptyPage()] });
    setPageIndex(album.pages.length);
    setSelectedId(null);
  }

  if (!currentPage) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {album.pages.map((page, index) => (
          <Button
            key={page.id}
            type="button"
            size="sm"
            variant={pageIndex === index ? "default" : "outline"}
            onClick={() => {
              setPageIndex(index);
              setSelectedId(null);
            }}
            className={
              pageIndex === index
                ? "bg-violet-600 hover:bg-violet-700"
                : "border-violet-200"
            }
          >
            {formatPageTab(index, locale)}
          </Button>
        ))}
        <Button type="button" size="sm" variant="outline" onClick={addPage}>
          {t(ui.editor.addPage)}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          onClick={() => fileRef.current?.click()}
          className="bg-violet-600 hover:bg-violet-700"
        >
          <ImagePlus className="size-4" />
          {t(ui.editor.addPhoto)}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={!selectedId}
          onClick={deleteSelected}
        >
          <Trash2 className="size-4" />
          {t(ui.editor.delete)}
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-violet-100 bg-slate-100 p-4 shadow-inner">
        <Stage
          width={ALBUM_PAGE_WIDTH}
          height={ALBUM_PAGE_HEIGHT}
          className="mx-auto bg-[#fffef9] shadow-md"
          onMouseDown={(e) => {
            if (e.target === e.target.getStage()) setSelectedId(null);
          }}
          onTouchStart={(e) => {
            if (e.target === e.target.getStage()) setSelectedId(null);
          }}
        >
          <Layer>
            {currentPage.items.map((item) => (
              <CanvasImage
                key={item.id}
                item={item}
                isSelected={item.id === selectedId}
                onSelect={() => setSelectedId(item.id)}
                onChange={(patch) => {
                  updatePageItems(
                    currentPage.items.map((entry) =>
                      entry.id === item.id ? { ...entry, ...patch } : entry,
                    ),
                  );
                }}
              />
            ))}
          </Layer>
        </Stage>
      </div>

      <p className="text-xs text-slate-500">{t(ui.editor.hint)}</p>
    </div>
  );
}
