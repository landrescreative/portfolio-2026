import type { JSX } from "react";
import { createIsomorphicFn } from "@tanstack/react-start";
import { imageSize } from "./image";

/**
 * Central SEO configuration + helpers.
 *
 * Every route builds its `<head>` through `buildSeo()` so that canonical URLs,
 * hreflang alternates, Open Graph/Twitter cards and JSON-LD stay consistent.
 */

/** Production origin (no trailing slash). */
export const SITE_URL = "https://www.landrescreative.com";

/** Brand name used across cards and structured data. */
export const SITE_NAME = "Luis Andrés (LANDRES)";

/** Default locale. Also used as `x-default` for hreflang. */
export const DEFAULT_LOCALE = "es" as const;

/** Supported locales. Order matters: first entry is the default. */
export const LOCALES = ["es", "en"] as const;

export type Locale = (typeof LOCALES)[number];

/** Cookie that remembers the visitor's language choice (1 year). */
export const LOCALE_COOKIE = "landres_locale";

export const OG_LOCALES: Record<Locale, string> = {
  es: "es_MX",
  en: "en_US",
};

export function isLocale(value: unknown): value is Locale {
  return value === "es" || value === "en";
}

/** Resolve the active locale from a pathname (falls back to default). */
export function localeFromPathname(pathname: string): Locale {
  const segment = pathname.split("/")[1];
  return isLocale(segment) ? segment : DEFAULT_LOCALE;
}

/** Turn a root-relative path into an absolute URL on the production origin. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Derive the JPEG social-card variant of a display image path. Covers ship an
 * optimised `.jpg` sibling (see `scripts/optimize-images.mjs`) because some
 * platforms · notably WhatsApp · still refuse WebP `og:image` files.
 */
export function ogImagePath(displayPath: string): string {
  return displayPath.replace(/\.(png|jpe?g|webp|svg)$/i, ".jpg");
}

