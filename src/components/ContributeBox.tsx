"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ContributionPicker from "./ContributionPicker";
import PayItForwardTally from "./PayItForwardTally";
import { IconCheck } from "./Icons";
import { useCart } from "./CartProvider";
import { payItForward } from "@/lib/pay-it-forward";
import { formatPrice } from "@/lib/product-helpers";
import { btnPrimary } from "@/lib/ui";

// Pick an amount and add a Pay It Forward contribution to the basket. It then
// flows through the normal checkout — on its own (a contribution-only order) or
// alongside sticks. The live tally sits above the picker.

export default function ContributeBox() {
  const { setContribution, open } = useCart();
  const [cents, setCents] = useState(0);
  const [added, setAdded] = useState(false);
  const [thanks, setThanks] = useState(false);

  // If Stripe sent the giver back here after a successful contribution-only order
  // (success_url carries ?thanks=1), show a thank-you note.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (new URLSearchParams(window.location.search).get("thanks") === "1") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setThanks(true);
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  if (!payItForward.enabled) {
    return (
      <div className="rounded-sm border border-line bg-ink p-6 text-center text-muted">
        Pay It Forward is temporarily unavailable.
      </div>
    );
  }

  function addToBasket() {
    if (cents < payItForward.minCents) return;
    setContribution(cents); // sets the basket's Pay It Forward line to this amount
    setAdded(true);
    open(); // reveal the basket so they see it added
  }

  return (
    <div className="space-y-5">
      {thanks && (
        <div className="flex items-center gap-3 rounded-sm border border-gold/40 bg-gold/5 p-4 text-parchment">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold text-gold">
            <IconCheck className="h-5 w-5" />
          </span>
          <p className="text-sm">
            Thank you for chipping in — every penny goes toward a stick for someone
            who needs one.
          </p>
        </div>
      )}

      <PayItForwardTally />

      <div className="rounded-sm border border-line bg-ink-2 p-6">
        <h3 className="font-display text-lg text-parchment">Choose an amount</h3>
        <p className="mt-1 text-sm text-muted">
          Add a contribution to your basket, then check out — on its own, or
          alongside a stick.
        </p>
        <div className="mt-4">
          <ContributionPicker
            valueCents={cents}
            onChange={(c) => {
              setCents(c);
              setAdded(false);
            }}
            idPrefix="pif-page"
          />
        </div>

        <button
          type="button"
          onClick={addToBasket}
          disabled={cents < payItForward.minCents}
          className={`${btnPrimary} mt-5 w-full disabled:opacity-50`}
        >
          {cents > 0 ? `Add ${formatPrice(cents)} to basket` : "Choose an amount"}
        </button>

        {added && cents >= payItForward.minCents && (
          <p className="mt-3 text-center text-sm text-parchment">
            Added to your basket.{" "}
            <Link href="/checkout" className="text-gold underline hover:text-gold-bright">
              Go to checkout
            </Link>
          </p>
        )}

        <p className="mt-3 text-center text-xs text-muted">
          Sherred &amp; Sons is a small family workshop, not a registered charity,
          so this isn&apos;t a tax-deductible donation. Every penny goes toward
          sticks we give away.
        </p>
      </div>
    </div>
  );
}
