// Sherred & Sons — checkout backend (Cloudflare Worker).
//
// The static site has no server of its own, so this tiny Worker is the one piece
// that can talk to Stripe with the secret key. It does three jobs, by route:
//
//   POST /            Create a Stripe Checkout Session. The browser POSTs the
//                     basket (stick slugs + quantities) and/or a Pay It Forward
//                     contribution; the Worker looks up REAL prices from the site's
//                     own trusted price list (so a customer can't fake a price),
//                     builds the session, and returns its URL to redirect to.
//   POST /webhook     Receive Stripe events (checkout.session.completed,
//                     charge.refunded), verify the signature, and keep the running
//                     Pay It Forward tally in KV up to date.
//   GET  /tally       Return the public Pay It Forward tally for the site to render.
//
// Secrets:  wrangler secret put STRIPE_SECRET_KEY
//           wrangler secret put STRIPE_WEBHOOK_SECRET   (for /webhook)
// Config (wrangler.toml [vars]):  UNIT_CENTS  (honest cost of one gifted stick)
// State:  KV namespace bound as TALLY (see wrangler.toml)

const SITE = "https://sherredsticks.com";
const STORE_URL = `${SITE}/store.json`;
const SHIPPING_URL = `${SITE}/shipping.json`;

// Pay It Forward guard rails (pence). The site mirrors these for UX, but the Worker
// is the authority — never trust the amount the browser sends.
const CONTRIBUTION_MIN = 100; // £1 — also keeps a contribution-only order above Stripe's £0.30 floor
const CONTRIBUTION_MAX = 100000; // £1,000
// What the contribution shows as on the Stripe page / receipt. Deliberately NOT
// "donation" (Sherred & Sons is a sole trader, not a registered charity).
const CONTRIBUTION_LABEL = "Pay It Forward — gift a stick to someone who can't afford one";

const ALLOWED_ORIGINS = new Set([
  "https://sherredsticks.com",
  "https://www.sherredsticks.com",
  "http://localhost:3000", // local dev
]);

function corsFor(request) {
  const origin = request.headers.get("Origin") || "";
  const allow = ALLOWED_ORIGINS.has(origin) ? origin : SITE;
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

// Embedded copy of src/data/shipping.json — used only if /shipping.json can't be
// fetched (e.g. in the moments before the first site build publishes it). So a
// non-UK order is never blocked or silently charged £0. KEEP IN SYNC: if you edit
// a rate in src/data/shipping.json, mirror it here.
const SHIPPING_FALLBACK = {
  defaultZone: "ROW",
  zones: {
    UK: { label: "UK delivery", rateCents: 1200 },
    EU: { label: "Delivery to Europe", rateCents: 2400 },
    US_CA: { label: "Delivery to USA / Canada", rateCents: 4000 },
    AU_NZ: { label: "Delivery to Australia / NZ", rateCents: 5000 },
    ROW: { label: "Worldwide delivery", rateCents: 5000 },
  },
  countryZone: {
    GB: "UK", GG: "UK", JE: "UK", IM: "UK",
    IE: "EU", FR: "EU", DE: "EU", ES: "EU", IT: "EU", PT: "EU", NL: "EU",
    BE: "EU", LU: "EU", AT: "EU", DK: "EU", SE: "EU", FI: "EU", NO: "EU",
    IS: "EU", CH: "EU", PL: "EU", CZ: "EU", SK: "EU", HU: "EU", SI: "EU",
    HR: "EU", RO: "EU", BG: "EU", GR: "EU", EE: "EU", LV: "EU", LT: "EU",
    CY: "EU", MT: "EU", LI: "EU", MC: "EU", AD: "EU", SM: "EU", VA: "EU",
    GI: "EU",
    US: "US_CA", CA: "US_CA",
    AU: "AU_NZ", NZ: "AU_NZ",
  },
};

export default {
  async fetch(request, env) {
    const cors = corsFor(request);
    const json = (body, status = 200) =>
      new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json", ...cors },
      });

    const path = new URL(request.url).pathname.replace(/\/+$/, "") || "/";

    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method === "GET" && path === "/tally") return json(await readTally(env));
    // Stripe -> Worker; not a browser call, so it doesn't use CORS.
    if (request.method === "POST" && path === "/webhook") return handleWebhook(request, env);
    if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

    return createSession(request, env, json);
  },
};

