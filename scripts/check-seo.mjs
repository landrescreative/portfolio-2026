// Validates public/robots.txt and public/sitemap.xml. Run in CI to catch SEO
// regressions. Run: node scripts/check-seo.mjs
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SITE = "https://www.landrescreative.com";
const errors = [];

const robotsPath = path.join(ROOT, "public", "robots.txt");
const sitemapPath = path.join(ROOT, "public", "sitemap.xml");

if (!fs.existsSync(robotsPath)) errors.push("robots.txt is missing");
else {
  const robots = fs.readFileSync(robotsPath, "utf8");
  if (!robots.includes(`Sitemap: ${SITE}/sitemap.xml`))
    errors.push("robots.txt has no Sitemap directive");
  if (/Disallow:\s*\/\s*$/m.test(robots)) errors.push("robots.txt blocks the whole site");
}

if (!fs.existsSync(sitemapPath)) errors.push("sitemap.xml is missing");
else {
  const xml = fs.readFileSync(sitemapPath, "utf8");
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (locs.length === 0) errors.push("sitemap.xml has no <loc> entries");
  if (locs.some((l) => !l.startsWith(SITE + "/")))
    errors.push("sitemap.xml has a URL outside the production origin");
  if (locs.some((l) => l.includes("/links")))
    errors.push("sitemap.xml must not contain the noindex /links page");
  if (!xml.includes('hreflang="x-default"'))
    errors.push("sitemap.xml is missing x-default hreflang");
  const unique = new Set(locs);
  if (unique.size !== locs.length) errors.push("sitemap.xml has duplicate <loc> entries");
  console.log(`✓ sitemap.xml: ${locs.length} URLs`);
}

if (errors.length) {
  console.error("✗ SEO check failed:");
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log("✓ SEO files valid");
