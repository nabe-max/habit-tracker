const SPINE_PALETTE = [
  { bg: "#5c4033", accent: "#8b6914", text: "#f5e6d3" },
  { bg: "#722f37", accent: "#c9a227", text: "#fff5f0" },
  { bg: "#2f4f4f", accent: "#c0c0c0", text: "#eef6f6" },
  { bg: "#4a3728", accent: "#d4a574", text: "#faf3eb" },
  { bg: "#3d2b4a", accent: "#b8860b", text: "#f3ebff" },
  { bg: "#1e3a5f", accent: "#d4af37", text: "#eef4ff" },
  { bg: "#4a1c1c", accent: "#e8c547", text: "#fff8f0" },
  { bg: "#2d5016", accent: "#c9b896", text: "#f4fff0" },
] as const;

function hashId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getSpineWidth(id: string): number {
  return 28 + (hashId(id) % 16);
}

export function getSpineHeight(id: string): number {
  return 132 + (hashId(id) % 40);
}

export function getSpineStyle(id: string) {
  return SPINE_PALETTE[hashId(id) % SPINE_PALETTE.length];
}

export function chunkAlbums<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size));
  }
  return rows;
}
