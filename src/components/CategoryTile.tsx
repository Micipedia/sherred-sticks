import Link from "next/link";
import ProductImage from "./ProductImage";
import { productsByCategory } from "@/lib/products";
import type { Category } from "@/lib/types";
import { IconArrow } from "./Icons";

export default function CategoryTile({ category }: { category: Category }) {
  const rep = productsByCategory(category.slug)[0];
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group flex flex-col overflow-hidden rounded-sm border border-line bg-surface hairline lift"
    >
      <div className="aspect-[3/2] overflow-hidden bg-ink">
        {rep && (
          <ProductImage
            product={rep}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl text-parchment transition-colors group-hover:text-gold">
          {category.name}
        </h3>
        <p className="mt-1 text-sm text-muted">{category.tagline}</p>
        <span className="mt-3 inline-flex items-center gap-1.5 font-display text-xs uppercase tracking-[0.16em] text-gold">
          View sticks
          <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
