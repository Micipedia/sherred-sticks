"use client";

import { useState } from "react";
import { payItForward } from "@/lib/pay-it-forward";
import { formatPrice } from "@/lib/product-helpers";

// Shared amount picker for Pay It Forward — preset chips plus a custom field.
// Controlled: the parent owns the chosen amount (in pence) so the checkout page
// and the standalone /pay-it-forward box can both reuse it.
//
// Nothing is selected by default (value 0 = "no contribution"). This is deliberate:
// the contribution must be genuinely opt-in — a pre-selected/pre-ticked charge is
// both a dark pattern and unlawful in the UK.

export default function ContributionPicker({
  valueCents,
  onChange,
  idPrefix = "pif",
}: {
  valueCents: number;
  onChange: (cents: number) => void;
  idPrefix?: string;
}) {
  const [customText, setCustomText] = useState("");
  const presets: readonly number[] = payItForward.presetsCents;
  const activePreset = presets.includes(valueCents) && customText === "";

  function pickPreset(cents: number) {
    setCustomText("");
    // Click the active chip again to clear (back to "no contribution").
    onChange(valueCents === cents && customText === "" ? 0 : cents);
  }

  function onCustom(text: string) {
    const cleaned = text.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
    setCustomText(cleaned);
    const pounds = parseFloat(cleaned);
    if (!isFinite(pounds) || pounds <= 0) {
      onChange(0);
      return;
    }
    onChange(Math.min(Math.round(pounds * 100), payItForward.maxCents));
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {presets.map((cents) => {
          const active = activePreset && valueCents === cents;
          return (
            <button
              key={cents}
              type="button"
              onClick={() => pickPreset(cents)}
              aria-pressed={active}
              className={`lift rounded-sm border px-3 py-3 text-center font-display text-sm tabular-nums ${
                active
                  ? "border-gold bg-gold/10 text-parchment"
                  : "border-line bg-ink text-parchment-dim hover:border-gold/50"
              }`}
            >
              {formatPrice(cents)}
            </button>
          );
        })}
        <div className="col-span-3 sm:col-span-1">
          <label htmlFor={`${idPrefix}-custom`} className="sr-only">
            Other amount in pounds
          </label>
          <div
            className={`flex items-center rounded-sm border bg-ink px-3 py-3 ${
              customText !== "" && valueCents > 0 ? "border-gold" : "border-line"
            }`}
          >
            <span className="mr-1 text-muted">£</span>
            <input
              id={`${idPrefix}-custom`}
              type="text"
              inputMode="decimal"
              placeholder="Other"
              value={customText}
              onChange={(e) => onCustom(e.target.value)}
              className="w-full min-w-0 bg-transparent text-parchment placeholder:text-muted/60 focus:outline-none"
            />
          </div>
        </div>
      </div>
      <p className="mt-2 text-xs text-muted">
        Any amount from {formatPrice(payItForward.minCents)} to{" "}
        {formatPrice(payItForward.maxCents)}. Add nothing at all and that&apos;s
        completely fine.
      </p>
    </div>
  );
}
