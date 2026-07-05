import { asset } from "@/lib/asset";
import { mainImage } from "@/lib/product-helpers";
import type { Product } from "@/lib/types";

/**
 * Renders a real product photo (base-path aware for GitHub Pages).
 * Pass `src` for a specific gallery image; defaults to the main photo.
 */
export default function ProductImage({
  product,
  src,
  className,
  priority = false,
}: {
  product: Product;
  src?: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset(src ?? mainImage(product))}
      alt={product.name}
      className={className}
      loading={priority ? "eager" : "lazy"}
    />
  );
}
