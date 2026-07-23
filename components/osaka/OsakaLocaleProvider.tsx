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
  OSAKA_LOCALE_STORAGE_KEY,
  type OsakaLocale,
  pickText,
} from "@/data/osaka/locale";
import { osakaUi } from "@/data/osaka/ui";

interface OsakaLocaleContextValue {
  locale: OsakaLocale;
  setLocale: (locale: OsakaLocale) => void;
  t: (text: { en: string; ja: string }) => string;
}

const OsakaLocaleContext = createContext<OsakaLocaleContextValue | null>(null);

function detectInitialLocale(): OsakaLocale {
  if (typeof window === "undefined") return "en";
  try {
    const stored = localStorage.getItem(OSAKA_LOCALE_STORAGE_KEY);
    if (stored === "en" || stored === "ja") return stored;
  } catch {
    // ignore
  }
  if (typeof navigator !== "undefined" && navigator.language.startsWith("ja")) {
    return "ja";
  }
  return "en";
}

export function OsakaLocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<OsakaLocale>("en");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLocaleState(detectInitialLocale());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = locale;
    try {
      localStorage.setItem(OSAKA_LOCALE_STORAGE_KEY, locale);
    } catch {
      // ignore
    }
  }, [locale, ready]);

  const setLocale = useCallback((next: OsakaLocale) => {
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
    <OsakaLocaleContext.Provider value={value}>
      {children}
    </OsakaLocaleContext.Provider>
  );
}

export function useOsakaLocale() {
  const ctx = useContext(OsakaLocaleContext);
  if (!ctx) {
    throw new Error("useOsakaLocale must be used within OsakaLocaleProvider");
  }
  return ctx;
}

export function useOsakaUi() {
  const { t } = useOsakaLocale();
  return { t, ui: osakaUi };
}
