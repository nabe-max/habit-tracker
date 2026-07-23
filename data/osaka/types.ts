export interface OsakaFaqItem {
  id: string;
  category: string;
  question: string;
  steps: string[];
  phrase?: { en: string; ja: string; romaji: string };
  link?: { label: string; href: string };
}

export interface OsakaPrepItem {
  id: string;
  title: string;
  detail: string;
}

export interface OsakaPlanSpot {
  time: string;
  title: string;
  description: string;
  mapsQuery: string;
  tip?: string;
}

export interface OsakaPlanDay {
  day: number;
  title: string;
  summary: string;
  headsUp: string;
  phrase: { en: string; ja: string; romaji: string };
  spots: OsakaPlanSpot[];
}

export interface OsakaPlan {
  slug: string;
  name: string;
  tagline: string;
  baseArea: string;
  days: OsakaPlanDay[];
}
