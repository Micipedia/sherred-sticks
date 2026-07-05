export type CategorySlug = "hiking" | "dinner" | "aid" | "robust";

export type HandleStyle = "knob" | "derby" | "crook" | "thumb" | "straight";

export interface Category {
  slug: CategorySlug;
  name: string;
  tagline: string;
  blurb: string;
}

export interface StickSpec {
  length?: string;
  head?: string;
  shaft?: string;
  ferrule?: string;
  tip?: string;
  polish?: string;
  features?: string;
}

export interface Product {
  slug: string;
  name: string;
  category: CategorySlug;
  /** Short descriptor shown under the name (form / character, not a price). */
  detail: string;
  /** Number of photos in /public/products/<slug>/NN.jpg (01.jpg is the main). */
  photos: number;
  sold: boolean;
  shortDescription: string;
  description: string;
  featured?: boolean;
  /** Price in pence. Omitted for sold pieces. */
  priceCents?: number;
  /** Optional structured spec (maps to Steve's intake sheet fields). */
  spec?: StickSpec;
}

export interface CartLine {
  slug: string;
  name: string;
  priceCents: number;
  image: string;
  qty: number;
}
