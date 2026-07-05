import fs from "node:fs";
import path from "node:path";
import type { Accessory } from "./types";

// SERVER-ONLY (reads the filesystem at build time). Accessories are edited via
// the CMS as one JSON file each in src/data/accessories/.

const DIR = path.join(process.cwd(), "src/data/accessories");

export function getAccessories(): Accessory[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".json"))
    .map((file) => {
      const data = JSON.parse(
        fs.readFileSync(path.join(DIR, file), "utf8")
      ) as Omit<Accessory, "slug">;
      return { slug: file.replace(/\.json$/, ""), ...data };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}
