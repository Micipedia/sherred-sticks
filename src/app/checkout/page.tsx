"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { asset } from "@/lib/asset";
import { formatPrice } from "@/lib/product-helpers";
import { COUNTRIES, shippingCentsForCountry, shippingLabelForCountry } from "@/lib/shipping";
import { btnGhost, btnPrimary } from "@/lib/ui";
import { PAY_IT_FORWARD_SLUG } from "@/lib/pay-it-forward";

const CHECKOUT_URL = process.env.NEXT_PUBLIC_CHECKOUT_URL;

export default function CheckoutPage() {
  const { lines, subtotalCents, count, hydrated } = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [country, setCountry] = useState("GB");

  // A Pay It Forward contribution rides in the basket as a special line. Peel it
  // out: real sticks go to the Worker as items (trusted prices), the contribution
  // goes as its own bounds-checked amount, and shipping only applies to sticks.
  const pifLine = lines.find((l) => l.slug === PAY_IT_FORWARD_SLUG);
  const stickLines = lines.filter((l) => l.slug !== PAY_IT_FORWARD_SLUG);
  const contributionCents = pifLine?.priceCents ?? 0;
  const hasSticks = stickLines.length > 0;

  const deliveryCents = hasSticks ? shippingCentsForCountry(country) : 0;
  const totalCents = subtotalCents + deliveryCents;

  async function pay() {
    if (!CHECKOUT_URL) {
      setError("Checkout isn't quite ready yet. Please try again soon.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(CHECKOUT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: stickLines.map((l) => ({ slug: l.slug, qty: l.qty })),
          country,
          contributionCents,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Something went wrong.");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setBusy(false);
    }
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
        <p className="mt-4 text-muted">Add a stick — or a Pay It Forward gift — and come back.</p>
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
        {/* Order summary */}
        <ul className="divide-y divide-line rounded-sm border border-line">
          {lines.map((l) => {
            const isPif = l.slug === PAY_IT_FORWARD_SLUG;
            return (
              <li key={l.slug} className="flex items-center gap-4 p-4">
                <div className="h-20 w-16 shrink-0 overflow-hidden rounded-sm border border-line bg-ink">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset(l.image)}
                    alt={l.name}
                    className={`h-full w-full ${isPif ? "object-contain p-2" : "object-cover"}`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-parchment">{l.name}</p>
                  <p className="text-sm text-muted">
                    {isPif ? "Gift toward a stick for someone in need" : `Qty ${l.qty}`}
                  </p>
                </div>
                <span className="tabular-nums text-gold">
                  {formatPrice(l.priceCents * l.qty)}
                </span>
              </li>
            );
          })}
        </ul>

        {/* Destination — only when there are sticks to post. */}
        {hasSticks && (
          <div className="mt-6 border-t border-line pt-6">
            <label
              htmlFor="ship-country"
              className="block font-display text-sm uppercase tracking-[0.12em] text-parchment"
            >
              Shipping to
            </label>
            <select
              id="ship-country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="mt-2 w-full rounded-sm border border-line bg-ink px-3 py-2 text-parchment focus:border-gold focus:outline-none"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-muted">
              Sticks post from Wiltshire, England. Delivery is a flat rate per order for your
              destination; you&apos;ll confirm your address on the secure payment page.
            </p>
          </div>
        )}

        {/* Totals */}
        <dl className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-parchment">
            <dt>Subtotal ({count})</dt>
            <dd className="tabular-nums text-gold">{formatPrice(subtotalCents)}</dd>
          </div>
          {hasSticks && (
            <div className="flex items-center justify-between text-parchment">
              <dt>{shippingLabelForCountry(country)}</dt>
              <dd className="tabular-nums text-gold">{formatPrice(deliveryCents)}</dd>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-line pt-3">
            <dt className="font-display text-lg uppercase tracking-[0.12em] text-parchment">
              Total
            </dt>
            <dd className="text-2xl tabular-nums text-gold">{formatPrice(totalCents)}</dd>
          </div>
        </dl>

        {error && (
          <p className="mt-6 rounded-sm border border-oxblood/50 bg-oxblood/10 p-3 text-sm text-oxblood">
            {error}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row-reverse">
          <button
            type="button"
            onClick={pay}
            disabled={busy}
            className={`${btnPrimary} flex-1 disabled:opacity-60`}
          >
            {busy ? "Starting secure checkout…" : "Pay securely"}
          </button>
          <Link href="/shop" className={`${btnGhost} flex-1`}>
            Continue shopping
          </Link>
        </div>

        <p className="mt-4 text-center text-xs text-muted">
          You&apos;ll be taken to a secure payment page powered by Stripe.
        </p>
      </div>
    </div>
  );
}
