export type AlbumLocale = "en" | "ja";

export const ALBUM_LOCALE_STORAGE_KEY = "album-locale";

export type LocalizedText = Record<AlbumLocale, string>;

export function pickText(value: LocalizedText, locale: AlbumLocale): string {
  return value[locale];
}

export function formatPageTab(index: number, locale: AlbumLocale): string {
  const n = index + 1;
  return locale === "ja" ? `${n}ページ` : `Page ${n}`;
}

export function formatPageCount(count: number, locale: AlbumLocale): string {
  return locale === "ja" ? `${count} ページ` : `${count} pages`;
}
