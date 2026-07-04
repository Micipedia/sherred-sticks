import type { Category, CategorySlug, Product } from "./types";

export const CATEGORIES: Category[] = [
  {
    slug: "hiking",
    name: "Hiking Sticks",
    tagline: "For the trail, the hills and the long road.",
    blurb:
      "Light, strong and honest — thumbsticks and staffs cut for the walker who covers ground. Seasoned hardwood with a grip that warms to the hand.",
  },
  {
    slug: "dinner",
    name: "Dinner Sticks",
    tagline: "A dress cane for an evening out.",
    blurb:
      "Slim, well-mannered canes finished to a soft sheen. The kind of stick that finishes an outfit rather than steadies a step.",
  },
  {
    slug: "aid",
    name: "Aid Sticks",
    tagline: "Steady, comfortable support for every day.",
    blurb:
      "Balanced walking aids with kind handles and a sure brass ferrule. Made to be leaned on, morning to night.",
  },
  {
    slug: "robust",
    name: "Robust & Traditional",
    tagline: "Classic Irish blackthorn, built to last a lifetime.",
    blurb:
      "The traditional Irish blackthorn — knotted, heavy in the hand and cured the old way. A stick with generations of history behind it.",
  },
];

export const PRODUCTS: Product[] = [
  // ── Hiking ─────────────────────────────────────────────
  {
    slug: "wicklow-thumbstick",
    name: "The Wicklow Thumbstick",
    category: "hiking",
    priceCents: 5900,
    wood: "Irish Hazel",
    woodColor: "#8a5a2b",
    handle: "thumb",
    lengthCm: 130,
    shortDescription: "A tall hazel thumbstick for open hill and forest track.",
    description:
      "Cut from straight-grown Irish hazel and seasoned slowly, the Wicklow is a proper hill companion. The natural fork sits the thumb just so, giving an easy, upright carry over long miles. Finished in oil and tipped with a hardened brass ferrule for grip on wet rock.",
    featured: true,
  },
  {
    slug: "glendalough-trekker",
    name: "The Glendalough Trekker",
    category: "hiking",
    priceCents: 6500,
    wood: "Seasoned Ash",
    woodColor: "#c9a97a",
    handle: "straight",
    lengthCm: 120,
    shortDescription: "A springy ash walking staff with a warm hand-worn top.",
    description:
      "Ash has been the walker's timber for centuries — light, springy and forgiving underfoot. The Glendalough is shaped for a natural swing and rubbed back to a soft, hand-worn finish. A dependable everyday stick for the trail.",
  },
  {
    slug: "mourne-summit-staff",
    name: "The Mourne Summit Staff",
    category: "hiking",
    priceCents: 7200,
    wood: "Sweet Chestnut",
    woodColor: "#5a3418",
    handle: "straight",
    lengthCm: 140,
    shortDescription: "A long chestnut staff for the tops and the boggy ground.",
    description:
      "A full-length staff in rich sweet chestnut, built for the high, broken ground of the Mournes. Extra reach for stream crossings and steep descents, with a deep-oiled finish that shrugs off the weather.",
    featured: true,
  },

  // ── Dinner ─────────────────────────────────────────────
  {
    slug: "dublin-gentleman",
    name: "The Dublin Gentleman",
    category: "dinner",
    priceCents: 9500,
    wood: "Irish Blackthorn",
    woodColor: "#2b1d14",
    handle: "derby",
    lengthCm: 92,
    shortDescription: "A slim blackthorn dress cane with a shaped derby handle.",
    description:
      "A dress cane in the old Dublin style — slender seasoned blackthorn with the natural thorns dressed back and polished dark. The shaped derby handle sits comfortably in the palm, and a slim brass collar sets off the finish. Made to be seen.",
    featured: true,
  },
  {
    slug: "grafton-dress-cane",
    name: "The Grafton Dress Cane",
    category: "dinner",
    priceCents: 11500,
    wood: "Ebonised Hardwood",
    woodColor: "#1c1712",
    handle: "derby",
    lengthCm: 92,
    shortDescription: "A near-black dress cane with a high, formal polish.",
    description:
      "Our most formal cane. Close-grained hardwood ebonised to a deep near-black and brought to a high, even polish, with a fitted brass collar. Understated, correct and quietly handsome — an evening cane in the truest sense.",
  },
  {
    slug: "claddagh-evening-cane",
    name: "The Claddagh Evening Cane",
    category: "dinner",
    priceCents: 8900,
    wood: "Irish Oak",
    woodColor: "#6b4423",
    handle: "crook",
    lengthCm: 92,
    shortDescription: "A warm oak cane with a gentle crook handle.",
    description:
      "Warm Irish oak with a soft crook handle, rubbed to show the honey of the grain. A little less formal than a derby — an easy, elegant cane for the theatre or a long dinner.",
  },

  // ── Aid ────────────────────────────────────────────────
  {
    slug: "liffey-support-cane",
    name: "The Liffey Support Cane",
    category: "aid",
    priceCents: 4900,
    wood: "Steamed Beech",
    woodColor: "#b08a5a",
    handle: "derby",
    lengthCm: 90,
    shortDescription: "A comfortable, balanced everyday support cane.",
    description:
      "A kind, everyday walking aid. Steamed beech gives a smooth, warm shaft; the full derby handle spreads the load across the palm for all-day comfort. A wide, non-slip ferrule keeps it sure on tile and pavement alike.",
    featured: true,
  },
  {
    slug: "shannon-comfort-cane",
    name: "The Shannon Comfort Cane",
    category: "aid",
    priceCents: 5500,
    wood: "Seasoned Ash",
    woodColor: "#c9a97a",
    handle: "derby",
    lengthCm: 88,
    shortDescription: "A light ash cane with a softened palm-fit handle.",
    description:
      "Light in the hand and easy to carry, the Shannon pairs a springy ash shaft with a softened derby handle that fills the palm. A dependable aid for those who are on and off their feet all day.",
  },
  {
    slug: "kerry-steadfast",
    name: "The Kerry Steadfast",
    category: "aid",
    priceCents: 5900,
    wood: "Irish Oak",
    woodColor: "#6b4423",
    handle: "crook",
    lengthCm: 90,
    shortDescription: "A sturdy oak cane with a reassuring crook.",
    description:
      "Solid Irish oak with a generous crook handle you can hook over an arm or a chair-back. A little heavier and reassuringly firm — the Steadfast earns its name.",
  },

  // ── Robust & Traditional ───────────────────────────────
  {
    slug: "blackthorn-shillelagh",
    name: "The Blackthorn Shillelagh",
    category: "robust",
    priceCents: 7900,
    wood: "Irish Blackthorn",
    woodColor: "#2b1d14",
    handle: "knob",
    lengthCm: 95,
    shortDescription: "The classic knobbed blackthorn, cured the old way.",
    description:
      "The stick that started it all. A single length of Irish blackthorn with its natural root-knob left as the head, cured slowly and rubbed with oil to the traditional deep brown. Knotted, heavy and honest — a walking stick with generations of history in the grain.",
    featured: true,
  },
  {
    slug: "tipperary-bata",
    name: "The Tipperary Bata",
    category: "robust",
    priceCents: 9900,
    wood: "Aged Blackthorn",
    woodColor: "#241811",
    handle: "knob",
    lengthCm: 98,
    shortDescription: "A heavier heritage blackthorn in the traditional bata length.",
    description:
      "A nod to the old Irish walking stick — the bata — kept to its traditional length and heft. Chosen from thick, well-knotted blackthorn and aged until the timber is hard and dark. A substantial, characterful stick for the collector and the long-distance walker alike.",
    featured: true,
  },
  {
    slug: "connemara-blackthorn",
    name: "The Connemara Blackthorn",
    category: "robust",
    priceCents: 8500,
    wood: "Irish Blackthorn",
    woodColor: "#2b1d14",
    handle: "knob",
    lengthCm: 96,
    shortDescription: "A characterful west-of-Ireland blackthorn with a strong knob.",
    description:
      "Grown slow and hard in the west, this blackthorn carries the twists and thorns of its weather. The root-knob makes a firm, natural grip, and the whole stick is oiled to bring out the deep colour of the bark. No two are ever quite alike.",
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

export const HANDLE_LABEL: Record<string, string> = {
  knob: "Natural root knob",
  derby: "Shaped derby handle",
  crook: "Curved crook handle",
  thumb: "Natural thumb fork",
  straight: "Straight top",
};
