// Fill ONLY the inner shield field black (not the whole outer knotwork frame).
// Seed tightly inside the inner shield, treat gold+roots as walls, and dilate
// those walls to close small gaps so the fill can't leak into the outer frame.
import sharp from "sharp";
import path from "node:path";

const QA = path.join(process.env.HOME, "sherred-sticks", "qa");
const SRC = path.join(QA, "logo-cut.png");
const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height, C = info.channels;

// artwork (gold + roots) mask, then dilate to close gaps
const mask = Buffer.alloc(W * H);
for (let p = 0; p < W * H; p++) mask[p] = data[p * C + 3] > 100 ? 255 : 0;
const blurred = await sharp(mask, { raw: { width: W, height: H, channels: 1 } }).blur(1.5).raw().toBuffer();
const wall = new Uint8Array(W * H);
for (let p = 0; p < W * H; p++) wall[p] = blurred[p] > 70 ? 1 : 0;

// wide seeds across the whole inner field, capped to the inner shield box (bottom
// kept above the roots so the fill can't leak out through the root opening)
const SEED = { x0: 1100, x1: 1720, y0: 200, y1: 1000 };
const BOX = { x0: 1030, x1: 1795, y0: 165, y1: 1090 };
const fill = new Uint8Array(W * H);
const stack = [];
for (let y = SEED.y0; y <= SEED.y1; y++)
  for (let x = SEED.x0; x <= SEED.x1; x++) { const p = y * W + x; if (!wall[p]) stack.push(p); }
while (stack.length) {
  const p = stack.pop();
  if (fill[p]) continue;
  const x = p % W, y = (p - x) / W;
  if (x < BOX.x0 || x > BOX.x1 || y < BOX.y0 || y > BOX.y1) continue;
  if (wall[p]) continue;
  fill[p] = 1;
  stack.push(p + 1, p - 1, p + W, p - W);
}

// grow the fill back up to the gold edge (dilation ate ~a few px), original-transparent only
const fmask = Buffer.alloc(W * H);
for (let p = 0; p < W * H; p++) fmask[p] = fill[p] ? 255 : 0;
const fblur = await sharp(fmask, { raw: { width: W, height: H, channels: 1 } }).blur(4).raw().toBuffer();
let n = 0;
for (let p = 0; p < W * H; p++) {
  if (fblur[p] > 10 && data[p * C + 3] < 100) { data[p * C] = 11; data[p * C + 1] = 12; data[p * C + 2] = 10; data[p * C + 3] = 255; n++; }
}
console.log("filled px:", n);
await sharp(data, { raw: { width: W, height: H, channels: C } }).png().toFile(path.join(QA, "logo-shield-black.png"));

// QA render: crest on green + white
const top = await sharp(path.join(QA, "logo-shield-black.png")).extract({ left: 0, top: 0, width: W, height: 1167 }).png().toBuffer();
const crest = await sharp(top).trim().resize({ height: 400 }).png().toBuffer();
const m = await sharp(crest).metadata();
const cw = m.width + 60;
const svg = '<svg width="' + (cw * 2) + '" height="440" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="' + cw + '" height="440" fill="#3e503e"/><rect x="' + cw + '" y="0" width="' + cw + '" height="440" fill="#ffffff"/></svg>';
await sharp(Buffer.from(svg)).composite([{ input: crest, left: 30, top: 20 }, { input: crest, left: cw + 30, top: 20 }]).png().toFile(path.join(QA, "shield-fill-qa.png"));
console.log("wrote qa/shield-fill-qa.png");
