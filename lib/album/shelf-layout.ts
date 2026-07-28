export const BOOKS_PER_SHELF = 7;

const LAYOUT_KEY = "album-shelf-layout";

export const ALBUM_SHELF_CHECKOUT_KEY = "album-shelf-checked-out";
export const ALBUM_SHELF_RETURN_KEY = "album-shelf-return";

export interface ShelfCheckout {
  albumId: string;
  slotIndex: number;
}

function getCheckedOutIds(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = sessionStorage.getItem(ALBUM_SHELF_CHECKOUT_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveCheckedOutIds(ids: string[]): void {
  sessionStorage.setItem(ALBUM_SHELF_CHECKOUT_KEY, JSON.stringify(ids));
}

export function getShelfLayout(): (string | null)[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(LAYOUT_KEY);
    return raw ? (JSON.parse(raw) as (string | null)[]) : [];
  } catch {
    return [];
  }
}

function saveShelfLayout(slots: (string | null)[]): void {
  localStorage.setItem(LAYOUT_KEY, JSON.stringify(slots));
}

export function syncShelfLayout(albumIds: string[]): (string | null)[] {
  let slots = getShelfLayout();

  slots = slots.map((id) => (id && albumIds.includes(id) ? id : null));

  for (const id of albumIds) {
    if (!slots.includes(id)) {
      const emptyIndex = slots.findIndex((slot) => slot === null);
      if (emptyIndex >= 0) {
        slots[emptyIndex] = id;
      } else {
        slots.push(id);
      }
    }
  }

  saveShelfLayout(slots);
  return slots;
}

export function getSlotIndex(albumId: string): number {
  return getShelfLayout().indexOf(albumId);
}

export function addAlbumToShelf(albumId: string): number {
  const slots = getShelfLayout();
  if (slots.includes(albumId)) {
    return slots.indexOf(albumId);
  }

  const emptyIndex = slots.findIndex((slot) => slot === null);
  if (emptyIndex >= 0) {
    slots[emptyIndex] = albumId;
  } else {
    slots.push(albumId);
  }

  saveShelfLayout(slots);
  return emptyIndex >= 0 ? emptyIndex : slots.length - 1;
}

export function removeAlbumFromShelf(albumId: string): void {
  const slots = getShelfLayout().map((id) => (id === albumId ? null : id));
  saveShelfLayout(slots);
  returnAlbum(albumId);
}

export function checkoutAlbum(albumId: string): ShelfCheckout {
  const slotIndex = getSlotIndex(albumId);
  const ids = getCheckedOutIds();
  if (!ids.includes(albumId)) {
    saveCheckedOutIds([...ids, albumId]);
  }
  return { albumId, slotIndex: Math.max(slotIndex, 0) };
}

export function isCheckedOut(albumId: string): boolean {
  return getCheckedOutIds().includes(albumId);
}

export function returnAlbum(albumId: string): void {
  saveCheckedOutIds(getCheckedOutIds().filter((id) => id !== albumId));
}

export function getCheckout(): ShelfCheckout | null {
  const ids = getCheckedOutIds();
  if (ids.length === 0) return null;
  const albumId = ids[ids.length - 1];
  return { albumId, slotIndex: getSlotIndex(albumId) };
}

export function clearCheckout(): void {
  sessionStorage.removeItem(ALBUM_SHELF_CHECKOUT_KEY);
}

export function markReturningToShelf(albumId: string): void {
  sessionStorage.setItem(ALBUM_SHELF_RETURN_KEY, albumId);
}

export function consumeReturnAlbumId(): string | null {
  if (typeof window === "undefined") return null;

  const id = sessionStorage.getItem(ALBUM_SHELF_RETURN_KEY);
  sessionStorage.removeItem(ALBUM_SHELF_RETURN_KEY);
  return id;
}

export function slotsToRows(slots: (string | null)[]): (string | null)[][] {
  const rows: (string | null)[][] = [];
  for (let i = 0; i < slots.length; i += BOOKS_PER_SHELF) {
    rows.push(slots.slice(i, i + BOOKS_PER_SHELF));
  }
  return rows.length > 0 ? rows : [[]];
}

export function globalSlotIndex(rowIndex: number, colIndex: number): number {
  return rowIndex * BOOKS_PER_SHELF + colIndex;
}
