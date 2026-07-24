"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ALBUM_LOCALE_STORAGE_KEY,
  type AlbumLocale,
  pickText,
} from "@/data/album/locale";
import { albumUi } from "@/data/album/ui";

interface AlbumLocaleContextValue {
  locale: AlbumLocale;
  setLocale: (locale: AlbumLocale) => void;
  t: (text: { en: string; ja: string }) => string;
}

const AlbumLocaleContext = createContext<AlbumLocaleContextValue | null>(null);

function detectInitialLocale(): AlbumLocale {
  if (typeof window === "undefined") return "en";
  try {
    const stored = localStorage.getItem(ALBUM_LOCALE_STORAGE_KEY);
    if (stored === "en" || stored === "ja") return stored;
  } catch {
    // ignore
  }
  if (typeof navigator !== "undefined" && navigator.language.startsWith("ja")) {
    return "ja";
  }
  return "en";
}

export function AlbumLocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<AlbumLocale>("en");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLocaleState(detectInitialLocale());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = locale;
    try {
      localStorage.setItem(ALBUM_LOCALE_STORAGE_KEY, locale);
    } catch {
      // ignore
    }
  }, [locale, ready]);

  const setLocale = useCallback((next: AlbumLocale) => {
    setLocaleState(next);
  }, []);

  const t = useCallback(
    (text: { en: string; ja: string }) => pickText(text, locale),
    [locale],
  );

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t],
  );

  return (
    <AlbumLocaleContext.Provider value={value}>
      {children}
    </AlbumLocaleContext.Provider>
  );
}

export function useAlbumLocale() {
  const ctx = useContext(AlbumLocaleContext);
  if (!ctx) {
    throw new Error("useAlbumLocale must be used within AlbumLocaleProvider");
  }
  return ctx;
}

export function useAlbumUi() {
  const { locale, t } = useAlbumLocale();
  return { locale, t, ui: albumUi };
}
