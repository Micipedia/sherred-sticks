"use client";

import { useEffect, useState } from "react";
import ContributionPicker from "./ContributionPicker";
import PayItForwardTally from "./PayItForwardTally";
import { IconCheck } from "./Icons";
import { payItForward } from "@/lib/pay-it-forward";
import { formatPrice } from "@/lib/product-helpers";
import { btnPrimary } from "@/lib/ui";

// The standalone "chip in on its own" widget for the /pay-it-forward page — for
// people who just want to give toward the cause without buying a stick. It creates
// a contribution-only Stripe Checkout session via the same Worker (no shipping, no
// address), and shows the live tally above the amount picker.

type Status = "idle" | "busy" | "error";

export default function ContributeBox() {
  const [cents, setCents] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [thanks, setThanks] = useState(false);

  // If Stripe sent the giver back here after a successful contribution-only
  // payment (success_url carries ?thanks=1), show a thank-you note. This is a
  // genuine one-time, client-only read of an external system (the URL) that must
  // run post-hydration to avoid a mismatch with the prerendered HTML — the exact
  // case the set-state-in-effect lint rule doesn't cover.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (new URLSearchParams(window.location.search).get("thanks") === "1") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setThanks(true);
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  // Hidden until switched on (and the Worker endpoint is baked in), so the live
  // shop never shows a contribute box that goes nowhere.
  if (!payItForward.enabled || !payItForward.endpoint) {
    return (
      <div className="rounded-sm border border-line bg-ink p-6 text-center text-muted">
        Pay It Forward opens when the shop launches.
      </div>
    );
  }

  async function contribute() {
    if (cents < payItForward.minCents) {
      setError(`Please choose at least ${formatPrice(payItForward.minCents)}.`);
      setStatus("error");
      return;
    }
    setStatus("busy");
    setError("");
    try {
      const res = await fetch(payItForward.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contributionCents: cents }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Something went wrong.");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
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
        <h3 className="font-display text-lg text-parchment">Chip in</h3>
        <p className="mt-1 text-sm text-muted">
          Give any amount toward the next stick. You&apos;ll go to a secure Stripe
          page — no stick added to your basket.
        </p>
        <div className="mt-4">
          <ContributionPicker valueCents={cents} onChange={setCents} idPrefix="pif-page" />
        </div>

        {status === "error" && (
          <p className="mt-3 text-sm text-[#e79a9a]">{error}</p>
        )}

        <button
          type="button"
          onClick={contribute}
          disabled={status === "busy" || cents < payItForward.minCents}
          className={`${btnPrimary} mt-5 w-full disabled:opacity-50`}
        >
          {status === "busy"
            ? "Starting secure checkout…"
            : cents > 0
              ? `Chip in ${formatPrice(cents)}`
              : "Choose an amount"}
        </button>

        <p className="mt-3 text-center text-xs text-muted">
          Sherred &amp; Sons is a small family workshop, not a registered charity,
          so this isn&apos;t a tax-deductible donation. Every penny goes toward
          sticks we give away.
        </p>
      </div>
    </div>
  );
}
