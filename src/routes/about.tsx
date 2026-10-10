import { createFileRoute, redirect } from "@tanstack/react-router";
import { DEFAULT_LOCALE } from "@/lib/seo";

/** Legacy URL kept alive: `/about` → `/es/about`. */
export const Route = createFileRoute("/about")({
  beforeLoad: () => {
    throw redirect({
      to: "/$lang/about",
      params: { lang: DEFAULT_LOCALE },
      replace: true,
      statusCode: 301,
    });
  },
});
