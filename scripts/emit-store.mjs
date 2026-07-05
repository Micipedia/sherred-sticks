// Emit public/store.json — the trusted price list the checkout Worker reads to
// build a Stripe payment. Regenerated on every deploy from the stick data, so it
// always reflects the current prices/availability the owner set in the editor.
// Runs AFTER optimize-images.mjs so any HEIC photo paths are already .jpg.

import fs from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "src/data/products");
const store = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => {
    const d = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
    return {
      slug: f.replace(/\.json$/, ""),
      name: d.name,
      priceCents: d.priceCents ?? null,
      sold: Boolean(d.sold),
      image: (d.photos && d.photos[0]) || null,
    };
  });

fs.writeFileSync(path.join(process.cwd(), "public/store.json"), JSON.stringify(store));
console.log(`wrote public/store.json (${store.length} sticks)`);
