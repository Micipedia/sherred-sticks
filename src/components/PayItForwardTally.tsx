"use client";

import { useEffect, useState } from "react";
import { payItForward } from "@/lib/pay-it-forward";
import { formatPrice } from "@/lib/product-helpers";

// The live "toward the next stick" tally. Reads the running total from the checkout
// Worker's GET /tally endpoint (fed by a Stripe webhook + KV), so it self-updates
// as contributions come in — Steve never has to touch a number.
//
// The Worker returns the honest target (unitCents) alongside the progress, so the
// bar and the page can't drift out of sync. `raisedCents` is progress toward the
// NEXT stick (the remainder carries over — funding one stick doesn't reset it to a
// flat zero and lose the overflow). `giftedCount` = how many full sticks the net
// contributions have funded so far.

type Tally = {
  raisedCents: number;
  unitCents: number;
  giftedCount: number;
};

export default function PayItForwardTally() {
  const [tally, setTally] = useState<Tally | null>(null);

  useEffect(() => {
    if (!payItForward.tallyEndpoint) return;
    let alive = true;
    fetch(payItForward.tallyEndpoint)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (alive && d && typeof d.unitCents === "number" && d.unitCents > 0) {
          setTally(d);
        }
      })
      .catch(() => {
        /* tally is a nicety — if it can't load, just show nothing */
      });
    return () => {
      alive = false;
    };
  }, []);

  if (!tally) return null;

  const pct = Math.max(
    0,
    Math.min(100, Math.round((tally.raisedCents / tally.unitCents) * 100))
  );

  return (
    <div className="rounded-sm border border-line bg-ink p-5">
      <div className="flex items-baseline justify-between">
        <span className="font-display text-sm uppercase tracking-[0.12em] text-parchment">
          Toward the next stick
        </span>
        <span className="tabular-nums text-gold">
          {formatPrice(tally.raisedCents)}{" "}
          <span className="text-muted">of {formatPrice(tally.unitCents)}</span>
        </span>
      </div>
      <div
        className="mt-3 h-2 w-full overflow-hidden rounded-full bg-line-soft"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progress toward the next gifted stick"
      >
        <div
          className="h-full rounded-full bg-gold transition-[width] duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      {tally.giftedCount > 0 && (
        <p className="mt-3 text-sm text-parchment-dim">
          Sticks funded so far:{" "}
          <span className="font-display text-gold">{tally.giftedCount}</span>
        </p>
      )}
    </div>
  );
}
