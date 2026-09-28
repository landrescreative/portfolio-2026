import React, { createContext, useContext, useEffect, useState } from "react";
import { en, Translations } from "./locales/en";
import { es } from "./locales/es";

export type Language = "en" | "es";

interface I18nContextType {
  language: Language;
  lang: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const translations: Record<Language, Translations> = { en, es };

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const STORAGE_KEY = "portfolio_language_preference";

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("es");

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (savedLang && (savedLang === "en" || savedLang === "es")) {
        setLanguageState(savedLang);
      } else {
        setLanguageState("es");
      }
    } catch {
      // Fallback to default language on SSR or restricted environments
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore write errors
    }
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
