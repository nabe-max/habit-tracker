import { getSpineWidth } from "@/lib/album/spine";
import { cn } from "@/lib/utils";

interface AlbumShelfEmptySlotProps {
  albumId: string;
  className?: string;
  highlighted?: boolean;
}

export function AlbumShelfEmptySlot({
  albumId,
  className,
  highlighted = false,
}: AlbumShelfEmptySlotProps) {
  const width = getSpineWidth(albumId);

  return (
    <div
      className={cn(
        "album-shelf-empty-slot shrink-0 rounded-sm border border-dashed border-amber-200/20 bg-black/20",
        highlighted && "album-shelf-empty-slot--highlight",
        className,
      )}
      style={{ width, height: 148 }}
      aria-hidden
    />
  );
}
