import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import PayItForwardCard from "@/components/PayItForwardCard";
import CelticDivider from "@/components/CelticDivider";
import { IconArrow } from "@/components/Icons";
import { CATEGORIES, productsByCategory } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop all sticks",
  description:
    "The full Sherred & Sons collection — hiking sticks, dinner canes, support sticks and traditional blackthorn.",
};

export default function ShopPage() {
  return (
    <div className="container-page py-14">
      <header className="text-center">
        <p className="eyebrow">The collection</p>
        <h1 className="mt-3 font-display text-4xl text-parchment">All Walking Sticks</h1>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">
          Hand-shaped sticks across four families — hiking, dinner, aid and
          traditional blackthorn. Choose a family, or browse the lot below.
        </p>
      </header>

      <CelticDivider className="my-8" />

      <nav className="mb-14 flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className="rounded-full border border-line px-4 py-1.5 font-display text-xs uppercase tracking-[0.14em] text-parchment-dim transition-colors hover:border-gold/50 hover:text-gold"
          >
            {c.name}
          </Link>
        ))}
      </nav>

      <div className="space-y-16">
        {CATEGORIES.map((c, i) => (
          <section key={c.slug} id={c.slug} className="scroll-mt-24">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl text-parchment">{c.name}</h2>
                <p className="mt-1 text-sm text-muted">{c.tagline}</p>
              </div>
              <Link
                href={`/category/${c.slug}`}
                className="inline-flex shrink-0 items-center gap-1 font-display text-xs uppercase tracking-[0.14em] text-gold hover:text-gold-bright"
              >
                View
                <IconArrow className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {productsByCategory(c.slug).map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
              {/* One Pay It Forward tile in the collection (first family). */}
              {i === 0 && <PayItForwardCard />}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
