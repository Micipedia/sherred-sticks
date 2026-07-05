// Optimise Steve's stick photos into the site's public/products/ folder.
// Up to 5 photos per stick, auto-oriented, resized, mozjpeg-compressed.
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const SRC = path.join(process.env.HOME, "Desktop", "S&S Walking Sticks");
const PROJ = path.join(process.env.HOME, "sherred-sticks");
const OUT = path.join(PROJ, "public", "products");
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const MAX_PER = 5;
const manifest = [];
for (let i = 1; i <= 17; i++) {
  const dir = path.join(SRC, `Stick ${i}`);
  const files = fs
    .readdirSync(dir)
    .filter((f) => /\.(jpe?g)$/i.test(f))
    .sort()
    .slice(0, MAX_PER);
  const slug = `stick-${i}`;
  const outDir = path.join(OUT, slug);
  fs.mkdirSync(outDir, { recursive: true });
  for (let j = 0; j < files.length; j++) {
    const name = String(j + 1).padStart(2, "0") + ".jpg";
    await sharp(path.join(dir, files[j]))
      .rotate()
      .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(path.join(outDir, name));
  }
  manifest.push({ slug, photos: files.length });
}
fs.writeFileSync(
  path.join(PROJ, "qa", "photos-manifest.json"),
  JSON.stringify(manifest, null, 2)
);
console.log("counts:", manifest.map((m) => `${m.slug}=${m.photos}`).join(" "));
console.log("total images:", manifest.reduce((n, m) => n + m.photos, 0));
