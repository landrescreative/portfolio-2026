import { useI18n } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  const toggleLanguage = () => {
    setLanguage(language === "es" ? "en" : "es");
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="group inline-flex cursor-pointer items-center rounded-full border border-ink/15 bg-surface/80 p-0.5 font-sans text-xs tracking-wider text-ink backdrop-blur-md shadow-sm transition-transform duration-300 hover:scale-105"
      aria-label="Cambiar idioma / Switch language"
    >
      <span
        className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
          language === "es"
            ? "bg-ink text-canvas shadow-md scale-[1.03]"
            : "text-ink/70 group-hover:text-ink"
        }`}
      >
        ES
      </span>
      <span
        className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
          language === "en"
            ? "bg-ink text-canvas shadow-md scale-[1.03]"
            : "text-ink/70 group-hover:text-ink"
        }`}
      >
        EN
      </span>
    </button>
  );
}
