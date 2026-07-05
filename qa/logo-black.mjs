// Preview: same edge flood-fill to remove the outer green card, PLUS recolour
// the remaining (kept) green — the shield's inner field — to near-black so the
// gold pops. Renders a QA sheet on checker / header-green / dark.
import sharp from "sharp";
import path from "node:path";

const SRC = path.join(process.env.HOME, "Downloads", "Sherred and Sons.png");
const QA = path.join(process.env.HOME, "sherred-sticks", "qa");

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height, C = info.channels;
const isBg = (r, g, b) => g - r > 6 && g - b > 6 && r + g + b < 360;

// outer background flood-fill
const bg = new Uint8Array(W * H);
const stack = [];
for (let x = 0; x < W; x++) stack.push(x, x + (H - 1) * W);
for (let y = 0; y < H; y++) stack.push(y * W, W - 1 + y * W);
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
// small enclosed green pockets
const seen = new Uint8Array(W * H);
for (let s = 0; s < W * H; s++) {
  if (bg[s] || seen[s]) continue;
  const i0 = s * C;
  if (!isBg(data[i0], data[i0 + 1], data[i0 + 2])) { seen[s] = 1; continue; }
  const region = [], q = [s]; seen[s] = 1;
  while (q.length) {
    const p = q.pop(); region.push(p);
    const x = p % W; const nb = [p + W, p - W];
    if (x + 1 < W) nb.push(p + 1);
    if (x - 1 >= 0) nb.push(p - 1);
    for (const n of nb) {
      if (n < 0 || n >= W * H || seen[n] || bg[n]) continue;
      const j = n * C;
      if (isBg(data[j], data[j + 1], data[j + 2])) { seen[n] = 1; q.push(n); }
    }
  }
  if (region.length < 9000) for (const p of region) bg[p] = 1;
}

// apply: outer -> transparent; kept green (shield field) -> near-black
const BLACK = [11, 12, 10];
for (let p = 0; p < W * H; p++) {
  const i = p * C;
  if (bg[p]) { data[i + 3] = 0; }
  else if (data[i + 3] > 10 && isBg(data[i], data[i + 1], data[i + 2])) {
    data[i] = BLACK[0]; data[i + 1] = BLACK[1]; data[i + 2] = BLACK[2];
  }
}
await sharp(data, { raw: { width: W, height: H, channels: C } }).png().toFile(path.join(QA, "logo-cut-black.png"));

// QA sheet
const logo = await sharp(path.join(QA, "logo-cut-black.png")).resize({ width: 460 }).png().toBuffer();
const lw = 460, lh = Math.round((H / W) * lw), TW = 500, TH = lh + 30;
const base = `<svg width="${TW * 3}" height="${TH}" xmlns="http://www.w3.org/2000/svg">
 <defs><pattern id="ch" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="24" height="24" fill="#bbb"/><rect width="12" height="12" fill="#eee"/><rect x="12" y="12" width="12" height="12" fill="#eee"/></pattern></defs>
 <rect x="0" y="0" width="${TW}" height="${TH}" fill="url(#ch)"/>
 <rect x="${TW}" y="0" width="${TW}" height="${TH}" fill="#3e503e"/>
 <rect x="${TW * 2}" y="0" width="${TW}" height="${TH}" fill="#0b0c0a"/></svg>`;
await sharp(Buffer.from(base)).composite([
  { input: logo, top: 15, left: Math.round((TW - lw) / 2) },
  { input: logo, top: 15, left: TW + Math.round((TW - lw) / 2) },
  { input: logo, top: 15, left: TW * 2 + Math.round((TW - lw) / 2) },
]).png().toFile(path.join(QA, "logo-black-qa.png"));
console.log("wrote qa/logo-black-qa.png");
