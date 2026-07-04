"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "./CartProvider";
import { IconCheck } from "./Icons";
import type { Product } from "@/lib/types";

export default function AddToCartButton({
  product,
  className = "",
  label = "Add to basket",
}: {
  product: Product;
  className?: string;
  label?: string;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return (
    <button
      type="button"
      onClick={() => {
        add(product);
        setAdded(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setAdded(false), 1500);
      }}
      aria-label={`Add ${product.name} to basket`}
      className={`inline-flex items-center justify-center gap-2 rounded-sm bg-gold px-5 py-2.5 font-display text-xs uppercase tracking-[0.18em] text-ink transition-colors hover:bg-gold-bright ${className}`}
    >
      {added ? (
        <>
          <IconCheck className="h-4 w-4" /> Added
        </>
      ) : (
        label
      )}
    </button>
  );
}
