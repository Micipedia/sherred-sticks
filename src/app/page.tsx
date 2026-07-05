import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import CelticDivider from "@/components/CelticDivider";
import ProductCard from "@/components/ProductCard";
import CategoryTile from "@/components/CategoryTile";
import {
  IconArrow,
  IconChisel,
  IconLeaf,
  IconShield,
  IconTruck,
} from "@/components/Icons";
import { CATEGORIES, PRODUCTS, featuredProducts, getProduct } from "@/lib/products";
import { asset } from "@/lib/asset";
import { btnGhost, btnPrimary } from "@/lib/ui";

const TRUST = [
  { icon: IconChisel, title: "Hand-shaped", note: "Every stick worked by hand" },
  { icon: IconLeaf, title: "Seasoned timber", note: "Hardwoods dried the slow way" },
  { icon: IconTruck, title: "Shipped with care", note: "Boxed, wrapped and tracked" },
  { icon: IconShield, title: "Made to last", note: "Built to be handed down" },
];

export default function HomePage() {
  const storyStick = getProduct("stick-16") ?? PRODUCTS[0];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="container-page grid items-center gap-10 py-16 md:py-24 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Handmade in the British Isles</p>
            <h1 className="mt-4 font-display text-4xl leading-[1.1] text-parchment sm:text-5xl">
              Walking sticks &amp; shillelaghs, made the old way
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-parchment-dim">
              Seasoned hardwood, hand-shaped handles and a finish rubbed back by
              hand. Sticks to walk with, to lean on, and to pass down.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className={btnPrimary}>
                Shop the collection
                <IconArrow className="h-4 w-4" />
              </Link>
              <Link href="/about" className={btnGhost}>
                Our story
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="mx-auto max-w-md overflow-hidden rounded-md border border-line bg-brand hairline">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset("/brand/sherred-and-sons.png")}
                alt="Sherred & Sons Walking Sticks"
                width={1400}
                height={763}
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-line bg-ink-2/60">
        <div className="container-page grid grid-cols-2 gap-6 py-8 lg:grid-cols-4">
          {TRUST.map(({ icon: Icon, title, note }) => (
            <div key={title} className="flex items-center gap-3">
              <Icon className="h-7 w-7 shrink-0 text-gold" />
              <div>
                <p className="font-display text-sm text-parchment">{title}</p>
                <p className="text-xs text-muted">{note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container-page py-16">
        <div className="text-center">
          <p className="eyebrow">The collection</p>
          <h2 className="mt-3 font-display text-3xl text-parchment">Find your stick</h2>
        </div>
        <CelticDivider className="my-8" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <CategoryTile key={c.slug} category={c} />
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="border-y border-line bg-ink-2/50 py-16">
        <div className="container-page">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Favourites</p>
              <h2 className="mt-3 font-display text-3xl text-parchment">Featured sticks</h2>
            </div>
            <Link
              href="/shop"
              className="hidden items-center gap-1 font-display text-xs uppercase tracking-[0.16em] text-gold hover:text-gold-bright sm:inline-flex"
            >
              View all
              <IconArrow className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts().map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Story teaser */}
      <section className="container-page py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <p className="eyebrow">Our craft</p>
            <h2 className="mt-3 font-display text-3xl text-parchment">
              A stick with a story in the grain
            </h2>
            <p className="mt-5 leading-relaxed text-parchment-dim">
              Every Sherred stick begins as a length of hardwood, chosen for its
              straightness and character, then seasoned slowly until it is hard
              and true. The handle is shaped by hand, the shaft rubbed back and
              oiled, and a brass ferrule fitted for the road.
            </p>
            <p className="mt-4 leading-relaxed text-parchment-dim">
              No two are ever quite alike — the knots, the colour and the curve
              of each stick are its own.
            </p>
            <Link href="/about" className={`${btnGhost} mt-8`}>
              Read our story
              <IconArrow className="h-4 w-4" />
            </Link>
          </div>
          <div className="order-1 lg:order-2">
            <div className="mx-auto aspect-[4/5] max-w-sm overflow-hidden rounded-sm border border-line bg-ink hairline">
              <ProductImage product={storyStick} className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-line bg-gradient-to-b from-surface to-ink py-16">
        <div className="container-page text-center">
          <h2 className="font-display text-3xl text-parchment">
            Ready to find your stick?
          </h2>
          <p className="mt-3 text-muted">
            Hiking staffs, dress canes, support sticks and traditional blackthorn.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/shop" className={btnPrimary}>
              Shop all sticks
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
