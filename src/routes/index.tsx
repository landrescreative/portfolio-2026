import { createFileRoute, redirect } from "@tanstack/react-router";
import { detectPreferredLocale } from "@/lib/seo";

/**
 * The site lives under `/$lang`. The bare root negotiates the language from the
 * visitor's browser (`Accept-Language` on the server, `navigator.language` on
 * the client, or a previously saved choice) and redirects to it.
 *
 * A 302 + `Vary: Accept-Language` keeps the redirect from being cached as a
 * permanent mapping, since the destination depends on the visitor.
 */
export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const lang = await detectPreferredLocale();
    throw redirect({
      to: "/$lang",
      params: { lang },
      replace: true,
      statusCode: 302,
      headers: {
        Vary: "Accept-Language",
        "Cache-Control": "private, no-store",
      },
    });
  },
});
