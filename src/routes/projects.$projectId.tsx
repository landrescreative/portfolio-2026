import { createFileRoute, redirect } from "@tanstack/react-router";
import { DEFAULT_LOCALE } from "@/lib/seo";

/** Legacy URL kept alive: `/projects/:id` → `/es/projects/:id`. */
export const Route = createFileRoute("/projects/$projectId")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/$lang/projects/$projectId",
      params: { lang: DEFAULT_LOCALE, projectId: params.projectId },
      replace: true,
      statusCode: 301,
    });
  },
});
