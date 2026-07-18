import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import PayItForwardCard from "@/components/PayItForwardCard";
import CelticDivider from "@/components/CelticDivider";
import { CATEGORIES, getCategory, productsByCategory } from "@/lib/products";

// Static export: only the known categories, resolved at build time.
export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  return {
    title: category ? category.name : "Category",
    description: category?.blurb,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const products = productsByCategory(category.slug);

  return (
    <div className="container-page py-14">
      <nav className="mb-6 text-xs uppercase tracking-[0.14em] text-muted">
        <Link href="/shop" className="hover:text-gold">
          Shop
        </Link>
        <span className="px-2">/</span>
        <span className="text-parchment-dim">{category.name}</span>
      </nav>

      <header className="max-w-2xl">
        <p className="eyebrow">{category.tagline}</p>
        <h1 className="mt-3 font-display text-4xl text-parchment">{category.name}</h1>
        <p className="mt-4 leading-relaxed text-muted">{category.blurb}</p>
      </header>

      <CelticDivider className="my-10" />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
        <PayItForwardCard />
      </div>
    </div>
  );
}
