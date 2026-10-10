import { createFileRoute, redirect } from "@tanstack/react-router";
import { DEFAULT_LOCALE } from "@/lib/seo";

/** Legacy URL kept alive: `/design` → `/es/design`. */
export const Route = createFileRoute("/design")({
  beforeLoad: () => {
    throw redirect({
      to: "/$lang/design",
      params: { lang: DEFAULT_LOCALE },
      replace: true,
      statusCode: 301,
    });
  },
});
