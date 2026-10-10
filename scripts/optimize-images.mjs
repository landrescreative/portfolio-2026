// One-off asset optimiser.
//  - converts every *used* raster image in /public to WebP (max 2400px)
//  - emits a lightweight JPEG sibling for cover images (used as og:image)
//  - moves the original masters + unused assets to /_source-images (gitignored)
//  - rewrites the references inside /src from .png/.jpg/.jpeg -> .webp
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

// libvips keeps an internal cache of opened files which, on Windows, holds
// handles that block moving/deleting the source right after reading it.
sharp.cache(false);

const ROOT = process.cwd();
const PUB = path.join(ROOT, "public");
const ARCHIVE = path.join(ROOT, "_source-images");
const SRC = path.join(ROOT, "src");

const RASTER = new Set([".png", ".jpg", ".jpeg", ".webp"]);
// Kept untouched (favicon) or kept as JPEG on purpose (site-wide og:image).
const KEEP = new Set(["/favicon.png"]);

function walk(dir, test) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p, test));
    else if (test(p)) out.push(p);
  }
  return out;
}
const rel = (abs) => "/" + path.relative(PUB, abs).split(path.sep).join("/");
const mkdirp = (p) => fs.mkdirSync(path.dirname(p), { recursive: true });

// Windows-friendly move: copy then remove, retrying transient locks (e.g. file
// watchers) instead of failing the whole run on a single EBUSY.
function archiveOut(abs, r) {
  const dest = path.join(ARCHIVE, r);
  mkdirp(dest);
  fs.copyFileSync(abs, dest);
  fs.rmSync(abs, { force: true, maxRetries: 20, retryDelay: 150 });
}

// ---- collect referenced asset paths from src ----
const srcFiles = walk(SRC, (p) => /\.(ts|tsx)$/.test(p));
let hay = "";
for (const f of srcFiles) hay += "\n" + fs.readFileSync(f, "utf8");
const refs = new Set();
for (const m of hay.matchAll(
  /["'`](\/[^"'`]+?\.(?:png|jpe?g|webp|gif|svg|mp4|pdf|glb|gltf))["'`]/gi,
)) {
  refs.add(m[1]);
}

// ---- cover images (become og:image) ----
const dataFile = fs.readFileSync(path.join(SRC, "data", "projectsData.ts"), "utf8");
const covers = new Set([...dataFile.matchAll(/coverImage:\s*"([^"]+)"/g)].map((m) => m[1]));
// Site-wide social card (kept as a JPEG on purpose).
const EXTRA_OG = ["/uploads/landres-banner.jpg"];

const assets = walk(PUB, (p) => RASTER.has(path.extname(p).toLowerCase()));

const mapping = new Map(); // oldPath -> newWebpPath
const ogJobs = [];
let moved = 0;
let movedBytes = 0;
const report = [];

for (const abs of assets) {
  const r = rel(abs);
  if (KEEP.has(r)) continue;

  const size = fs.statSync(abs).size;

  if (!refs.has(r)) {
    // unused -> archive only
    archiveOut(abs, r);
    moved++;
    movedBytes += size;
    report.push(["ARCHIVE", r, size]);
    continue;
  }

  const ext = path.extname(r).toLowerCase();
  const base = r.slice(0, -ext.length);
  const webpRel = base + ".webp";
  const outAbs = path.join(PUB, webpRel.replace(/^\//, ""));
  mkdirp(outAbs);

  // Cap on width only: ultra-tall full-page screenshots keep their native
  // width. A square fit box would shrink their width far below the rendered
  // size (e.g. a 1400x4354 master became 772x2400) and look pixelated.
  const buf = await sharp(abs, { failOn: "none" })
    .rotate()
    .resize({ width: 2400, withoutEnlargement: true })
    .webp({ quality: 80, effort: 5 })
    .toBuffer();

  if (base + ext !== webpRel) mapping.set(r, webpRel);

  // move the master out before writing new files into public/
  archiveOut(abs, r);
  moved++;
  movedBytes += size;

  fs.writeFileSync(outAbs, buf);
  report.push(["WEBP", `${r} -> ${webpRel}`, size, buf.length]);
}

for (const r of [...covers, ...EXTRA_OG]) {
  const ext = path.extname(r).toLowerCase();
  if (![".png", ".jpg", ".jpeg", ".webp", ".svg"].includes(ext)) continue;
  const base = r.slice(0, -ext.length);
  const ogRel = base + ".jpg";
  const archivedAbs = path.join(ARCHIVE, r.replace(/^\//, ""));
  const liveAbs = path.join(PUB, r.replace(/^\//, ""));
  const srcAbs = fs.existsSync(archivedAbs) ? archivedAbs : liveAbs;
  if (!fs.existsSync(srcAbs)) continue;
  const outAbs = path.join(PUB, ogRel.replace(/^\//, ""));
  mkdirp(outAbs);
  const buf = await sharp(srcAbs, { failOn: "none" })
    .rotate()
    .resize({ width: 1200, height: 630, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 80, progressive: true, mozjpeg: true })
    .toBuffer();
  fs.writeFileSync(outAbs, buf);
  ogJobs.push(`${ogRel} (${(buf.length / 1024).toFixed(0)} KB)`);
}

// ---- rewrite references in src ----
let rewrote = 0;
const changedFiles = [];
for (const f of srcFiles) {
  let c = fs.readFileSync(f, "utf8");
  const before = c;
  for (const [oldPath, newPath] of mapping) {
    const needle = `"${oldPath}"`;
    if (c.includes(needle)) {
      c = c.split(needle).join(`"${newPath}"`);
      rewrote++;
    }
  }
  if (c !== before) {
    fs.writeFileSync(f, c, "utf8");
    changedFiles.push(path.relative(ROOT, f));
  }
}

const kb = (n) => (n / 1024).toFixed(1).padStart(9);
console.log("=== WEBP conversions ===");
report
  .filter((x) => x[0] === "WEBP")
  .sort((a, b) => b[2] - a[2])
  .forEach((x) => console.log(`${kb(x[2])} KB -> ${kb(x[3])} KB  ${x[1]}`));
console.log(`\nconverted: ${report.filter((x) => x[0] === "WEBP").length}`);
console.log(
  `archived (masters + unused): ${moved} files, ${(movedBytes / 1048576).toFixed(1)} MB moved out of /public`,
);
console.log(`og jpg siblings: ${ogJobs.length}`);
console.log(`src refs rewritten: ${rewrote} across ${changedFiles.length} files`);
console.log(changedFiles.join("\n"));
fs.writeFileSync(path.join(ROOT, "scripts", "_og-list.txt"), ogJobs.join("\n"), "utf8");
