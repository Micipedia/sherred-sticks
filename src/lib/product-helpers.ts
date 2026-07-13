import type { Product } from "./types";

// Pure, dependency-free product helpers. Kept out of products.ts (which reads the
// filesystem at build time and is therefore server-only) so that CLIENT components
// can import these without pulling the data loader into the client bundle.

const GBP = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

/** cents == pence here; money is stored as integers to avoid float bugs. */
export function formatPrice(cents: number): string {
  return GBP.format(cents / 100);
}

/**
 * Main (hero) photo for a product — the first in its photo list. Returns "" if
 * the product has no photos yet: a stick added through the CMS starts with no
 * photos (Steve adds the text first, uploads photos a few minutes later), so
 * `photos` can legitimately be missing and must not crash the build/render.
 */
export function mainImage(p: Product): string {
  return p.photos?.[0] ?? "";
}

/** All photo paths for a product's gallery (empty array if none yet). */
export function productImages(p: Product): string[] {
  return p.photos ?? [];
}
