import Link from "next/link";
import { asset } from "@/lib/asset";
import { CATEGORIES } from "@/lib/products";

const PAYMENTS = ["Visa", "Mastercard", "Amex", "Apple Pay", "PayPal"];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 border-t border-line bg-ink-2">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset("/brand/crest.png")}
              alt="Sherred & Sons crest"
              className="h-14 w-auto"
            />
            <span className="font-display text-2xl leading-none tracking-wide text-parchment">
              Sherred <span className="text-gold">&amp;</span> Sons
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Handmade walking sticks and traditional Irish blackthorn, shaped the
            old way and finished by hand.
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.14em] text-muted">
            Made to order &middot; Prices in GBP
          </p>
        </div>

        {/* Shop */}
        <div>
          <h3 className="font-display text-sm uppercase tracking-[0.18em] text-gold">Shop</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/shop" className="text-parchment-dim hover:text-gold">
                All sticks
              </Link>
            </li>
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`} className="text-parchment-dim hover:text-gold">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <h3 className="font-display text-sm uppercase tracking-[0.18em] text-gold">Help</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/about" className="text-parchment-dim hover:text-gold">
                Our story
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-parchment-dim hover:text-gold">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-parchment-dim hover:text-gold">
                Delivery &amp; returns
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-parchment-dim hover:text-gold">
                Sizing your stick
              </Link>
            </li>
          </ul>
        </div>

        {/* Payments */}
        <div>
          <h3 className="font-display text-sm uppercase tracking-[0.18em] text-gold">
            Secure checkout
          </h3>
          <p className="mt-4 text-sm text-muted">
            Card payments handled securely at checkout.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {PAYMENTS.map((p) => (
              <li
                key={p}
                className="rounded-sm border border-line px-2.5 py-1 text-[0.68rem] uppercase tracking-wide text-muted"
              >
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-center text-xs text-muted sm:flex-row sm:text-left">
          <p>&copy; {year} Sherred &amp; Sons Walking Sticks.</p>
          <p className="text-gold/70">
            Preview site &middot; sample products &mdash; no orders are taken yet.
          </p>
        </div>
      </div>
    </footer>
  );
}
