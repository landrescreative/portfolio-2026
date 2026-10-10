import { createFileRoute, redirect } from "@tanstack/react-router";
import { DEFAULT_LOCALE } from "@/lib/seo";

/** Legacy URL kept alive: `/projects` → `/es/projects`. */
export const Route = createFileRoute("/projects/")({
  beforeLoad: () => {
    throw redirect({
      to: "/$lang/projects",
      params: { lang: DEFAULT_LOCALE },
      replace: true,
      statusCode: 301,
    });
  },
});
