// Deterministic inner-shield fill: define the shield as a path, fill black only
// inside it (and only where currently transparent, so gold/roots are untouched).
import sharp from "sharp";
import path from "node:path";

const QA = path.join(process.env.HOME, "sherred-sticks", "qa");
const SRC = path.join(QA, "logo-cut.png");
const meta = await sharp(SRC).metadata();
const W = meta.width, H = meta.height;

// Inner-shield path in full-image coords (tune to fit the gold outline).
const SHIELD =
  "M1080,205 L1735,205 L1750,545 C1750,770 1615,935 1410,1068 C1205,935 1065,770 1065,545 L1080,205 Z";

// red overlay to check alignment
const overlay = await sharp(SRC)
  .composite([{ input: Buffer.from(`<svg width="${W}" height="${H}"><path d="${SHIELD}" fill="#ff2222" fill-opacity="0.45"/></svg>`), top: 0, left: 0 }])
  .png().toBuffer();

// mask + fill
const maskRaw = await sharp(Buffer.from(`<svg width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="black"/><path d="${SHIELD}" fill="white"/></svg>`))
  .greyscale().raw().toBuffer();
const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const C = info.channels;
let n = 0;
for (let p = 0; p < W * H; p++) {
  if (maskRaw[p] > 128 && data[p * C + 3] < 100) { data[p * C] = 11; data[p * C + 1] = 12; data[p * C + 2] = 10; data[p * C + 3] = 255; n++; }
}
console.log("filled px:", n);
const filled = await sharp(data, { raw: { width: W, height: H, channels: C } }).png().toBuffer();
await sharp(filled).toFile(path.join(QA, "logo-shield-black.png"));

// 3-panel QA using a fixed crest window (consistent coords)
const win = { left: 820, top: 10, width: 1180, height: 1180 };
const ov = await sharp(overlay).extract(win).resize({ height: 360 }).toBuffer();
const fl = await sharp(filled).extract(win).resize({ height: 360 }).toBuffer();
const mm = await sharp(ov).metadata();
const cw = mm.width + 40;
const bg = `<svg width="${cw * 3}" height="400" xmlns="http://www.w3.org/2000/svg"><rect x="0" width="${cw}" height="400" fill="#3e503e"/><rect x="${cw}" width="${cw}" height="400" fill="#3e503e"/><rect x="${cw * 2}" width="${cw}" height="400" fill="#ffffff"/></svg>`;
await sharp(Buffer.from(bg)).composite([
  { input: ov, left: 20, top: 20 },
  { input: fl, left: cw + 20, top: 20 },
  { input: fl, left: cw * 2 + 20, top: 20 },
]).png().toFile(path.join(QA, "shield-poly-qa.png"));
console.log("wrote qa/shield-poly-qa.png (overlay | fill-green | fill-white)");
