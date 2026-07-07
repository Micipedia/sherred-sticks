// Emit public/store.json — the trusted price list the checkout Worker reads to
// build a Stripe payment. Regenerated on every deploy from the stick + accessory
// data, so it always reflects the current prices/availability set in the editor.
// Runs AFTER optimize-images.mjs so any HEIC photo paths are already .jpg.

import fs from "node:fs";
import path from "node:path";

function readDir(rel, mapper) {
  const dir = path.join(process.cwd(), rel);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => mapper(f.replace(/\.json$/, ""), JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"))));
}

const sticks = readDir("src/data/products", (slug, d) => ({
  slug,
  kind: "stick",
  name: d.name,
  priceCents: d.priceCents ?? null,
  sold: Boolean(d.sold),
  image: (d.photos && d.photos[0]) || null,
}));

const accessories = readDir("src/data/accessories", (slug, d) => ({
  slug,
  kind: "accessory",
  name: d.name,
  priceCents: d.priceCents ?? null,
  // "sold" here means "not buyable" — reuse the same flag the Worker checks.
  sold: !d.available,
  image: (d.photos && d.photos[0]) || null,
}));

const store = [...sticks, ...accessories];
fs.writeFileSync(path.join(process.cwd(), "public/store.json"), JSON.stringify(store));
console.log(`wrote public/store.json (${sticks.length} sticks, ${accessories.length} accessories)`);

// Publish the shipping zone table so the checkout Worker can read the SAME rates
// the site's checkout page shows — one source of truth, no drift.
fs.copyFileSync(
  path.join(process.cwd(), "src/data/shipping.json"),
  path.join(process.cwd(), "public/shipping.json")
);
console.log("copied src/data/shipping.json -> public/shipping.json");
