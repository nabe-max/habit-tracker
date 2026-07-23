export type OsakaLocale = "en" | "ja";

export const OSAKA_LOCALE_STORAGE_KEY = "osaka-locale";

export type LocalizedText = Record<OsakaLocale, string>;

export type LocalizedList = Record<OsakaLocale, string[]>;

export function pickText(value: LocalizedText, locale: OsakaLocale): string {
  return value[locale];
}

export function pickList(value: LocalizedList, locale: OsakaLocale): string[] {
  return value[locale];
}
