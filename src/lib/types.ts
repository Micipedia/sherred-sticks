export type CategorySlug = "hiking" | "dinner" | "aid" | "robust";

export type HandleStyle = "knob" | "derby" | "crook" | "thumb" | "straight";

export interface Category {
  slug: CategorySlug;
  name: string;
  tagline: string;
  blurb: string;
}

export interface Product {
  slug: string;
  name: string;
  category: CategorySlug;
  /** Price in cents (EUR) to avoid floating-point money bugs. */
  priceCents: number;
  /** Display name of the timber, e.g. "Irish Blackthorn". */
  wood: string;
  /** Hex colour used to render the sample illustration. */
  woodColor: string;
  handle: HandleStyle;
  lengthCm: number;
  shortDescription: string;
  description: string;
  featured?: boolean;
}

export interface CartLine {
  slug: string;
  name: string;
  priceCents: number;
  wood: string;
  woodColor: string;
  handle: HandleStyle;
  qty: number;
}
