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
  /**
   * Photo paths, e.g. ["/products/<slug>/01.jpg", ...]. The first is the main
   * (hero) image. Stored WITHOUT the deploy base path — asset() adds it at render.
   */
  photos: string[];
  sold: boolean;
  shortDescription: string;
  description: string;
  featured?: boolean;
  /** Price in pence. Omitted for sold pieces. */
  priceCents?: number;
  /** Optional structured spec (maps to Steve's intake sheet fields). */
  spec?: StickSpec;
  /** Live Stripe Payment Link for this stick (buy.stripe.com/...). Empty until set. */
  buyUrl?: string;
}

/** A non-stick item for sale (stick wax, polishing cloth, etc.). */
export interface Accessory {
  slug: string;
  name: string;
  /** Price in pence. */
  priceCents?: number;
  /** In stock and buyable. */
  available: boolean;
  shortDescription: string;
  description: string;
  /** Photo paths (first is the main), stored without the deploy base path. */
  photos: string[];
}

export interface CartLine {
  slug: string;
  name: string;
  priceCents: number;
  image: string;
  qty: number;
}
