import React, { createContext, useContext, useEffect, useState } from "react";
import { en, Translations } from "./locales/en";
import { es } from "./locales/es";
import { DEFAULT_LOCALE } from "@/lib/seo";

export type Language = "en" | "es";

interface I18nContextType {
  language: Language;
  lang: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const translations: Record<Language, Translations> = { en, es };

const I18nContext = createContext<I18nContextType | undefined>(undefined);

/**
 * The active language is driven by the URL prefix (`/es`, `/en`) so that every
 * page has a single, crawlable language. `initialLanguage` is resolved from the
 * pathname on the server (and on the client) to avoid hydration mismatches.
 */
export const I18nProvider: React.FC<{
  children: React.ReactNode;
  initialLanguage?: Language;
}> = ({ children, initialLanguage }) => {
  const [language, setLanguageState] = useState<Language>(initialLanguage ?? DEFAULT_LOCALE);

  useEffect(() => {
    if (initialLanguage) {
      setLanguageState(initialLanguage);
    }
  }, [initialLanguage]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = translations[language] || es;

  return (
    <I18nContext.Provider value={{ language, lang: language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};

/**
 * Pick a localized string without the hook. Use it in places where hooks cannot
 * run (route `head()` functions, module-level constants) and for one-off,
 * page-specific copy. Any string that is shared across pages should live in the
 * dictionaries under `t.ui` instead.
 */
export function tx(lang: Language, es: string, en: string): string {
  return lang === "en" ? en : es;
}
