import fs from "node:fs";
import path from "node:path";
import type { Category, CategorySlug, Product } from "./types";

// SERVER-ONLY: this module reads product JSON off disk at build time, so it must
// never be imported by a Client Component. Pure helpers that clients need
// (formatPrice / mainImage / productImages) live in ./product-helpers instead.
// Products are edited via the CMS as one JSON file per stick in src/data/products/.

export const CATEGORIES: Category[] = [
  {
    slug: "hiking",
    name: "Hiking Sticks",
    tagline: "For the trail, the hills and the long road.",
    blurb:
      "Light, strong and honest — staffs and walking sticks cut for the walker who covers ground.",
  },
  {
    slug: "dinner",
    name: "Dinner Sticks",
    tagline: "A dress cane for an evening out.",
    blurb:
      "Decorative, well-finished canes — the kind of stick that finishes an outfit rather than steadies a step.",
  },
  {
    slug: "aid",
    name: "Aid Sticks",
    tagline: "Steady, comfortable support for every day.",
    blurb:
      "Balanced walking aids with kind, curved handles — made to be leaned on and easy to hold.",
  },
  {
    slug: "robust",
    name: "Robust & Traditional",
    tagline: "Classic knobbed sticks, built to last a lifetime.",
    blurb:
      "The traditional knobbed walking stick — a hand-polished root or burl head on a sturdy shaft, full of character.",
  },
];

const PRODUCTS_DIR = path.join(process.cwd(), "src/data/products");

/** Load every stick from its JSON file. The slug is the filename. */
function loadProducts(): Product[] {
  return fs
    .readdirSync(PRODUCTS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((file) => {
      const slug = file.replace(/\.json$/, "");
      const data = JSON.parse(
        fs.readFileSync(path.join(PRODUCTS_DIR, file), "utf8")
      ) as Omit<Product, "slug">;
      return { slug, ...data };
    })
    // Keep a stable, human order (stick-1, stick-2, … stick-10) rather than
    // lexicographic (stick-1, stick-10, …). Numeric-aware compare on the slug.
    .sort((a, b) => a.slug.localeCompare(b.slug, undefined, { numeric: true }));
}

export const PRODUCTS: Product[] = loadProducts();

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function productsByCategory(slug: CategorySlug): Product[] {
  return PRODUCTS.filter((p) => p.category === slug);
}

export function featuredProducts(): Product[] {
  return PRODUCTS.filter((p) => p.featured);
}
