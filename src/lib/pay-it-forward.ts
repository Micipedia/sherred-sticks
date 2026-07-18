/**
 * "Pay It Forward" configuration.
 *
 * A customer can chip in a little — at checkout, or on the /pay-it-forward page —
 * toward a handmade stick we GIVE, free, to someone who can't afford one. The
 * gifted sticks are handed out through a FREE monthly draw (no payment to enter)
 * open to anyone in financial hardship, run on Steve's Facebook page.
 *
 * IMPORTANT framing (kept deliberately out of "charity" language): Sherred & Sons
 * is a sole trader, NOT a registered charity. So this is a commercial goodwill
 * programme — the money helps Steve make and give away his OWN sticks, at his
 * discretion. It is NOT a charitable donation, is NOT tax-deductible, and there is
 * no Gift Aid. The copy on the page and checkout must say so. (See the research
 * notes in PAY-IT-FORWARD-SETUP.md for why.)
 *
 * The contribution rides the SAME checkout Worker (worker/) as a normal order:
 *  - at checkout it's added as an extra line item on the order's Stripe session,
 *  - on its own it creates a contribution-only Stripe session (no shipping/address).
 * The running tally is served by that Worker's GET /tally endpoint, fed by a Stripe
 * webhook the Worker also handles. The honest cost of one gifted stick (the tally
 * target) lives on the Worker as UNIT_CENTS — the site just renders what /tally
 * returns, so page and Worker can never drift.
 *
 * Everything stays HIDDEN until `enabled` is true, so the live shop never shows a
 * contribute box or tally that goes nowhere. Go-live order matters — deploy the
 * Worker (with the webhook + KV) FIRST, then flip `enabled`. See
 * PAY-IT-FORWARD-SETUP.md.
 */
const CHECKOUT_URL = process.env.NEXT_PUBLIC_CHECKOUT_URL ?? "";

export const payItForward = {
  // LIVE 2026-07-18 — Worker (webhook + KV tally) deployed and verified end-to-end.
  enabled: true,

  // The checkout Worker. Contribution-only sessions POST here; the tally is read
  // from `${endpoint}/tally`. Same Worker the basket already posts to.
  endpoint: CHECKOUT_URL,
  tallyEndpoint: CHECKOUT_URL ? `${CHECKOUT_URL.replace(/\/$/, "")}/tally` : "",

  // Suggested amounts (in pence). Nothing is ever pre-selected — a contribution is
  // strictly opt-in (a pre-ticked charge is unlawful under UK Reg 40 of the
  // Consumer Contracts Regs 2013), and a customer can always add nothing.
  presetsCents: [500, 1000, 2000],

  // Guard rails, mirrored server-side in the Worker (which is the real authority).
  minCents: 100, // £1 — also keeps a contribution-only order above Stripe's £0.30 floor
  maxCents: 100000, // £1,000

  // Where people in financial hardship register for the FREE monthly draw. Steve
  // runs this on his Facebook page — paste the post/page link here. While empty,
  // the page shows a "draw opens for registration soon" note instead of a button.
  registerUrl: "",
} as const;

export type PayItForward = typeof payItForward;

// Reserved cart-line slug for a Pay It Forward contribution. It is NOT a real
// product (never in store.json) — the checkout peels this line out of the basket
// and sends its amount to the Worker as the contribution, so it's bounds-checked
// rather than price-looked-up. Keep this in sync with the Worker's contribution
// handling.
export const PAY_IT_FORWARD_SLUG = "pay-it-forward";