/** Prefix a locale-agnostic path (e.g. "/about") with the active locale. */
export function localizedPath(lang: Locale, path = "/"): string {
  const suffix = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${lang}${suffix}`;
}

/** Normalize a BCP-47 tag ("en-US", "es_MX") to a supported locale. */
export function normalizeLocaleTag(value: string | null | undefined): Locale | null {
  if (!value) return null;
  const base = value.trim().toLowerCase().split(/[-_]/)[0];
  return isLocale(base) ? base : null;
}

/** Pick the best supported locale from an `Accept-Language` header. */
export function pickLocaleFromAcceptLanguage(header: string | null | undefined): Locale | null {
  if (!header) return null;
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const qParam = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      const q = qParam ? Number.parseFloat(qParam.slice(2)) : 1;
      return { tag: tag.trim(), q: Number.isFinite(q) ? q : 0 };
    })
    .filter((entry) => entry.tag)
    .sort((a, b) => b.q - a.q);

  for (const entry of ranked) {
    const locale = normalizeLocaleTag(entry.tag);
    if (locale) return locale;
  }
  return null;
}

/**
 * Resolve the visitor's preferred locale. Runs on the server (reads the
 * `Accept-Language` header) and on the client (reads `navigator.language`),
 * preferring the explicit choice saved in `LOCALE_COOKIE`.
 */
export const detectPreferredLocale = createIsomorphicFn()
  .server(async () => {
    const { getCookie, getRequest } = await import("@tanstack/react-start/server");
    const fromCookie = normalizeLocaleTag(getCookie(LOCALE_COOKIE) ?? null);
    if (fromCookie) return fromCookie;
    return (
      pickLocaleFromAcceptLanguage(getRequest().headers.get("accept-language")) ?? DEFAULT_LOCALE
    );
  })
  .client(() => {
    if (typeof document !== "undefined") {
      const match = document.cookie.match(/(?:^|;\s*)landres_locale=([^;]*)/);
      const fromCookie = normalizeLocaleTag(match ? decodeURIComponent(match[1]) : null);
      if (fromCookie) return fromCookie;
    }
    const langs =
      typeof navigator !== "undefined" ? (navigator.languages ?? [navigator.language]) : [];
    for (const tag of langs) {
      const locale = normalizeLocaleTag(tag);
      if (locale) return locale;
    }
    return DEFAULT_LOCALE;
  });

export type SeoMeta = NonNullable<JSX.IntrinsicElements["meta"]>;
export type SeoLink = NonNullable<JSX.IntrinsicElements["link"]>;

export type SeoInput = {
  /** Active locale. */
  lang: Locale;
  /** Locale-agnostic path, e.g. "/about" or "/projects". Defaults to "/". */
  path?: string;
  /** Page title (already localized). */
  title: string;
  /** Meta description (already localized). */
  description: string;
  /** Absolute or root-relative social share image. Defaults to the brand banner. */
  image?: string;
  /** Accessible alt text for the share image. */
  imageAlt?: string;
  /** Open Graph type. */
  type?: "website" | "article" | "profile";
  /** Keep the page out of the index while allowing link discovery. */
  noindex?: boolean;
  /** Optional keywords (low weight today but harmless). */
  keywords?: string[];
  /** Extra JSON-LD blocks merged on top of the site-wide ones. */
  jsonLd?: Array<Record<string, unknown>>;
};

export type SeoHead = {
  meta: SeoMeta[];
  links: SeoLink[];
};

export const DEFAULT_OG_IMAGE = "/uploads/landres-banner.jpg";

/**
 * Build the meta + link tags for a route. Child routes win over the root route
 * because TanStack dedupes meta entries by `name`/`property` keeping the deepest
 * match.
 */
export function buildSeo({
  lang,
  path = "/",
  title,
  description,
  image = DEFAULT_OG_IMAGE,
  imageAlt = `${SITE_NAME} · Creative Developer & 3D Artist`,
  type = "website",
  noindex = false,
  keywords,
  jsonLd = [],
}: SeoInput): SeoHead {
  const canonical = absoluteUrl(localizedPath(lang, path));
  const imageUrl = absoluteUrl(image);

  const meta: SeoMeta[] = [
    { title },
    { name: "description", content: description },
    {
      name: "robots",
      content: noindex
        ? "noindex, follow, max-image-preview:large"
        : "index, follow, max-image-preview:large",
    },
    { property: "og:type", content: type },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: imageUrl },
    { property: "og:image:alt", content: imageAlt },
    { property: "og:url", content: canonical },
    { property: "og:locale", content: OG_LOCALES[lang] },
    { property: "og:locale:alternate", content: OG_LOCALES[lang === "es" ? "en" : "es"] },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: imageUrl },
    { name: "twitter:image:alt", content: imageAlt },
  ];

  // Declared image size helps social crawlers render the card faster.
  const size = imageSize(image);
  if (size.width && size.height) {
    meta.push({ property: "og:image:width", content: String(size.width) });
    meta.push({ property: "og:image:height", content: String(size.height) });
  }

  if (keywords && keywords.length > 0) {
    meta.push({ name: "keywords", content: keywords.join(", ") });
  }

  for (const block of jsonLd) {
    meta.push(...jsonLdMeta([block]));
  }

  const links: SeoLink[] = [
    { rel: "canonical", href: canonical },
    ...LOCALES.map((locale) => ({
      rel: "alternate",
      hrefLang: locale,
      href: absoluteUrl(localizedPath(locale, path)),
    })),
    {
      rel: "alternate",
      hrefLang: "x-default",
      href: absoluteUrl(localizedPath(DEFAULT_LOCALE, path)),
    },
  ];

  return { meta, links };
}

/**
 * Convert JSON-LD objects into `<script type="application/ld+json">` head meta
 * entries. TanStack Router supports the `{ "script:ld+json": ... }` shape at
 * runtime, but it is not part of React's `<meta>` element type.
 */
export function jsonLdMeta(blocks: Array<Record<string, unknown>>): SeoMeta[] {
  return blocks.map((block) => ({ "script:ld+json": block }) as unknown as SeoMeta);
}

/** Build a `BreadcrumbList` JSON-LD block from ordered crumbs. */
export function breadcrumbJsonLd(
  lang: Locale,
  crumbs: Array<{ name: string; path: string }>,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(localizedPath(lang, crumb.path)),
    })),
  };
}

/**
 * `ItemList` of `Service` entries mirroring the Services section. Gives search
 * engines a machine-readable catalogue of what is offered and by whom.
 */
export function servicesJsonLd(lang: Locale): Record<string, unknown> {
  const services =
    lang === "en"
      ? [
          {
            name: "Web & UI Design",
            description: "Aesthetic, functional interfaces tailored to your brand identity.",
          },
          {
            name: "Web Development",
            description:
              "Fast, secure front-end and back-end development optimised for SEO and conversion.",
          },
          {
            name: "UX Design",
            description:
              "Research, information architecture and user flows optimised for conversion.",
          },
          {
            name: "3D & Motion Graphics",
            description: "3D animation, motion graphics and video post-production.",
          },
        ]
      : [
          {
            name: "Diseño Web y UI",
            description: "Interfaces estéticas y funcionales adaptadas a la identidad de tu marca.",
          },
          {
            name: "Desarrollo Web",
            description:
              "Programación frontend y backend rápida, segura y optimizada para SEO y conversión.",
          },
          {
            name: "Diseño UX",
            description:
              "Investigación, arquitectura de información y flujos de usuario optimizados.",
          },
          {
            name: "3D y Motion Graphics",
            description: "Animación 3D, gráficos en movimiento y postproducción de video.",
          },
        ];

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: lang === "en" ? "Services" : "Servicios",
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.name,
        description: service.description,
        serviceType: service.name,
        areaServed: {
          "@type": "Place",
          name: lang === "en" ? "Worldwide (remote)" : "Todo el mundo (remoto)",
        },
        provider: { "@id": `${SITE_URL}/#person` },
      },
    })),
  };
}

/** Site-wide JSON-LD (Person + WebSite). Emitted once from the root route. */ export function siteJsonLd(): Array<
  Record<string, unknown>
> {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Luis Andrés",
      alternateName: "LANDRES",
      url: SITE_URL,
      jobTitle: "Creative Developer & UI/UX Designer",
      email: "mailto:landres.creative@gmail.com",
      image: absoluteUrl("/uploads/landres-banner.jpg"),
      knowsAbout: [
        "Web Development",
        "React",
        "Next.js",
        "UI/UX Design",
        "3D Modeling",
        "Motion Graphics",
        "DevOps",
      ],
      sameAs: [
        "https://behance.net/luishernandez303",
        "https://instagram.com/landrescreative",
        "https://linkedin.com/in/landrescreative",
        "https://github.com/landrescreative",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: ["es", "en"],
      publisher: { "@id": `${SITE_URL}/#person` },
    },
  ];
}
