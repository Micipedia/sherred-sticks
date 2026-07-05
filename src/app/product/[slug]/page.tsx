import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import ProductCard from "@/components/ProductCard";
import AddToCartButton from "@/components/AddToCartButton";
import CelticDivider from "@/components/CelticDivider";
import {
  PRODUCTS,
  formatPrice,
  getCategory,
  getProduct,
  productImages,
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
  const images = productImages(product);
  const related = productsByCategory(product.category)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  const spec = product.spec;
  const specRows = (
    spec
      ? [
          ["Length", spec.length],
          ["Head", spec.head],
          ["Shaft", spec.shaft],
          ["Ferrule", spec.ferrule],
          ["Tip", spec.tip],
          ["Polish", spec.polish],
          ["Features", spec.features],
        ]
      : []
  ).filter((row): row is [string, string] => Boolean(row[1]));

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
        {/* Images */}
        <div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-line bg-ink">
            <ProductImage
              product={product}
              src={images[0]}
              priority
              className="h-full w-full object-contain"
            />
            {product.sold && (
              <span className="absolute left-4 top-4 rounded-sm bg-ink/85 px-3 py-1 font-display text-xs uppercase tracking-[0.18em] text-gold backdrop-blur">
                Sold
              </span>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {images.slice(1).map((img) => (
                <div
                  key={img}
                  className="aspect-square overflow-hidden rounded-sm border border-line bg-ink"
                >
                  <ProductImage
                    product={product}
                    src={img}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
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
          <p className="mt-2 text-muted">{product.detail}</p>

          <p className="mt-6 text-lg leading-relaxed text-parchment-dim">
            {product.shortDescription}
          </p>
          <div className="mt-4 leading-relaxed text-parchment-dim">
            {product.description}
          </div>

          {specRows.length > 0 && (
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-line py-6">
              {specRows.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs uppercase tracking-[0.14em] text-muted">
                    {label}
                  </dt>
                  <dd className="mt-1 text-parchment">{value}</dd>
                </div>
              ))}
            </dl>
          )}

          {/* Purchase / sold state */}
          {product.sold ? (
            <div className="mt-8 rounded-sm border border-gold/40 bg-gold/5 p-5">
              <p className="font-display text-sm uppercase tracking-[0.18em] text-gold">
                Sold
              </p>
              <p className="mt-2 text-sm leading-relaxed text-parchment-dim">
                This one has found its home. Every stick is one of a kind and made
                by hand — {" "}
                <Link href="/contact" className="text-gold hover:text-gold-bright">
                  get in touch
                </Link>{" "}
                about a similar piece.
              </p>
            </div>
          ) : (
            <div className="mt-8">
              {product.priceCents != null && (
                <p className="mb-4 text-2xl tabular-nums text-gold">
                  {formatPrice(product.priceCents)}
                </p>
              )}
              <AddToCartButton
                product={product}
                label="Add to basket"
                className="w-full !px-8 !py-3.5 !text-sm sm:w-auto"
              />
            </div>
          )}

          <p className="mt-6 text-sm text-muted">
            Handmade and one of a kind — grain, colour and character vary from
            stick to stick.
          </p>
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
