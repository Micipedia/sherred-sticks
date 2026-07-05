// Remove the logo's green card background via an edge flood-fill.
// Flood-fill (not global chroma-key) so the green INSIDE the shield is kept —
// only the contiguous background reachable from the border is made transparent.
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const SRC = path.join(process.env.HOME, "Downloads", "Sherred and Sons.png");
const QA = path.join(process.env.HOME, "sherred-sticks", "qa");

const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const W = info.width;
const H = info.height;
const C = info.channels; // 4

// Is this pixel part of the greenish background (textured + vignetted),
// and NOT the gold crest / brown roots / gold text?
function isBg(r, g, b) {
  return g - r > 6 && g - b > 6 && r + g + b < 360;
}

const bg = new Uint8Array(W * H);
const stack = [];
for (let x = 0; x < W; x++) {
  stack.push(x, x + (H - 1) * W);
}
for (let y = 0; y < H; y++) {
  stack.push(y * W, W - 1 + y * W);
}
while (stack.length) {
  const p = stack.pop();
  if (p < 0 || p >= W * H || bg[p]) continue;
  const i = p * C;
  if (!isBg(data[i], data[i + 1], data[i + 2])) continue;
  bg[p] = 1;
  const x = p % W;
  if (x + 1 < W) stack.push(p + 1);
  if (x - 1 >= 0) stack.push(p - 1);
  stack.push(p + W, p - W);
}

// Also clear small ENCLOSED green pockets (letter counters, specks) that the
// border flood can't reach — but keep large green areas (the shield field).
const seen = new Uint8Array(W * H);
for (let start = 0; start < W * H; start++) {
  if (bg[start] || seen[start]) continue;
  const i0 = start * C;
  if (!isBg(data[i0], data[i0 + 1], data[i0 + 2])) {
    seen[start] = 1;
    continue;
  }
  // BFS this enclosed green region
  const region = [];
  const q = [start];
  seen[start] = 1;
  while (q.length) {
    const p = q.pop();
    region.push(p);
    const x = p % W;
    const nb = [p + W, p - W];
    if (x + 1 < W) nb.push(p + 1);
    if (x - 1 >= 0) nb.push(p - 1);
    for (const n of nb) {
      if (n < 0 || n >= W * H || seen[n] || bg[n]) continue;
      const j = n * C;
      if (isBg(data[j], data[j + 1], data[j + 2])) {
        seen[n] = 1;
        q.push(n);
      }
    }
  }
  if (region.length < 9000) {
    for (const p of region) bg[p] = 1; // small pocket → clear it
  }
}

for (let p = 0; p < W * H; p++) if (bg[p]) data[p * C + 3] = 0;

await sharp(data, { raw: { width: W, height: H, channels: C } })
  .png()
  .toFile(path.join(QA, "logo-cut.png"));

// ---- QA sheet: the cut logo over checkerboard / header-green / dark ----
const logo = await sharp(path.join(QA, "logo-cut.png"))
  .resize({ width: 480 })
  .png()
  .toBuffer();
const lw = 480;
const lh = Math.round((info.height / info.width) * lw);
const TW = 520;
const TH = lh + 40;
const base = `<svg width="${TW * 3}" height="${TH}" xmlns="http://www.w3.org/2000/svg">
  <defs><pattern id="ch" width="24" height="24" patternUnits="userSpaceOnUse">
    <rect width="24" height="24" fill="#bbbbbb"/><rect width="12" height="12" fill="#eeeeee"/><rect x="12" y="12" width="12" height="12" fill="#eeeeee"/>
  </pattern></defs>
  <rect x="0" y="0" width="${TW}" height="${TH}" fill="url(#ch)"/>
  <rect x="${TW}" y="0" width="${TW}" height="${TH}" fill="#3e503e"/>
  <rect x="${TW * 2}" y="0" width="${TW}" height="${TH}" fill="#0b0c0a"/>
</svg>`;
await sharp(Buffer.from(base))
  .composite([
    { input: logo, top: 20, left: Math.round((TW - lw) / 2) },
    { input: logo, top: 20, left: TW + Math.round((TW - lw) / 2) },
    { input: logo, top: 20, left: TW * 2 + Math.round((TW - lw) / 2) },
  ])
  .png()
  .toFile(path.join(QA, "logo-qa.png"));

console.log(`logo ${W}x${H}, bg pixels cleared: ${bg.reduce((a, v) => a + v, 0)}`);
console.log("wrote qa/logo-cut.png and qa/logo-qa.png");
