// Prepare product photos for the web, at build time (see deploy.yml). Two jobs:
//
//   1. Convert HEIC/HEIF (iPhone "High Efficiency" photos) to JPG so they
//      actually display in browsers — most browsers can't show HEIC. Uses
//      `heif-convert` (libheif) because sharp's prebuilt binary can't decode
//      HEIC. The photo path stored in each stick's data is rewritten .heic->.jpg.
//   2. Shrink anything too big (phone photos are often 1-3MB) to a web-friendly
//      size, keeping filenames so stored paths stay valid.
//
// Only touches photos that need it, so re-running is a no-op. Also runnable by
// hand: `node scripts/optimize-images.mjs`.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import sharp from "sharp";

const MEDIA_DIRS = [
  path.join(process.cwd(), "public/products"),
  path.join(process.cwd(), "public/accessories"),
];
const DATA_DIRS = [
  path.join(process.cwd(), "src/data/products"),
  path.join(process.cwd(), "src/data/accessories"),
  path.join(process.cwd(), "src/data/content"),
];
const MAX_WIDTH = 1400;
const MIN_BYTES = 400 * 1024;
const RESIZE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const HEIC_EXTS = new Set([".heic", ".heif"]);

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

let heifOk = true;
try {
  execFileSync("heif-convert", ["--version"], { stdio: "ignore" });
} catch {
  heifOk = false;
}

// --- Phase 1: HEIC/HEIF -> JPG, and rewrite the photo paths that referenced them
const renames = []; // [oldPublicRef, newPublicRef]
for (const file of MEDIA_DIRS.flatMap(walk)) {
  if (!HEIC_EXTS.has(path.extname(file).toLowerCase())) continue;
  const jpg = file.replace(/\.(heic|heif)$/i, ".jpg");
  const oldRef = "/" + path.relative(path.join(process.cwd(), "public"), file).split(path.sep).join("/");
  const newRef = "/" + path.relative(path.join(process.cwd(), "public"), jpg).split(path.sep).join("/");
  if (!heifOk) {
    console.log("WARNING: heif-convert not available — cannot convert", oldRef);
    continue;
  }
  try {
    const tmp = path.join(os.tmpdir(), `heic-${process.pid}-${renames.length}.png`);
    execFileSync("heif-convert", [file, tmp], { stdio: "ignore" });
    const buf = await sharp(tmp)
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toBuffer();
    fs.writeFileSync(jpg, buf);
    fs.rmSync(tmp, { force: true });
    if (jpg !== file) fs.rmSync(file);
    renames.push([oldRef, newRef]);
    console.log(`converted ${oldRef} -> ${newRef} (${Math.round(buf.length / 1024)}KB)`);
  } catch (err) {
    console.log(`WARNING: failed to convert ${oldRef}: ${err.message}`);
  }
}

// Rewrite the .heic paths stored in the stick / content JSON so they point at the JPG.
if (renames.length) {
  for (const dir of DATA_DIRS) {
    for (const file of walk(dir)) {
      if (!file.endsWith(".json")) continue;
      let text = fs.readFileSync(file, "utf8");
      let changed = false;
      for (const [oldRef, newRef] of renames) {
        if (text.includes(oldRef)) {
          text = text.split(oldRef).join(newRef);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(file, text);
        console.log(`updated photo paths in ${path.relative(process.cwd(), file)}`);
      }
    }
  }
}

// --- Phase 2: shrink oversized JPG/PNG/WEBP in place
let optimized = 0;
let untouched = 0;
for (const file of MEDIA_DIRS.flatMap(walk)) {
  if (!RESIZE_EXTS.has(path.extname(file).toLowerCase())) continue;
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
  let pipeline = sharp(file).rotate();
  if (tooWide) pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  if (ext === ".png") pipeline = pipeline.png({ compressionLevel: 9, palette: true });
  else if (ext === ".webp") pipeline = pipeline.webp({ quality: 80 });
  else pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true });
  const buf = await pipeline.toBuffer();
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

console.log(
  `\nImages: ${renames.length} HEIC converted, ${optimized} shrunk, ${untouched} already fine.`
);
