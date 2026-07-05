// Shrink oversized product photos to a sensible web size.
//
// The owner uploads photos straight from a phone (often 1–3 MB, 3000px+ wide).
// This resizes anything too big down to a web-friendly width and re-encodes it,
// so the site stays fast and the repo doesn't bloat. Filenames are kept exactly,
// so the paths stored in each stick's data still point at the right image.
//
// Runs on every deploy (see .github/workflows/deploy.yml) AND can be run by hand:
//   node scripts/optimize-images.mjs
// It only touches photos that are actually too big, so re-running is a no-op.

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const DIR = path.join(process.cwd(), "public/products");
const MAX_WIDTH = 1400; // plenty for a product photo, even on retina screens
const MIN_BYTES = 400 * 1024; // leave anything already <400KB alone
const EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else if (EXTS.has(path.extname(entry.name).toLowerCase())) out.push(p);
  }
  return out;
}

let optimized = 0;
let untouched = 0;

for (const file of walk(DIR)) {
  const before = fs.statSync(file).size;
  const meta = await sharp(file).metadata().catch(() => null);
  if (!meta) {
    console.log("skip (could not read):", path.relative(process.cwd(), file));
    continue;
  }

  const tooWide = (meta.width ?? 0) > MAX_WIDTH;
  const tooBig = before > MIN_BYTES;
  if (!tooWide && !tooBig) {
    untouched++;
    continue;
  }

  const ext = path.extname(file).toLowerCase();
  let pipeline = sharp(file).rotate(); // bake in EXIF orientation, then drop metadata
  if (tooWide) pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  if (ext === ".png") pipeline = pipeline.png({ compressionLevel: 9, palette: true });
  else if (ext === ".webp") pipeline = pipeline.webp({ quality: 80 });
  else pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true });

  const buf = await pipeline.toBuffer();
  // Only overwrite if we actually made it smaller (keeps re-runs a no-op).
  if (buf.length < before) {
    fs.writeFileSync(file, buf);
    console.log(
      `optimized ${path.relative(process.cwd(), file)}: ` +
        `${Math.round(before / 1024)}KB -> ${Math.round(buf.length / 1024)}KB`
    );
    optimized++;
  } else {
    untouched++;
  }
}

console.log(`\nImages: ${optimized} optimized, ${untouched} already fine.`);
