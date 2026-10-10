import { createFileRoute, redirect } from "@tanstack/react-router";
import { DEFAULT_LOCALE } from "@/lib/seo";

/** Legacy link-in-bio URL kept alive: `/links` → `/es/links`. */
export const Route = createFileRoute("/links")({
  beforeLoad: () => {
    throw redirect({
      to: "/$lang/links",
      params: { lang: DEFAULT_LOCALE },
      replace: true,
      statusCode: 301,
    });
  },
});
