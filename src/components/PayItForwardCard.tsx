import Link from "next/link";
import { asset } from "@/lib/asset";
import { payItForward } from "@/lib/pay-it-forward";

// A Pay It Forward tile that sits in the product grid alongside the sticks — same
// card shape as a stick, but with the Sherred & Sons crest in place of a stick
// photo. Links to the Pay It Forward page. Hidden while the feature is switched off.
export default function PayItForwardCard() {
  if (!payItForward.enabled) return null;
  return (
    <Link
      href="/pay-it-forward"
      className="group flex flex-col overflow-hidden rounded-sm border border-gold/40 bg-surface hairline lift"
    >
      <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-ink">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,162,75,0.14),transparent_62%)]" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset("/brand/crest.png")}
          alt="Sherred & Sons"
          className="relative h-3/5 w-auto object-contain transition-transform duration-500 group-hover:scale-[1.05]"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className="eyebrow !text-[0.6rem]">Pay It Forward</span>
        <h3 className="mt-1 font-display text-lg leading-snug text-parchment transition-colors group-hover:text-gold">
          Gift a stick to someone in need
        </h3>
        <p className="mt-1 text-sm text-muted">
          Chip in toward a handmade stick we give, free, to someone who can&apos;t
          afford one.
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-display text-sm uppercase tracking-[0.16em] text-gold">
            Chip in
          </span>
          <span
            aria-hidden="true"
            className="text-gold transition-transform group-hover:translate-x-0.5"
          >
            &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
