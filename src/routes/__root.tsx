import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource/work-sans/300.css";
import "@fontsource/work-sans/400.css";
import "@fontsource/work-sans/500.css";
import "@fontsource/work-sans/600.css";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { I18nProvider } from "../lib/i18n";
import { absoluteUrl, jsonLdMeta, localeFromPathname, siteJsonLd, SITE_NAME } from "../lib/seo";
import { Navbar } from "../components/Navbar";
import { PageTransition } from "../components/PageTransition";
import { Preloader } from "../components/Preloader";
import { CustomCursor } from "../components/CustomCursor";
import { ScrollProgress } from "../components/ScrollProgress";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-6 text-ink">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-8xl font-bold tracking-tight text-accent">404</h1>
        <h2 className="mt-4 font-serif text-3xl font-semibold">
          Página no encontrada / Page not found
        </h2>
        <p className="mt-3 text-sm text-muted leading-relaxed">
          La página que buscas no existe o ha sido movida.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-ink px-7 py-3 text-xs font-semibold uppercase tracking-wider text-canvas shadow-lg transition-transform hover:scale-105"
          >
            <span className="absolute inset-0 translate-y-full bg-accent transition-transform duration-300 ease-out group-hover:translate-y-0" />
            <span className="relative">Volver al Inicio / Go Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-6 text-ink">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-3xl font-semibold tracking-tight">
          Algo no salió como esperábamos
        </h1>
        <p className="mt-3 text-sm text-muted leading-relaxed">
          Hubo un inconveniente al cargar esta sección. Puedes intentar recargar o volver al inicio.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-accent px-6 py-3 text-xs font-semibold uppercase tracking-wider text-canvas shadow-lg transition-transform hover:scale-105"
          >
            <span>Reintentar / Try Again</span>
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-ink/20 bg-surface px-6 py-3 text-xs font-semibold uppercase tracking-wider text-ink transition-colors hover:border-accent hover:text-accent"
          >
            Volver al Inicio
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#141414" },
      // Fallbacks: every page overrides these through `buildSeo()`.
      { title: `${SITE_NAME} · Creative Developer & UI/UX Designer` },
      {
        name: "description",
        content:
          "Portfolio of Luis Andrés, Creative Developer and UI/UX Designer specializing in React, Next.js, Webflow, Astro and DevOps Linux.",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:title", content: "Luis Andrés (LANDRES) · Creative Developer & 3D Artist" },
      {
        property: "og:description",
        content:
          "Portfolio of Luis Andrés, Creative Developer and 3D Animator specializing in Web Development, Motion Graphics and Interactive Experiences.",
      },
      { property: "og:image", content: absoluteUrl("/uploads/landres-banner.jpg") },
      { property: "og:image:alt", content: "LANDRES · Creative Direction & Digital Portfolio" },
      { property: "og:locale", content: "es_MX" },
      { property: "og:locale:alternate", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Luis Andrés (LANDRES) · Creative Developer & 3D Artist" },
      {
        name: "twitter:description",
        content:
          "Portfolio of Luis Andrés, Creative Developer and 3D Animator specializing in Web Development, Motion Graphics and Interactive Experiences.",
      },
      { name: "twitter:image", content: absoluteUrl("/uploads/landres-banner.jpg") },
      ...jsonLdMeta(siteJsonLd()),
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "shortcut icon", href: "/favicon.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
    ],
    // Vercel Web Analytics + Speed Insights (privacy-friendly, no cookies).
    // Enable both in the Vercel dashboard (Project · Analytics / Speed Insights);
    // until then these paths 404 harmlessly.
    scripts: [
      { src: "/_vercel/insights/script.js", defer: true },
      { src: "/_vercel/speed-insights/script.js", defer: true },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const lang = localeFromPathname(pathname);

  return (
    <html lang={lang}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function AnimatedOutlet() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  return (
    <div key={pathname} className="animate-page-reveal relative z-10">
      <Outlet />
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const lang = localeFromPathname(pathname);
  // The link-in-bio page is a self-contained landing: it renders its own
  // minimal top bar, so the site navigation must not show up there.
  const isLinkBio = pathname.replace(/\/+$/, "").endsWith("/links");

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider initialLanguage={lang}>
        <ScrollProgress />
        <CustomCursor />
        <Preloader />
        <PageTransition>
          {!isLinkBio && <Navbar />}
          {/* Required: nested routes render here with page transition animations */}
          <AnimatedOutlet />
        </PageTransition>
      </I18nProvider>
    </QueryClientProvider>
  );
}

// stack context fix
