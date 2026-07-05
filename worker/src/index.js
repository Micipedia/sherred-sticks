// Sherred & Sons — checkout backend (Cloudflare Worker).
//
// The static site has no server of its own, so this tiny Worker is the one piece
// that can talk to Stripe with the secret key. The browser POSTs the basket
// (a list of stick slugs + quantities); the Worker looks up the REAL prices from
// the site's own trusted price list (so a customer can't fake a price), creates a
// Stripe Checkout Session, and returns its URL for the browser to redirect to.
//
// Secret set via `wrangler secret put STRIPE_SECRET_KEY` (or the dashboard).

const SITE = "https://sherredsticks.com";
const STORE_URL = `${SITE}/store.json`;
const ALLOWED_ORIGIN = SITE;

const cors = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
    if (!env.STRIPE_SECRET_KEY) return json({ error: "Payments are not set up yet." }, 503);

    let items;
    try {
      ({ items } = await request.json());
    } catch {
      return json({ error: "Bad request" }, 400);
    }
    if (!Array.isArray(items) || items.length === 0) return json({ error: "Your basket is empty." }, 400);

    // Trusted prices straight from the site (never trust prices sent by the browser).
    let store;
    try {
      const res = await fetch(STORE_URL, { cf: { cacheTtl: 0 } });
      store = await res.json();
    } catch {
      return json({ error: "Could not load the shop right now. Please try again." }, 502);
    }
    const bySlug = Object.fromEntries(store.map((p) => [p.slug, p]));

    const lineItems = [];
    for (const it of items) {
      const p = bySlug[it?.slug];
      if (!p) return json({ error: "One of your items is no longer available." }, 409);
      if (p.sold) return json({ error: `"${p.name}" has just sold.` }, 409);
      if (!p.priceCents || p.priceCents < 30) return json({ error: `"${p.name}" isn't priced for sale yet.` }, 409);
      const qty = Math.max(1, Math.min(10, Number(it.qty) || 1));
      lineItems.push({ name: p.name, amount: p.priceCents, image: p.image ? SITE + p.image : null, qty });
    }

    const params = new URLSearchParams();
    params.set("mode", "payment");
    params.set("success_url", `${SITE}/thank-you/?session_id={CHECKOUT_SESSION_ID}`);
    params.set("cancel_url", `${SITE}/checkout/`);
    params.set("shipping_address_collection[allowed_countries][0]", "GB");
    params.set("phone_number_collection[enabled]", "true");
    lineItems.forEach((it, i) => {
      const b = `line_items[${i}]`;
      params.set(`${b}[price_data][currency]`, "gbp");
      params.set(`${b}[price_data][product_data][name]`, it.name);
      if (it.image) params.set(`${b}[price_data][product_data][images][0]`, it.image);
      params.set(`${b}[price_data][unit_amount]`, String(it.amount));
      params.set(`${b}[quantity]`, String(it.qty));
    });
    const shippingCents = Number(env.SHIPPING_CENTS) || 0;
    if (shippingCents > 0) {
      const s = "shipping_options[0][shipping_rate_data]";
      params.set(`${s}[type]`, "fixed_amount");
      params.set(`${s}[display_name]`, "Delivery");
      params.set(`${s}[fixed_amount][amount]`, String(shippingCents));
      params.set(`${s}[fixed_amount][currency]`, "gbp");
    }

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
    } catch (e) {
      return json({ error: "Sorry — checkout couldn't start. Please try again." }, 502);
    }

    return json({ url: session.url });
  },
};
