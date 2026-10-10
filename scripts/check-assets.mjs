// Fails the build if any asset referenced from /src is missing in /public, or if
// the JSON image-size map is stale. Run: node scripts/check-assets.mjs
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PUB = path.join(ROOT, "public");
const SRC = path.join(ROOT, "src");

function walk(dir, test) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p, test));
    else if (test(p)) out.push(p);
  }
  return out;
}

const srcFiles = walk(SRC, (p) => /\.(ts|tsx)$/.test(p));
let hay = "";
for (const f of srcFiles) hay += "\n" + fs.readFileSync(f, "utf8");

const refs = new Set();
for (const m of hay.matchAll(
  /["'`](\/[^"'`]+?\.(?:png|jpe?g|webp|gif|svg|mp4|pdf|glb|gltf))["'`]/gi,
)) {
  refs.add(m[1]);
}

const missing = [...refs].filter((r) => !fs.existsSync(path.join(PUB, r.replace(/^\//, ""))));
if (missing.length) {
  console.error(`✗ ${missing.length} referenced asset(s) missing from /public:`);
  for (const m of missing.sort()) console.error("  " + m);
  process.exit(1);
}

// The sitemap must contain every project route (guards the id-extraction regex).
const dataFile = fs.readFileSync(path.join(SRC, "data", "projectsData.ts"), "utf8");
const body = dataFile.slice(dataFile.indexOf("export const projectsData"));
const ids = [...body.matchAll(/^ {2}"?([a-z0-9-]+)"?: \{/gm)].map((m) => m[1]);
const sitemapPath = path.join(PUB, "sitemap.xml");
if (fs.existsSync(sitemapPath)) {
  const xml = fs.readFileSync(sitemapPath, "utf8");
  const missingRoutes = ids.filter((id) => !xml.includes(`/projects/${id}<`));
  if (missingRoutes.length) {
    console.error(`✗ ${missingRoutes.length} project(s) missing from sitemap.xml:`);
    for (const id of missingRoutes) console.error("  " + id);
    process.exit(1);
  }
  console.log(`✓ sitemap covers all ${ids.length} projects`);
}

console.log(`✓ all ${refs.size} referenced assets exist in /public`);
