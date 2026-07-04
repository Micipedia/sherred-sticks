// Throwaway visual-QA harness: rasterise the stick illustrations to a PNG
// contact sheet so we can eyeball them without a browser.
import sharp from "sharp";
import { buildStickSvg } from "../src/lib/stick-svg.ts";

const combos = [
  { label: "blackthorn knob", woodColor: "#2b1d14", handle: "knob" },
  { label: "hazel thumb", woodColor: "#8a5a2b", handle: "thumb" },
  { label: "ash straight", woodColor: "#c9a97a", handle: "straight" },
  { label: "oak crook", woodColor: "#6b4423", handle: "crook" },
  { label: "beech derby", woodColor: "#b08a5a", handle: "derby" },
  { label: "ebonised derby", woodColor: "#1c1712", handle: "derby" },
];

const TILE_W = 240;
const TILE_H = 300;
const COLS = 3;
const GAP = 16;
const rows = Math.ceil(combos.length / COLS);
const W = COLS * TILE_W + (COLS + 1) * GAP;
const H = rows * TILE_H + (rows + 1) * GAP;

const tiles = combos
  .map((c, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const x = GAP + col * (TILE_W + GAP);
    const y = GAP + row * (TILE_H + GAP);
    const inner = buildStickSvg({ woodColor: c.woodColor, handle: c.handle })
      .replace(
        'width="100%" height="100%"',
        `x="${x}" y="${y}" width="${TILE_W}" height="${TILE_H}"`
      );
    return `
      <rect x="${x}" y="${y}" width="${TILE_W}" height="${TILE_H}" rx="10" fill="#14150f" stroke="#33301f"/>
      ${inner}
      <text x="${x + TILE_W / 2}" y="${y + TILE_H - 12}" fill="#c9a24b" font-size="13" font-family="serif" text-anchor="middle">${c.label}</text>`;
  })
  .join("\n");

const sheet = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="#0b0c0a"/>
  ${tiles}
</svg>`;

await sharp(Buffer.from(sheet)).png().toFile("qa/sticks.png");
console.log(`wrote qa/sticks.png (${W}x${H})`);