// ── Create a Stripe Checkout Session ──────────────────────────────────────────
async function createSession(request, env, json) {
  if (!env.STRIPE_SECRET_KEY) return json({ error: "Payments are not set up yet." }, 503);

  let items, country, contributionCents;
  try {
    ({ items, country, contributionCents } = await request.json());
  } catch {
    return json({ error: "Bad request" }, 400);
  }
  items = Array.isArray(items) ? items : [];

  // Validate the Pay It Forward contribution (browser-supplied — never trusted).
  let contribution = Number(contributionCents);
  if (!Number.isInteger(contribution) || contribution < 0) contribution = 0;
  if (contribution > 0 && (contribution < CONTRIBUTION_MIN || contribution > CONTRIBUTION_MAX)) {
    return json({ error: "Please choose a Pay It Forward amount between £1 and £1,000." }, 400);
  }

  if (items.length === 0 && contribution === 0) return json({ error: "Your basket is empty." }, 400);

  const params = new URLSearchParams();
  params.set("mode", "payment");

  const lineItems = [];

  if (items.length > 0) {
    // ── A real order: validate items, add postage, collect a shipping address ──
    country = String(country || "GB").toUpperCase();
    if (!/^[A-Z]{2}$/.test(country)) country = "GB";

    // Trusted prices straight from the site (never trust prices sent by the browser).
    let store;
    try {
      const res = await fetch(STORE_URL, { cf: { cacheTtl: 0 } });
      store = await res.json();
    } catch {
      return json({ error: "Could not load the shop right now. Please try again." }, 502);
    }
    const bySlug = Object.fromEntries(store.map((p) => [p.slug, p]));

    // Postage: prefer the live table from the site (single source of truth, edited
    // in src/data/shipping.json and shared with the checkout page so shown price ==
    // charged price), falling back to the embedded copy if it can't be fetched.
    let shipping = SHIPPING_FALLBACK;
    try {
      const shRes = await fetch(SHIPPING_URL, { cf: { cacheTtl: 0 } });
      if (shRes.ok) {
        const j = await shRes.json();
        if (j?.zones && j?.countryZone) shipping = j;
      }
    } catch {
      /* keep the embedded fallback */
    }

    const zone = shipping.countryZone[country] || shipping.defaultZone;
    const rate = shipping.zones[zone];
    if (!rate) return json({ error: "Sorry — we can't work out delivery for that destination." }, 400);

    for (const it of items) {
      const p = bySlug[it?.slug];
      if (!p) return json({ error: "One of your items is no longer available." }, 409);
      if (p.sold) return json({ error: `"${p.name}" has just sold.` }, 409);
      if (!p.priceCents || p.priceCents < 30) return json({ error: `"${p.name}" isn't priced for sale yet.` }, 409);
      const qty = Math.max(1, Math.min(10, Number(it.qty) || 1));
      lineItems.push({ name: p.name, amount: p.priceCents, image: p.image ? SITE + p.image : null, qty });
    }

    params.set("success_url", `${SITE}/thank-you/?session_id={CHECKOUT_SESSION_ID}`);
    params.set("cancel_url", `${SITE}/checkout/`);
    params.set("shipping_address_collection[allowed_countries][0]", country);
    params.set("phone_number_collection[enabled]", "true");
    // Single shipping option = the destination zone's flat rate. (Stripe shows every
    // option to every buyer regardless of address, so we pass exactly one — the
    // correct one for the country they chose — and lock the address to it.)
    const s = "shipping_options[0][shipping_rate_data]";
    params.set(`${s}[type]`, "fixed_amount");
    params.set(`${s}[display_name]`, rate.label);
    params.set(`${s}[fixed_amount][amount]`, String(rate.rateCents));
    params.set(`${s}[fixed_amount][currency]`, "gbp");
  } else {
    // ── Contribution only: no goods, so no shipping and no address collection. ──
    params.set("success_url", `${SITE}/pay-it-forward/?thanks=1&session_id={CHECKOUT_SESSION_ID}`);
    params.set("cancel_url", `${SITE}/pay-it-forward/`);
  }

  // Append the Pay It Forward contribution as its own line item + stamp the amount
  // into session AND payment-intent metadata so the tally webhook and Steve's
  // reconciliation can both read it reliably.
  if (contribution > 0) {
    lineItems.push({ name: CONTRIBUTION_LABEL, amount: contribution, image: null, qty: 1 });
    params.set("metadata[contribution_cents]", String(contribution));
    params.set("payment_intent_data[metadata][contribution_cents]", String(contribution));
  }

  lineItems.forEach((it, i) => {
    const b = `line_items[${i}]`;
    params.set(`${b}[price_data][currency]`, "gbp");
    params.set(`${b}[price_data][product_data][name]`, it.name);
    if (it.image) params.set(`${b}[price_data][product_data][images][0]`, it.image);
    params.set(`${b}[price_data][unit_amount]`, String(it.amount));
    params.set(`${b}[quantity]`, String(it.qty));
  });

  let session;
  try {
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    session = await res.json();
    if (!res.ok) throw new Error(session?.error?.message || "Stripe error");
  } catch {
    return json({ error: "Sorry — checkout couldn't start. Please try again." }, 502);
  }

  return json({ url: session.url });
}

