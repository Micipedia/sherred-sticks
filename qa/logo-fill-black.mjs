// Paint the shield INTERIOR opaque black (behind the gold), keeping the outer
// area transparent. The interior is currently transparent and leaks to the
// outside via gaps between the roots, so a plain flood would escape — we seed
// from inside the shield and cap the flood to the shield's bounding box, with
// the gold/roots artwork (alpha>100) acting as walls.
import sharp from "sharp";
import path from "node:path";

const QA = path.join(process.env.HOME, "sherred-sticks", "qa");
const SRC = path.join(QA, "logo-cut.png"); // transparent logo (green already removed)

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height, C = info.channels;
const isWall = (p) => data[p * C + 3] > 100; // gold / roots / text

// Bounding cap (safety) and inner seed region, tuned to the centred crest.
const BOX = { x0: 950, x1: 1870, y0: 70, y1: 1190 };
const SEED = { x0: 1150, x1: 1670, y0: 160, y1: 1000 };

const fill = new Uint8Array(W * H);
const stack = [];
for (let y = SEED.y0; y <= SEED.y1; y++)
  for (let x = SEED.x0; x <= SEED.x1; x++) {
    const p = y * W + x;
    if (!isWall(p)) stack.push(p);
  }
while (stack.length) {
  const p = stack.pop();
  if (fill[p]) continue;
  const x = p % W, y = (p - x) / W;
  if (x < BOX.x0 || x > BOX.x1 || y < BOX.y0 || y > BOX.y1) continue;
  if (isWall(p)) continue;
  fill[p] = 1;
  stack.push(p + 1, p - 1, p + W, p - W);
}
let n = 0;
for (let p = 0; p < W * H; p++) {
  if (fill[p]) { data[p * C] = 11; data[p * C + 1] = 12; data[p * C + 2] = 10; data[p * C + 3] = 255; n++; }
}
console.log("filled px:", n);

await sharp(data, { raw: { width: W, height: H, channels: C } }).png().toFile(path.join(QA, "logo-black-filled.png"));

// QA: crest on green vs dark
const top = await sharp(path.join(QA, "logo-black-filled.png")).extract({ left: 0, top: 0, width: W, height: 1167 }).png().toBuffer();
const crest = await sharp(top).trim().resize({ height: 200 }).png().toBuffer();
const cm = await sharp(crest).metadata();
const colW = cm.width + 80;
const svg = `<svg width="${colW * 2}" height="260" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="${colW}" height="260" fill="#3e503e"/><rect x="${colW}" y="0" width="${colW}" height="260" fill="#101109"/></svg>`;
await sharp(Buffer.from(svg)).composite([
  { input: crest, left: 40, top: 30 },
  { input: crest, left: colW + 40, top: 30 },
]).png().toFile(path.join(QA, "fill-qa.png"));
console.log("wrote qa/fill-qa.png (left=green header, right=dark footer)");
