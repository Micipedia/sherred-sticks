import type { HandleStyle } from "./types";

/**
 * Parametric walking-stick illustration.
 *
 * These are *sample* products with no photography yet, so rather than ship
 * broken image tiles we draw a stylised stick from the wood tone + handle
 * style. Pure string output so it can be server-rendered into the page and
 * also rasterised for visual QA.
 *
 * NOTE: SVG element ids are document-global, so gradient ids are namespaced
 * per (colour, handle) to avoid several sticks on one page sharing the first
 * one's gradient. Identical sticks share an id, which is harmless.
 */

function clamp(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}

/** Lighten (amt > 0) or darken (amt < 0) a #rrggbb colour. amt in [-1, 1]. */
function shade(hex: string, amt: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const target = amt < 0 ? 0 : 255;
  const p = Math.abs(amt);
  const mix = (c: number) => clamp(c + (target - c) * p);
  return (
    "#" +
    [mix(r), mix(g), mix(b)]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")
  );
}

function handleMarkup(handle: HandleStyle, wood: string): string {
  const outline = shade(wood, -0.5);
  const light = shade(wood, 0.32);
  switch (handle) {
    case "knob":
      return `
        <g>
          <ellipse cx="160" cy="76" rx="31" ry="28" fill="${outline}" opacity="0.55"/>
          <ellipse cx="160" cy="74" rx="30" ry="27" fill="url(#knob-${wood.slice(1)})"/>
          <ellipse cx="150" cy="64" rx="9" ry="6" fill="#ffffff" opacity="0.16"/>
          <ellipse cx="168" cy="82" rx="4" ry="6" fill="${outline}" opacity="0.6"/>
          <ellipse cx="152" cy="86" rx="3.5" ry="5" fill="${outline}" opacity="0.5"/>
          <ellipse cx="171" cy="68" rx="3" ry="4" fill="${outline}" opacity="0.45"/>
        </g>`;
    case "derby":
      return `
        <g fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path d="M160,101 L160,74 Q160,57 179,57 L193,57" stroke="${outline}" stroke-width="18" opacity="0.5"/>
          <path d="M160,101 L160,74 Q160,57 179,57 L193,57" stroke="url(#wood-${wood.slice(1)})" stroke-width="15"/>
          <path d="M160,99 L160,75 Q160,60 178,60" stroke="${light}" stroke-width="4" opacity="0.4"/>
        </g>`;
    case "crook":
      return `
        <g fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path d="M160,104 L160,76 Q160,50 187,50 Q212,50 212,77 Q212,92 197,97" stroke="${outline}" stroke-width="18" opacity="0.5"/>
          <path d="M160,104 L160,76 Q160,50 187,50 Q212,50 212,77 Q212,92 197,97" stroke="url(#wood-${wood.slice(1)})" stroke-width="15"/>
          <path d="M160,100 L160,76 Q160,55 186,55" stroke="${light}" stroke-width="4" opacity="0.4"/>
        </g>`;
    case "thumb":
      return `
        <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke="url(#wood-${wood.slice(1)})" stroke-width="10">
          <path d="M160,102 L160,84" stroke="${outline}" stroke-width="12" opacity="0.5"/>
          <path d="M160,102 L160,84"/>
          <path d="M160,86 L145,66" stroke="${outline}" stroke-width="11" opacity="0.5"/>
          <path d="M160,86 L176,67" stroke="${outline}" stroke-width="11" opacity="0.5"/>
          <path d="M160,86 L145,66"/>
          <path d="M160,86 L176,67"/>
          <circle cx="160" cy="86" r="6" fill="${outline}" stroke="none"/>
        </g>`;
    case "straight":
    default:
      return `
        <g>
          <ellipse cx="160" cy="98" rx="8.5" ry="6.5" fill="${outline}" opacity="0.5"/>
          <ellipse cx="160" cy="97" rx="8" ry="6" fill="url(#wood-${wood.slice(1)})"/>
          <ellipse cx="157" cy="95" rx="3" ry="2" fill="#ffffff" opacity="0.16"/>
        </g>`;
  }
}

export function buildStickSvg(opts: { woodColor: string; handle: HandleStyle }): string {
  const wood = opts.woodColor;
  const uid = wood.slice(1);
  const light = shade(wood, 0.3);
  const dark = shade(wood, -0.38);
  const darker = shade(wood, -0.55);

  return `<svg viewBox="0 0 320 420" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" role="img">
  <defs>
    <linearGradient id="wood-${uid}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${light}"/>
      <stop offset="0.42" stop-color="${wood}"/>
      <stop offset="1" stop-color="${dark}"/>
    </linearGradient>
    <radialGradient id="knob-${uid}" cx="0.38" cy="0.34" r="0.75">
      <stop offset="0" stop-color="${light}"/>
      <stop offset="0.6" stop-color="${wood}"/>
      <stop offset="1" stop-color="${darker}"/>
    </radialGradient>
    <radialGradient id="glow-${uid}" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#c9a24b" stop-opacity="0.10"/>
      <stop offset="1" stop-color="#c9a24b" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <ellipse cx="160" cy="210" rx="72" ry="176" fill="url(#glow-${uid})"/>
  <ellipse cx="164" cy="380" rx="48" ry="10" fill="#000000" opacity="0.38"/>

  <g transform="rotate(-8 160 210)">
    <!-- shaft -->
    <path d="M152,98 L168,98 L165,356 L155,356 Z" fill="url(#wood-${uid})"/>
    <!-- cylinder highlight -->
    <path d="M153.5,100 L157,100 L155.5,354 L154,354 Z" fill="#ffffff" opacity="0.12"/>
    <!-- grain -->
    <path d="M158,106 C 156,180 162,260 159,350" fill="none" stroke="${dark}" stroke-width="1" opacity="0.5"/>
    <path d="M163,106 C 165,192 160,272 162,350" fill="none" stroke="${dark}" stroke-width="1" opacity="0.4"/>
    <!-- knots / character -->
    <ellipse cx="160" cy="152" rx="4" ry="6" fill="${darker}" opacity="0.65"/>
    <ellipse cx="159" cy="232" rx="3.2" ry="5" fill="${darker}" opacity="0.6"/>
    <ellipse cx="161" cy="300" rx="3.6" ry="5" fill="${darker}" opacity="0.6"/>
    <!-- ferrule -->
    <rect x="154" y="351" width="12" height="5" rx="1.5" fill="#b0873a"/>
    <path d="M155,357 L165,357 L162,373 L158,373 Z" fill="#17140f"/>
    <!-- handle -->
    ${handleMarkup(opts.handle, wood)}
  </g>
</svg>`;
}
