import Link from "next/link";
import ProductImage from "./ProductImage";
import AddToCartButton from "./AddToCartButton";
import { getCategory } from "@/lib/products";
import { formatPrice } from "@/lib/product-helpers";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const category = getCategory(product.category);
  return (
    <article className="group flex flex-col overflow-hidden rounded-sm border border-line bg-surface hairline lift">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-ink">
          <ProductImage
            product={product}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          {product.sold && (
            <span className="absolute left-3 top-3 rounded-sm bg-ink/85 px-2.5 py-1 font-display text-[0.62rem] uppercase tracking-[0.18em] text-gold backdrop-blur">
              Sold
            </span>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <span className="eyebrow !text-[0.6rem]">{category?.name}</span>
        <Link href={`/product/${product.slug}`}>
          <h3 className="mt-1 font-display text-lg leading-snug text-parchment transition-colors group-hover:text-gold">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-muted">{product.detail}</p>
        <div className="mt-4 flex items-center justify-between">
          {product.sold ? (
            <span className="font-display text-sm uppercase tracking-[0.16em] text-muted">
              Sold
            </span>
          ) : (
            <>
              <span className="text-lg tabular-nums text-gold">
                {product.priceCents != null ? formatPrice(product.priceCents) : ""}
              </span>
              <AddToCartButton product={product} label="Add" className="!px-3.5 !py-2" />
            </>
          )}
        </div>
      </div>
    </article>
  );
}
