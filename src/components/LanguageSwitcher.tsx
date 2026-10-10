import { useRouterState } from "@tanstack/react-router";
import { LOCALE_COOKIE, LOCALES, isLocale, type Locale } from "@/lib/seo";
import { useI18n } from "@/lib/i18n";

/**
 * Locale switcher rendered as real anchors (not a JS toggle) so that crawlers
 * can discover the alternate language URLs and the links carry `hreflang`.
 * The current path is preserved, only the locale prefix changes. The choice is
 * remembered in a cookie so the bare `/` redirect respects it later.
 */
export function LanguageSwitcher() {
  const { language } = useI18n();
  const location = useRouterState({ select: (state) => state.location });

  const segments = location.pathname.split("/").filter(Boolean);
  const hasLocale = isLocale(segments[0]);
  const rest = hasLocale ? segments.slice(1) : segments;

  const urlFor = (locale: Locale) => {
    const base = `/${locale}${rest.length ? `/${rest.join("/")}` : ""}`;
    return `${base}${location.searchStr ?? ""}${location.hash ?? ""}`;
  };

  const rememberLocale = (locale: Locale) => {
    try {
      document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
    } catch {
      // Ignore when cookies are unavailable.
    }
  };

  return (
    <div
      className="inline-flex items-center rounded-full border border-ink/15 bg-surface/80 p-0.5 font-sans text-xs tracking-wider text-ink shadow-sm backdrop-blur-md"
      role="group"
      aria-label="Idioma / Language"
    >
      {LOCALES.map((locale) => {
        const isActive = language === locale;
        return (
          <a
            key={locale}
            href={urlFor(locale)}
            hrefLang={locale}
            aria-current={isActive ? "true" : undefined}
            onClick={() => rememberLocale(locale)}
            className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
              isActive
                ? "bg-ink text-canvas shadow-md scale-[1.03]"
                : "text-ink/70 hover:text-ink hover:scale-105"
            }`}
          >
            {locale}
          </a>
        );
      })}
    </div>
  );
}
