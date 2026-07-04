import Link from "next/link";
import StickImage from "./StickImage";
import AddToCartButton from "./AddToCartButton";
import { formatPrice, getCategory } from "@/lib/products";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const category = getCategory(product.category);
  return (
    <article className="group flex flex-col overflow-hidden rounded-sm border border-line bg-surface hairline lift">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="aspect-[4/5] overflow-hidden bg-gradient-to-b from-surface-2 to-ink">
          <StickImage
            woodColor={product.woodColor}
            handle={product.handle}
            className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <span className="eyebrow !text-[0.6rem]">{category?.name}</span>
        <Link href={`/product/${product.slug}`}>
          <h3 className="mt-1 font-display text-lg leading-snug text-parchment transition-colors group-hover:text-gold">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-muted">{product.wood}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg tabular-nums text-gold">
            {formatPrice(product.priceCents)}
          </span>
          <AddToCartButton product={product} label="Add" className="!px-3.5 !py-2" />
        </div>
      </div>
    </article>
  );
}
