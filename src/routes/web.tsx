import { createFileRoute, redirect } from "@tanstack/react-router";
import { DEFAULT_LOCALE } from "@/lib/seo";

/** Legacy URL kept alive: `/web` → `/es/web`. */
export const Route = createFileRoute("/web")({
  beforeLoad: () => {
    throw redirect({
      to: "/$lang/web",
      params: { lang: DEFAULT_LOCALE },
      replace: true,
      statusCode: 301,
    });
  },
});
