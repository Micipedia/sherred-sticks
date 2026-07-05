import type { Category, CategorySlug, Product } from "./types";

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

export const PRODUCTS: Product[] = [
  {
    slug: "stick-1",
    name: "The Burl Crown",
    category: "robust",
    detail: "Root-knob walking stick",
    photos: 5,
    sold: true,
    shortDescription: "A hefty root-knob stick with a deep, glossy head.",
    description:
      "A substantial hand-finished walking stick, its natural root knob polished to a warm, deep shine. A classic knobbed piece with real weight in the hand.",
  },
  {
    slug: "stick-2",
    name: "Honeyed Burl Knob",
    category: "robust",
    detail: "Figured burl knob",
    photos: 5,
    sold: true,
    featured: true,
    shortDescription: "A large amber burl head with beautiful figured grain.",
    description:
      "One of the finest heads in the collection — a big amber burl knob full of figure, brought to a glass-smooth polish.",
  },
  {
    slug: "stick-3",
    name: "Amber Shillelagh",
    category: "robust",
    detail: "Knobbed shillelagh",
    photos: 5,
    sold: true,
    featured: true,
    shortDescription: "A classic knobbed shillelagh with a rich amber head.",
    description:
      "A traditional knobbed shillelagh with a glossy amber crown and a straight, sturdy shaft.",
  },
  {
    slug: "stick-4",
    name: "The Golden Knob",
    category: "robust",
    detail: "Root-knob walking stick",
    photos: 5,
    sold: true,
    shortDescription: "A smooth, rounded knob in warm honey tones.",
    description:
      "A neatly rounded root knob finished in warm honey colour, comfortable and full in the palm.",
  },
  {
    slug: "stick-5",
    name: "The Natural Burl",
    category: "robust",
    detail: "Part-natural knob",
    photos: 5,
    sold: true,
    shortDescription: "A characterful knob left part-natural, bark and burl intact.",
    description:
      "A rugged root knob left partly in its natural state, with bark and burl texture kept for character.",
  },
  {
    slug: "stick-6",
    name: "The Dark Knob",
    category: "robust",
    detail: "Dark-finished knob",
    photos: 5,
    sold: true,
    shortDescription: "A boldly dark-finished knob stick.",
    description:
      "A striking walking stick finished in deep, near-black tones, with a bold knobbed head.",
  },
  {
    slug: "stick-7",
    name: "The Ram's Horn Crook",
    category: "aid",
    detail: "Curved crook handle",
    photos: 5,
    sold: true,
    featured: true,
    shortDescription: "An elegant curved crook in pale, figured wood.",
    description:
      "A gracefully curved crook handle in pale figured wood — easy to hook over an arm or a chair-back.",
  },
  {
    slug: "stick-8",
    name: "The Carved Crown",
    category: "robust",
    detail: "Hand-carved head",
    photos: 5,
    sold: true,
    shortDescription: "A knob stick with a hand-carved head.",
    description:
      "A knobbed stick with a hand-worked, carved head and plenty of natural character.",
  },
  {
    slug: "stick-9",
    name: "The Midnight Knob",
    category: "robust",
    detail: "Dark knob stick",
    photos: 5,
    sold: true,
    shortDescription: "A dark, glossy knob with a substantial head.",
    description:
      "A dark-toned knob stick with a full, glossy head and a solid, dependable feel.",
  },
  {
    slug: "stick-10",
    name: "The Long Staff",
    category: "hiking",
    detail: "Full-length staff",
    photos: 5,
    sold: true,
    featured: true,
    shortDescription: "A full-length straight walking staff for the trail.",
    description:
      "A tall, straight staff with a smooth seasoned shaft — a proper companion for open ground.",
  },
  {
    slug: "stick-11",
    name: "Amber Knob & Shaft",
    category: "robust",
    detail: "Knob-topped walking stick",
    photos: 5,
    sold: true,
    shortDescription: "A round, polished knob on a straight seasoned shaft.",
    description:
      "A rounded amber knob set on a clean, straight shaft — a handsome everyday walking stick.",
  },
  {
    slug: "stick-12",
    name: "The Patterned Cane",
    category: "dinner",
    detail: "Decorative-shaft cane",
    photos: 5,
    sold: true,
    shortDescription: "A knob-topped cane with a decorative, textured shaft.",
    description:
      "A knob-topped cane finished with a decorative, patterned shaft — a little more dressed-up than the rest.",
  },
  {
    slug: "stick-13",
    name: "The Onyx Knob",
    category: "robust",
    detail: "Dark knob stick",
    photos: 5,
    sold: true,
    shortDescription: "A dark knob on a dark, slender shaft.",
    description:
      "A neat dark-headed knob stick on a slim, dark shaft — understated and smart.",
  },
  {
    slug: "stick-14",
    name: "The Field Staff",
    category: "hiking",
    detail: "Full-length staff",
    photos: 5,
    sold: true,
    shortDescription: "A long, straight field staff.",
    description:
      "A simple, honest full-length staff for hill and field — light, strong and ready to walk.",
  },
  {
    slug: "stick-15",
    name: "The Spiral Cane",
    category: "dinner",
    detail: "Carved spiral shaft",
    photos: 5,
    sold: true,
    featured: true,
    shortDescription: "A knob stick with a hand-carved spiralled shaft.",
    description:
      "A knobbed stick with a beautifully hand-carved spiral running the length of the shaft — a real eye-catcher.",
  },
  {
    slug: "stick-16",
    name: "The Grand Burl",
    category: "robust",
    detail: "Grand burl knob",
    photos: 5,
    sold: true,
    featured: true,
    shortDescription: "A grand, glossy burl knob — a real statement piece.",
    description:
      "The showpiece of the collection: a large, glossy burl knob with wonderful figure, polished to a mirror finish.",
  },
  {
    slug: "stick-17",
    name: "The Shepherd's Crook",
    category: "aid",
    detail: "Crook-handled cane",
    photos: 4,
    sold: true,
    shortDescription: "A dark crook-handled cane, hooked and ready.",
    description:
      "A dark, hooked crook-handled cane — comfortable to hold and easy to hang over an arm or a rail.",
  },
];

const GBP = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

/** cents == pence here; money is stored as integers to avoid float bugs. */
export function formatPrice(cents: number): string {
  return GBP.format(cents / 100);
}

/** Main (hero) photo for a product. */
export function mainImage(p: Product): string {
  return `/products/${p.slug}/01.jpg`;
}

/** All photo paths for a product's gallery. */
export function productImages(p: Product): string[] {
  return Array.from(
    { length: p.photos },
    (_, k) => `/products/${p.slug}/${String(k + 1).padStart(2, "0")}.jpg`
  );
}

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
