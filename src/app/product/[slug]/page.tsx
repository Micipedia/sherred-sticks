import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import StickImage from "@/components/StickImage";
import AddToCartButton from "@/components/AddToCartButton";
import ProductCard from "@/components/ProductCard";
import CelticDivider from "@/components/CelticDivider";
import {
  HANDLE_LABEL,
  PRODUCTS,
  formatPrice,
  getCategory,
  getProduct,
  productsByCategory,
} from "@/lib/products";

export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  return {
    title: product ? product.name : "Product",
    description: product?.shortDescription,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const related = productsByCategory(product.category)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  const specs = [
    { label: "Timber", value: product.wood },
    { label: "Handle", value: HANDLE_LABEL[product.handle] },
    { label: "Length", value: `${product.lengthCm} cm` },
    { label: "Finish", value: "Hand-oiled, brass ferrule" },
  ];

  return (
    <div className="container-page py-14">
      <nav className="mb-8 text-xs uppercase tracking-[0.14em] text-muted">
        <Link href="/shop" className="hover:text-gold">
          Shop
        </Link>
        <span className="px-2">/</span>
        {category && (
          <>
            <Link href={`/category/${category.slug}`} className="hover:text-gold">
              {category.name}
            </Link>
            <span className="px-2">/</span>
          </>
        )}
        <span className="text-parchment-dim">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Image */}
        <div>
          <div className="aspect-[4/5] overflow-hidden rounded-sm border border-line bg-gradient-to-b from-surface-2 to-ink hairline">
            <StickImage
              woodColor={product.woodColor}
              handle={product.handle}
              className="h-full w-full"
            />
          </div>
          <p className="mt-3 text-center text-xs text-muted">
            Sample illustration — product photography to come.
          </p>
        </div>

        {/* Details */}
        <div className="flex flex-col">
          {category && (
            <Link
              href={`/category/${category.slug}`}
              className="eyebrow hover:text-gold-bright"
            >
              {category.name}
            </Link>
          )}
          <h1 className="mt-3 font-display text-3xl leading-tight text-parchment sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-4 text-2xl tabular-nums text-gold">
            {formatPrice(product.priceCents)}
          </p>
          <p className="mt-5 text-lg leading-relaxed text-parchment-dim">
            {product.shortDescription}
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-line py-6">
            {specs.map((s) => (
              <div key={s.label}>
                <dt className="text-xs uppercase tracking-[0.14em] text-muted">
                  {s.label}
                </dt>
                <dd className="mt-1 text-parchment">{s.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8">
            <AddToCartButton
              product={product}
              label="Add to basket"
              className="w-full !px-8 !py-3.5 !text-sm sm:w-auto"
            />
          </div>

          <div className="mt-6 space-y-2 text-sm text-muted">
            <p>Made to order and finished by hand — please allow time for crafting.</p>
            <p>Every stick is unique; grain, colour and knots will vary.</p>
          </div>

          <div className="mt-8 leading-relaxed text-parchment-dim">
            {product.description}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <div className="text-center">
            <p className="eyebrow">More from this range</p>
            <h2 className="mt-3 font-display text-2xl text-parchment">
              You might also like
            </h2>
          </div>
          <CelticDivider className="my-8" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
