// Writes src/data/imageSizes.json: { "/uploads/x.webp": { w, h } } for every
// image in /public. Components read it to emit intrinsic width/height and avoid
// layout shift (CLS).
import fs from "node:fs";
import path from "node:path";

// `sharp` is only needed to regenerate the map at build time. If it is missing
// (e.g. a production install without devDependencies) we keep the committed
// imageSizes.json instead of failing the whole build.
let sharp = null;
try {
  ({ default: sharp } = await import("sharp"));
} catch {
  console.warn("generate-image-sizes: 'sharp' unavailable, keeping committed imageSizes.json");
  process.exit(0);
}

const PUB = path.join(process.cwd(), "public");
const OUT = path.join(process.cwd(), "src", "data", "imageSizes.json");
const EXTS = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg"]);

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (EXTS.has(path.extname(p).toLowerCase())) out.push(p);
  }
  return out;
}

const map = {};
for (const abs of walk(PUB)) {
  const rel = "/" + path.relative(PUB, abs).split(path.sep).join("/");
  try {
    const meta = await sharp(abs, { failOn: "none" }).metadata();
    if (meta.width && meta.height) map[rel] = { w: meta.width, h: meta.height };
  } catch {
    /* ignore unreadable files */
  }
}

const sorted = Object.fromEntries(
  Object.keys(map)
    .sort()
    .map((k) => [k, map[k]]),
);
fs.writeFileSync(OUT, JSON.stringify(sorted, null, 0) + "\n", "utf8");
console.log(`imageSizes.json written: ${Object.keys(sorted).length} entries`);
