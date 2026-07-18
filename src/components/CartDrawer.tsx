"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { asset } from "@/lib/asset";
import { IconClose, IconMinus, IconPlus, IconTrash } from "./Icons";
import { formatPrice } from "@/lib/product-helpers";
import { PAY_IT_FORWARD_SLUG } from "@/lib/pay-it-forward";

export default function CartDrawer() {
  const { lines, isOpen, close, setQty, remove, subtotalCents, count } = useCart();

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  // Close on Escape.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={close}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-label="Shopping basket"
        aria-modal="true"
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-line bg-ink-2 shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-lg text-parchment">
            Your Basket{" "}
            <span className="text-muted">({count})</span>
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close basket"
            className="rounded-sm p-1 text-muted transition-colors hover:text-parchment"
          >
            <IconClose className="h-6 w-6" />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-muted">Your basket is empty.</p>
            <Link
              href="/shop"
              onClick={close}
              className="font-display text-xs uppercase tracking-[0.18em] text-gold hover:text-gold-bright"
            >
              Browse the collection
            </Link>
          </div>
        ) : (
          <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
            {lines.map((l) => {
              const isPif = l.slug === PAY_IT_FORWARD_SLUG;
              return (
                <li key={l.slug} className="flex gap-4 py-4">
                  <div className="h-20 w-16 shrink-0 overflow-hidden rounded-sm border border-line bg-ink">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={asset(l.image)}
                      alt={l.name}
                      className={`h-full w-full ${isPif ? "object-contain p-2" : "object-cover"}`}
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate font-display text-sm text-parchment">{l.name}</p>
                      <button
                        type="button"
                        onClick={() => remove(l.slug)}
                        aria-label={`Remove ${l.name}`}
                        className="shrink-0 text-muted transition-colors hover:text-oxblood"
                      >
                        <IconTrash className="h-4 w-4" />
                      </button>
                    </div>
                    {isPif && (
                      <p className="mt-0.5 text-xs text-muted">
                        Gift toward a stick for someone in need
                      </p>
                    )}
                    <div className="mt-auto flex items-center justify-between pt-2">
                      {isPif ? (
                        <Link
                          href="/pay-it-forward"
                          onClick={close}
                          className="font-display text-[0.7rem] uppercase tracking-[0.14em] text-muted hover:text-gold"
                        >
                          Change amount
                        </Link>
                      ) : (
                        <div className="flex items-center rounded-sm border border-line">
                          <button
                            type="button"
                            onClick={() => setQty(l.slug, l.qty - 1)}
                            aria-label="Decrease quantity"
                            className="p-1.5 text-muted hover:text-parchment"
                          >
                            <IconMinus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-7 text-center text-sm tabular-nums text-parchment">
                            {l.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQty(l.slug, l.qty + 1)}
                            aria-label="Increase quantity"
                            className="p-1.5 text-muted hover:text-parchment"
                          >
                            <IconPlus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                      <span className="text-sm tabular-nums text-gold">
                        {formatPrice(l.priceCents * l.qty)}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {lines.length > 0 && (
          <footer className="border-t border-line px-5 py-5">
            <div className="mb-1 flex items-center justify-between">
              <span className="font-display text-sm uppercase tracking-[0.14em] text-parchment">
                Subtotal
              </span>
              <span className="text-lg tabular-nums text-gold">
                {formatPrice(subtotalCents)}
              </span>
            </div>
            {lines.some((l) => l.slug !== PAY_IT_FORWARD_SLUG) && (
              <p className="mb-4 text-xs text-muted">
                Shipping calculated at checkout.
              </p>
            )}
            <Link
              href="/checkout"
              onClick={close}
              className="flex w-full items-center justify-center rounded-sm bg-gold px-5 py-3 font-display text-xs uppercase tracking-[0.18em] text-ink transition-colors hover:bg-gold-bright"
            >
              Checkout
            </Link>
            <button
              type="button"
              onClick={close}
              className="mt-2 w-full py-2 text-center text-xs uppercase tracking-[0.14em] text-muted hover:text-parchment"
            >
              Continue shopping
            </button>
          </footer>
        )}
      </aside>
    </>
  );
}