// ── Stripe webhook → keep the Pay It Forward tally in KV ───────────────────────
async function handleWebhook(request, env) {
  const sig = request.headers.get("stripe-signature") || "";
  const payload = await request.text();

  if (!env.STRIPE_WEBHOOK_SECRET) return new Response("webhook not configured", { status: 503 });
  if (!(await verifyStripeSignature(payload, sig, env.STRIPE_WEBHOOK_SECRET))) {
    return new Response("bad signature", { status: 400 });
  }

  let event;
  try {
    event = JSON.parse(payload);
  } catch {
    return new Response("bad json", { status: 400 });
  }

  // No tally store bound yet → acknowledge so Stripe doesn't retry forever.
  if (!env.TALLY) return new Response("ok (no tally store)", { status: 200 });

  try {
    if (event.type === "checkout.session.completed") {
      const s = event.data.object;
      const cents = Number(s?.metadata?.contribution_cents || 0);
      if (cents > 0 && s.payment_status === "paid") {
        await addOnce(env, `seen:sess:${s.id}`, "raised_total", cents);
      }
    } else if (event.type === "charge.refunded") {
      // Only net out a FULLY refunded charge (partial refunds are left to Steve's
      // own bookkeeping). Read the contribution amount from the PaymentIntent.
      const ch = event.data.object;
      if (ch.refunded === true && ch.payment_intent) {
        const cents = await contributionFromPI(env, ch.payment_intent);
        if (cents > 0) await addOnce(env, `seen:refund:${ch.id}`, "refunded_total", cents);
      }
    }
  } catch {
    // Never hard-fail the webhook on our own bookkeeping error — Stripe would retry
    // it forever. Acknowledge; the number can be reconciled from Stripe if needed.
    return new Response("ok (noted error)", { status: 200 });
  }

  return new Response("ok", { status: 200 });
}

// Idempotent counter add: Stripe can deliver an event more than once, so we only
// apply each (session/refund) once, guarded by a marker key. KV read-modify-write
// isn't atomic, but at this shop's volume a collision is vanishingly unlikely.
async function addOnce(env, markerKey, counterKey, cents) {
  if (await env.TALLY.get(markerKey)) return;
  const cur = Number(await env.TALLY.get(counterKey)) || 0;
  await env.TALLY.put(counterKey, String(cur + cents));
  await env.TALLY.put(markerKey, "1"); // permanent marker (no expiry)
}

async function contributionFromPI(env, piId) {
  if (!env.STRIPE_SECRET_KEY) return 0;
  try {
    const res = await fetch(`https://api.stripe.com/v1/payment_intents/${piId}`, {
      headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}` },
    });
    if (!res.ok) return 0;
    const pi = await res.json();
    return Number(pi?.metadata?.contribution_cents || 0);
  } catch {
    return 0;
  }
}

// ── Public tally ──────────────────────────────────────────────────────────────
// Derives everything from two gross counters + the unit cost, so it's always
// self-consistent: giftedCount = full sticks the NET contributions have funded,
// raisedCents = progress toward the next one (the remainder carries over, so a
// funded stick doesn't reset the bar to a flat zero and lose the overflow).
async function readTally(env) {
  const unit = Number(env.UNIT_CENTS) || 0;
  if (!env.TALLY || !unit) {
    return { raisedCents: 0, unitCents: unit, giftedCount: 0, netRaisedCents: 0 };
  }
  const raised = Number(await env.TALLY.get("raised_total")) || 0;
  const refunded = Number(await env.TALLY.get("refunded_total")) || 0;
  const net = Math.max(0, raised - refunded);
  const giftedCount = Math.floor(net / unit);
  return {
    raisedCents: net - giftedCount * unit,
    unitCents: unit,
    giftedCount,
    netRaisedCents: net,
  };
}

// ── Stripe signature verification (Web Crypto — no Node SDK in Workers) ─────────
async function verifyStripeSignature(payload, header, secret) {
  const parts = header.split(",").map((s) => s.trim());
  let t;
  const v1s = [];
  for (const p of parts) {
    const i = p.indexOf("=");
    if (i < 0) continue;
    const k = p.slice(0, i);
    const v = p.slice(i + 1);
    if (k === "t") t = v;
    else if (k === "v1") v1s.push(v);
  }
  if (!t || v1s.length === 0) return false;
  // 5-minute tolerance to blunt replay of a captured payload.
  if (Math.abs(Math.floor(Date.now() / 1000) - Number(t)) > 300) return false;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const mac = await crypto.subtle.sign("HMAC", key, enc.encode(`${t}.${payload}`));
  const expected = [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return v1s.some((v) => timingSafeEqual(v, expected));
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}
