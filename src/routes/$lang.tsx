import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import type { Locale } from "@/lib/seo";
import { isLocale } from "@/lib/seo";

/**
 * Locale layout. Every page lives under `/$lang` so each language has its own
 * crawlable URL, and `hreflang` alternates can be emitted per page.
 */
export const Route = createFileRoute("/$lang")({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.lang)) {
      throw notFound();
    }
    return { lang: params.lang as Locale };
  },
  component: LocaleLayout,
});

function LocaleLayout() {
  return <Outlet />;
}
