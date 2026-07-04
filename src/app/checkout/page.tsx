"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import StickImage from "@/components/StickImage";
import { IconCheck } from "@/components/Icons";
import { formatPrice } from "@/lib/products";
import { btnGhost, btnPrimary } from "@/lib/ui";

export default function CheckoutPage() {
  const { lines, subtotalCents, count, clear, hydrated } = useCart();
  const [placed, setPlaced] = useState(false);

  // Order-placed confirmation (demo only).
  if (placed) {
    return (
      <div className="container-page flex flex-col items-center py-28 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold text-gold">
          <IconCheck className="h-8 w-8" />
        </span>
        <h1 className="mt-6 font-display text-3xl text-parchment">Thank you</h1>
        <p className="mt-4 max-w-md text-muted">
          This was a preview — no payment was taken and no order was placed. In
          the live shop, this is where a secure card payment would complete.
        </p>
        <Link href="/shop" className={`${btnPrimary} mt-8`}>
          Back to the shop
        </Link>
      </div>
    );
  }

  if (!hydrated) {
    return (
      <div className="container-page py-28 text-center text-muted">
        Loading your basket…
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="container-page flex flex-col items-center py-28 text-center">
        <h1 className="font-display text-3xl text-parchment">Your basket is empty</h1>
        <p className="mt-4 text-muted">Add a stick or two and come back.</p>
        <Link href="/shop" className={`${btnPrimary} mt-8`}>
          Browse the collection
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-14">
      <header className="text-center">
        <p className="eyebrow">Almost there</p>
        <h1 className="mt-3 font-display text-4xl text-parchment">Checkout</h1>
      </header>

      <div className="mx-auto mt-10 max-w-2xl">
        {/* Preview notice */}
        <div className="mb-8 rounded-sm border border-gold/40 bg-gold/5 p-5 text-sm leading-relaxed text-parchment-dim">
          <span className="font-display uppercase tracking-[0.14em] text-gold">
            Preview store
          </span>
          <p className="mt-2">
            No payment is taken here. In the live shop, Checkout takes you to a
            secure card payment powered by Stripe, with delivery details
            collected on the way.
          </p>
        </div>

        {/* Order summary */}
        <ul className="divide-y divide-line rounded-sm border border-line">
          {lines.map((l) => (
            <li key={l.slug} className="flex items-center gap-4 p-4">
              <div className="h-20 w-16 shrink-0 overflow-hidden rounded-sm border border-line bg-surface">
                <StickImage woodColor={l.woodColor} handle={l.handle} className="h-full w-full" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-parchment">{l.name}</p>
                <p className="text-sm text-muted">{l.wood}</p>
                <p className="text-sm text-muted">Qty {l.qty}</p>
              </div>
              <span className="tabular-nums text-gold">
                {formatPrice(l.priceCents * l.qty)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-center justify-between border-t border-line pt-6">
          <span className="font-display text-lg uppercase tracking-[0.12em] text-parchment">
            Subtotal ({count})
          </span>
          <span className="text-2xl tabular-nums text-gold">
            {formatPrice(subtotalCents)}
          </span>
        </div>
        <p className="mt-1 text-right text-xs text-muted">
          Shipping calculated before payment.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row-reverse">
          <button
            type="button"
            onClick={() => {
              setPlaced(true);
              clear();
            }}
            className={`${btnPrimary} flex-1`}
          >
            Place order (demo)
          </button>
          <Link href="/shop" className={`${btnGhost} flex-1`}>
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
