# Mailing list — setup & go-live

The mailing list lets people subscribe from the website and choose how often they
hear from us: **every new stick**, a **weekly** round-up, or a **monthly** round-up.

It runs on **Brevo** (free tier). Brevo stores the subscribers, sends the
confirmation email, handles unsubscribe, and does the actual sending. The website
just shows the sign-up form and publishes a feed of the sticks; there is no server
and no secret key on the site.

---

## What's already built (in this repo)

- **`/feed.xml`** — an RSS feed of every stick, newest first, generated on each
  deploy by `scripts/emit-feed.mjs`. This is what Brevo watches to know a new
  stick has been listed. Each stick keeps a fixed publish date (its first-added
  date), so rebuilding the site never re-announces old sticks.
- **The sign-up form** — a site-wide "Join the list" band (component
  `src/components/NewsletterSignup.tsx`). It is **hidden** until Brevo is wired
  up, so the live shop never shows a form that goes nowhere.
- **`src/lib/newsletter.ts`** — the one file you edit to switch the form on.

## What still needs doing (Brevo dashboard — ~30–40 min, one time)

You need a Brevo account to finish. Everything below is done once.

### 1. Create the Brevo account
Sign up free at brevo.com. Use Steve's business identity — **Steve is the sender
and the data controller**, so the account, the "from" name, and the postal
address in the emails should be his.

### 2. Create the three frequency buckets
Two ways to model "every new stick / weekly / monthly" — pick one:

- **Simplest: three lists** named `New stick`, `Weekly`, `Monthly`. The sign-up
  form puts each person into the one list they chose. Each list gets its own RSS
  campaign (step 5).
- **Alternative: one list + a `FREQUENCY` attribute** (a category attribute with
  values `new` / `weekly` / `monthly`) and three *segments*. Cleaner if you like
  segments, but only use it if your plan's RSS campaigns can target a segment.

Either works. The three-lists route is the safe default.

### 3. Build the sign-up form (this gives you the values for the code)
In Brevo → **Contacts → Forms → create a form** with:
- an **Email** field (Brevo's default field name is `EMAIL`), and
- a **single-choice** field for the frequency (radio) — either a list-choice or
  the `FREQUENCY` attribute — offering the three options.
- Turn **Double opt-in ON** (Settings step) — the subscriber must click a
  confirmation link. Recommended for GDPR and keeps the list clean.
- Add the **GDPR / consent** block Brevo offers.

Then open **Share** and copy the URL inside the generated `<form action="…">`.
It looks like `https://xxxxxxx.sibforms.com/serve/MUIF-<id>`.

### 4. Wire the code (2-minute edit, then one test)
Open **`src/lib/newsletter.ts`** and set:
- `formAction` → the `…sibforms.com/serve/…` URL from step 3.
- `emailField` / `frequencyField` → the exact input names Brevo generated
  (default `EMAIL`; the frequency field name is whatever you called it).
- The three `frequencies[].value`s → must match the option values Brevo stores
  (`new` / `weekly` / `monthly` as written, or edit both sides to match).
- Leave `enabled: false` for now.

Deploy, then do **one real test sign-up** with your own email:
- you should get Brevo's confirmation email → click it,
- you should land in the right list/segment with the right frequency value.

When that works, set **`enabled: true`**, deploy again — the form is now live.

### 5. Create the three RSS campaigns (the actual sending)
In Brevo → **Campaigns → RSS** (one campaign per bucket), feed URL
**`https://sherredsticks.com/feed.xml`** for all three:
- **New stick** → send *as soon as new content appears* → to the `New stick`
  list/segment. (Brevo polls the feed; expect up to ~daily, not instant.)
- **Weekly** → recurring weekly → to the `Weekly` list/segment.
- **Monthly** → recurring monthly → to the `Monthly` list/segment.
- On first setup, use each campaign's **"only new items"** option so the existing
  back-catalogue isn't blasted out. (Belt-and-braces: the feed's dates are
  historical, so old sticks already look old.)

---

## Before real volume: deliverability & compliance

These make the emails land in inboxes (not spam) and keep Steve legal (he mails
UK/EU/US/AU subscribers). Most are Brevo settings or DNS records.

- **Authenticate the domain** — in Brevo, authenticate `sherredsticks.com`
  (SPF + DKIM). Brevo gives you the records; add them to Cloudflare DNS
  (grey-cloud / DNS-only). Consider sending from `news@sherredsticks.com`.
  **First check** the domain doesn't already have a conflicting SPF/MX record
  before adding one. A `DMARC` record (start `p=none`) is recommended too.
- **Physical postal address** in the email footer — legally required (US
  CAN-SPAM, and good practice in the UK). Brevo enforces this on campaigns; put
  Steve's real trading name + Wiltshire address.
- **Double opt-in** (step 3) + **unsubscribe** — Brevo's unsubscribe link and
  one-click header are automatic once you use its lists/campaigns. Never re-add
  someone who unsubscribed.
- **ICO fee** — most small UK e-commerce data controllers pay the ICO
  data-protection fee (~£40/yr). Steve should check via the ICO self-assessment.
- **Consent only** — only ever email people who signed up (or genuine past
  customers being told about similar sticks). Never buy or import a list.

---

## Quick reference

| Thing | Value |
| --- | --- |
| Feed Brevo watches | `https://sherredsticks.com/feed.xml` |
| File to switch the form on | `src/lib/newsletter.ts` (`enabled`, `formAction`) |
| Form component | `src/components/NewsletterSignup.tsx` |
| Feed generator | `scripts/emit-feed.mjs` (runs in deploy) |
| Frequencies | `new` · `weekly` · `monthly` |
