// Build a labelled contact sheet of one representative photo per stick,
// so we can categorise/name all 17 from a single view.
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.env.HOME, "Desktop", "S&S Walking Sticks");
const sticks = [];
for (let i = 1; i <= 17; i++) {
  const dir = path.join(ROOT, `Stick ${i}`);
  const files = fs
    .readdirSync(dir)
    .filter((f) => /\.(jpe?g)$/i.test(f))
    .sort();
  sticks.push({ i, dir, files, pick: files[0] });
}

const COLS = 6;
const TW = 300;
const TH = 356;
const LBL = 26;
const GAP = 10;
const rows = Math.ceil(sticks.length / COLS);
const cellH = TH + LBL;
const W = COLS * TW + (COLS + 1) * GAP;
const H = rows * cellH + (rows + 1) * GAP;

const composites = [];
const labels = [];
for (let idx = 0; idx < sticks.length; idx++) {
  const s = sticks[idx];
  const col = idx % COLS;
  const row = Math.floor(idx / COLS);
  const x = GAP + col * (TW + GAP);
  const y = GAP + row * (cellH + GAP);
  const thumb = await sharp(path.join(s.dir, s.pick))
    .rotate()
    .resize(TW, TH, { fit: "contain", background: { r: 12, g: 13, b: 10 } })
    .toBuffer();
  composites.push({ input: thumb, top: y, left: x });
  labels.push(
    `<text x="${x + TW / 2}" y="${y + TH + 18}" fill="#c9a24b" font-size="18" font-family="serif" text-anchor="middle">Stick ${s.i}</text>`
  );
}
composites.push({
  input: Buffer.from(`<svg width="${W}" height="${H}">${labels.join("")}</svg>`),
  top: 0,
  left: 0,
});

await sharp({
  create: { width: W, height: H, channels: 3, background: { r: 8, g: 9, b: 7 } },
})
  .composite(composites)
  .png()
  .toFile(path.join(process.env.HOME, "sherred-sticks", "qa", "contact.png"));

console.log("photo counts:", sticks.map((s) => `S${s.i}=${s.files.length}`).join("  "));
console.log(`wrote qa/contact.png ${W}x${H}`);
