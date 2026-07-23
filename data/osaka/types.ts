import type { LocalizedList, LocalizedText } from "./locale";

export interface OsakaPhrase {
  en: string;
  ja: string;
  romaji: string;
}

export interface OsakaFaqItem {
  id: string;
  category: LocalizedText;
  question: LocalizedText;
  steps: LocalizedList;
  phrase?: OsakaPhrase;
  link?: { label: LocalizedText; href: string };
}

export interface OsakaPrepItem {
  id: string;
  title: LocalizedText;
  detail: LocalizedText;
}

export interface OsakaPlanSpot {
  time: string;
  title: LocalizedText;
  description: LocalizedText;
  mapsQuery: string;
  tip?: LocalizedText;
}

export interface OsakaPlanDay {
  day: number;
  title: LocalizedText;
  summary: LocalizedText;
  headsUp: LocalizedText;
  phrase: OsakaPhrase;
  spots: OsakaPlanSpot[];
}

export interface OsakaPlan {
  slug: string;
  name: LocalizedText;
  tagline: LocalizedText;
  baseArea: LocalizedText;
  days: OsakaPlanDay[];
}
