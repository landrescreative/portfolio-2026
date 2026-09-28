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
import { Navbar } from "../components/Navbar";
import { PageTransition } from "../components/PageTransition";
import { CustomCursor } from "../components/CustomCursor";
import { ScrollProgress } from "../components/ScrollProgress";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-6 text-ink">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-8xl font-bold tracking-tight text-accent">404</h1>
        <h2 className="mt-4 font-serif text-3xl font-semibold">Página no encontrada / Page not found</h2>
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

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
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
      { title: "Luis Andrés — Creative Developer & UI/UX Designer" },
      {
        name: "description",
        content:
          "Portfolio of Luis Andrés, Creative Developer and UI/UX Designer specializing in React, Next.js, Webflow, Astro and DevOps Linux.",
      },
      { property: "og:title", content: "Luis Andrés (LANDRES) — Creative Developer & 3D Artist" },
      {
        property: "og:description",
        content:
          "Portfolio of Luis Andrés, Creative Developer and 3D Animator specializing in Web Development, Motion Graphics and Interactive Experiences.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/uploads/landres-banner.jpg" },
      { property: "og:image:width", content: "1920" },
      { property: "og:image:height", content: "1080" },
      { property: "og:image:alt", content: "LANDRES — Creative Direction & Digital Portfolio" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Luis Andrés (LANDRES) — Creative Developer & 3D Artist" },
      {
        name: "twitter:description",
        content:
          "Portfolio of Luis Andrés, Creative Developer and 3D Animator specializing in Web Development, Motion Graphics and Interactive Experiences.",
      },
      { name: "twitter:image", content: "/uploads/landres-banner.jpg" },
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
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
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

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <ScrollProgress />
        <CustomCursor />
        <PageTransition>
          <Navbar />
          {/* Required: nested routes render here with page transition animations */}
          <AnimatedOutlet />
        </PageTransition>
      </I18nProvider>
    </QueryClientProvider>
  );
}

// stack context fix