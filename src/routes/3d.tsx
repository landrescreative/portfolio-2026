import { createFileRoute, redirect } from "@tanstack/react-router";
import { DEFAULT_LOCALE } from "@/lib/seo";

/** Direct URL kept alive: `/3d` → `/{lang}/3d`. */
export const Route = createFileRoute("/3d")({
  beforeLoad: () => {
    throw redirect({
      to: "/$lang/3d",
      params: { lang: DEFAULT_LOCALE },
      replace: true,
      statusCode: 301,
    });
  },
});
