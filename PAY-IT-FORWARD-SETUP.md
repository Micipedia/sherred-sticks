# Pay It Forward — setup & go-live

An optional way for customers to chip in toward a handmade stick that Sherred & Sons
**gives away, free**, to someone who can't afford one. Sticks are handed out through
a **free monthly draw** (no payment to enter) open to anyone in financial hardship,
run on Steve's Facebook page.

It appears in two places, both feeding **one shared pool** and **one public tally**:

1. an optional add-on at **checkout** (preset £5 / £10 / £20 + custom, nothing
   pre-selected), and
2. a standalone **/pay-it-forward** page with a "Chip in" box and the live tally, for
   people who just want to give.

Everything stays hidden on the live shop until it's switched on (`enabled: true` in
`src/lib/pay-it-forward.ts`), so there's never a dead box or a tally that goes nowhere.

---

## The framing rules (important — don't undo these)

Sherred & Sons is a **UK sole trader, not a registered charity**. So the copy is
deliberately written as a **commercial goodwill programme**, never a charity
collection. Keep it that way:

- **Never** call it a "donation to charity", "charitable donation", "tax-deductible",
  "Gift Aid", or "non-profit". It isn't, and implying it would mislead customers and
  pull the arrangement into charity-registration territory.
- It's the **customer helping Steve make and give away his own sticks, at his
  discretion** — that commercial nexus is what keeps it on the right side of the line.
- The draw is a **free prize draw**: entry must stay genuinely free (no payment to
  register). Contributors are **not** entrants and never "win" anything — never blur
  the two (e.g. no "chip in for a chance to win").
- The contribution is **strictly opt-in** — never pre-ticked or defaulted to a
  non-zero amount (a pre-selected charge is unlawful in the UK).
- Money received is **taxable business income** — Steve declares it; he can offset
  the real materials/making cost of the gifted sticks. If the programme ever scales
  past a few thousand £/year, have his accountant (and, if needed, a charity-law
  solicitor) confirm the treatment.

---

## What's built

Site (Next.js):
- `src/lib/pay-it-forward.ts` — config + the `enabled` gate.
- `src/components/ContributionPicker.tsx` — shared amount picker (presets + custom).
- `src/components/PayItForwardTally.tsx` — the live "toward the next stick" bar.
- `src/components/ContributeBox.tsx` — standalone chip-in widget (tally + picker + button).
- `src/app/pay-it-forward/page.tsx` — the page (how it works, the draw, disclosures).
- `src/app/checkout/page.tsx` — the optional add-on section + a "Pay It Forward" total line.
- `src/components/Footer.tsx` — a "Pay it forward" link (shows only when enabled).

Backend (the existing checkout Worker, `worker/`):
- `POST /` — now also accepts `contributionCents`; adds a contribution line item to
  a normal order, OR creates a **contribution-only** session (no shipping/address).
- `POST /webhook` — Stripe events → updates the KV tally.
- `GET /tally` — public tally the site renders.
- `worker/wrangler.toml` — `UNIT_CENTS` var + `TALLY` KV binding.

---

## Go-live steps (order matters)

You need fresh **Cloudflare access to Steve's account** for steps 2–4 (his Global API
key was rolled on 2026-07-07). And Steve needs to add the Stripe webhook (step 4).

1. **Set the target.** Decide the honest cost of making one gifted stick (materials +
   a fair slice of time). Put it in `worker/wrangler.toml` as `UNIT_CENTS` (pence,
   e.g. `4000` = £40).

2. **Create the KV store** and paste its id into `worker/wrangler.toml`:
   ```
   npx wrangler kv namespace create TALLY
   # → copy the returned id into [[kv_namespaces]] id = "..."
   ```

3. **Deploy the Worker** (STRIPE_SECRET_KEY is already set from checkout):
   ```
   cd worker && npx wrangler deploy
   ```

4. **Add the Stripe webhook** (Steve's Stripe dashboard → Developers → Webhooks →
   Add endpoint):
   - Endpoint URL: `https://sherred-checkout.sherred-sons.workers.dev/webhook`
   - Events: `checkout.session.completed` and `charge.refunded`
   - Copy the **Signing secret** (`whsec_…`) and set it on the Worker:
     ```
     cd worker && npx wrangler secret put STRIPE_WEBHOOK_SECRET
     ```

5. **Set the draw link.** Put Steve's Facebook draw-registration URL in
   `src/lib/pay-it-forward.ts` (`registerUrl`).

6. **Test end-to-end** (before flipping it on):
   - Hit `https://sherred-checkout.sherred-sons.workers.dev/tally` → should return
     JSON with your `unitCents`.
   - Temporarily set `enabled: true` locally, run the site, make a small **real**
     contribution-only payment, confirm you land on the thank-you and that `/tally`
     went up. Confirm the checkout add-on also works on a normal order.

7. **Switch it on.** Set `enabled: true` in `src/lib/pay-it-forward.ts`, commit, push.
   The checkout add-on, the `/pay-it-forward` page widget, the footer link, and the
   live tally all light up.

8. **Nice-to-haves at launch:**
   - Seed the first stick yourself so the bar opens with some momentum (an empty
     £0 bar for weeks reads as sad).
   - Remove the hardcoded "Preview site — no orders taken yet" footer banner
     (`src/components/Footer.tsx`) when the shop opens for real.
   - Post the draw + a photo when each gifted stick goes out — that visible
     follow-through is what makes the tally trustworthy.

---

## Notes / limitations

- **Deploy the Worker BEFORE flipping `enabled`.** If the site starts sending
  `contributionCents` to an old Worker, it's ignored silently (no crash, but the
  contribution is dropped).
- The tally is **derived** from two gross counters (`raised_total`, `refunded_total`)
  plus `UNIT_CENTS`, so changing the target re-derives the display with no migration.
- Only **fully** refunded charges are netted out of the tally; partial refunds are
  left to Steve's own bookkeeping.
- KV read-modify-write isn't atomic — at this shop's volume a collision is
  vanishingly unlikely, but it's the reason to reconcile against Stripe if a number
  ever looks off. Stripe's own dashboard (filter payments by the "Pay It Forward"
  line, or sum the `contribution_cents` metadata) is the source of truth.
