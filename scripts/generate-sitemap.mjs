// Generates public/sitemap.xml from the routes and the project data.
// Run with: node scripts/generate-sitemap.mjs
import fs from "node:fs";
import path from "node:path";

const SITE_URL = "https://www.landrescreative.com";
const LOCALES = ["es", "en"];
const X_DEFAULT = "es";

const root = process.cwd();

try {
  const dataFile = path.join(root, "src", "data", "projectsData.ts");
  const source = fs.readFileSync(dataFile, "utf8");

  // Project ids are the keys of the `projectsData` object, quoted or not
  // (`"next-era": {` / `vivavia: {`). Restrict the scan to the object body so the
  // `ProjectDetail` interface fields aren't picked up.
  const body = source.slice(source.indexOf("export const projectsData"));
  const ids = [...body.matchAll(/^ {2}"?([a-z0-9-]+)"?: \{/gm)].map((m) => m[1]);

  const paths = [
    "/",
    "/about",
    "/contact",
    "/design",
    "/web",
    "/projects",
    ...ids.map((id) => `/projects/${id}`),
  ];

  const localized = (lang, p) => `${SITE_URL}/${lang}${p === "/" ? "" : p}`;

  // Build date: refreshed on every prebuild. Good enough for a portfolio whose
  // content changes are deploy-driven.
  const lastmod = new Date().toISOString().split("T")[0];

  const entries = paths
    .map((p) => {
      const alternates = [
        ...LOCALES.map(
          (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${localized(l, p)}" />`,
        ),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${localized(X_DEFAULT, p)}" />`,
      ].join("\n");

      return LOCALES.map(
        (l) =>
          `  <url>\n    <loc>${localized(l, p)}</loc>\n    <lastmod>${lastmod}</lastmod>\n${alternates}\n  </url>`,
      ).join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries}
</urlset>
`;
  fs.writeFileSync(path.join(root, "public", "sitemap.xml"), xml, "utf8");
  console.log(
    `sitemap.xml written: ${paths.length * LOCALES.length} URLs (${ids.length} projects, ${paths.length} paths)`,
  );
} catch (err) {
  // Keep the committed sitemap.xml instead of failing the build.
  console.warn("generate-sitemap: skipped, keeping committed sitemap.xml:", err?.message ?? err);
}
