# Sherred & Sons — Walking Sticks

A storefront for **Sherred & Sons Walking Sticks** — handmade walking sticks,
traditional Irish blackthorn shillelaghs, dinner canes and support sticks.

> ⚠️ **This is an early preview.** Every product on the site is a **sample**
> (with a drawn illustration, not a real photo) so the look and feel can be
> reviewed before launch. No payments are taken and no orders are placed yet.

**Live preview:** https://micipedia.github.io/sherred-sticks/

---

## What it looks like

- Dark, traditional, Celtic-flavoured theme (aged charcoal, Celtic gold, a
  triquetra mark and divider).
- Four categories: **Hiking**, **Dinner**, **Aid**, and **Robust & Traditional**.
- Home page, per-category pages, product pages, a working basket, and a
  demo checkout.
- Prices in **GBP (£)**.

## Tech

- [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Static export (`output: "export"`) — no server required, hosts anywhere
- Deployed automatically to GitHub Pages via `.github/workflows/deploy.yml`

## Run it on your own machine

```bash
npm install
npm run dev
# open http://localhost:3000
```

Build the static site (output lands in `out/`):

```bash
npm run build
```

## Where the content lives

Everything a shopkeeper would change is in one file:

- **Products & categories:** `src/lib/products.ts`
  (name, price in pence, wood, handle style, description, which are "featured").
- **Colours & fonts:** `src/app/globals.css` (the `@theme` block at the top).
- **Page wording:** `src/app/*/page.tsx` (home, about, contact, etc.).

The sample stick pictures are drawn from the wood colour + handle style by
`src/lib/stick-svg.ts`. To preview them as an image: `node qa/render.mjs`.

## The road to a real shop

The site is built so the pieces slot in without a rewrite:

1. **Domain** — register `sherredsticks.com` (keep it in the shop owner's own
   account for ownership).
2. **Payments** — create a **Stripe** account *in the shop owner's name* (that
   is where the money lands). Products, prices, photos, stock and orders are all
   managed from the Stripe dashboard — no code needed to add a stick.
3. **Swap sample data → Stripe** — replace the static `products.ts` with a read
   from the Stripe catalogue, and switch the demo checkout to real Stripe
   Checkout (this needs a small server, so we move hosting off static Pages at
   that point).
4. **Photography** — swap the drawn illustrations for real product photos.

---

Built as a favour, mate. 🍀
