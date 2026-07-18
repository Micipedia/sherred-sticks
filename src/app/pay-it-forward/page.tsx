import type { Metadata } from "next";
import ContributeBox from "@/components/ContributeBox";
import CelticDivider from "@/components/CelticDivider";
import { payItForward } from "@/lib/pay-it-forward";
import { btnGhost } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Pay It Forward",
  description:
    "Chip in toward a handmade walking stick we give — free — to someone who can't afford one, through a free monthly draw open to anyone in financial hardship.",
};

const STEPS = [
  {
    n: "1",
    title: "You chip in",
    body: "Add any amount from £1 when you order, or here on this page. Every penny goes toward sticks — never to us.",
  },
  {
    n: "2",
    title: "The pool fills",
    body: "Contributions add up on the tally. When they cover the cost of making one stick, Steve makes it by hand.",
  },
  {
    n: "3",
    title: "A name is drawn",
    body: "Anyone in financial hardship can enter our free monthly draw — no payment, ever. We pick a name at random and post the stick, free.",
  },
];

export default function PayItForwardPage() {
  return (
    <div className="container-page py-14">
      {/* Hero */}
      <header className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Pay It Forward</p>
        <h1 className="mt-3 font-display text-4xl text-parchment sm:text-5xl">
          Gift a stick to someone who can&apos;t afford one
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-parchment-dim">
          A good walking stick shouldn&apos;t be out of reach for anyone who needs
          one. Add a little when you order — or give on its own — and we&apos;ll put
          it toward a handmade stick we give, free, to someone in genuine need.
        </p>
      </header>

      <CelticDivider className="my-12" />

      {/* How it works */}
      <section className="mx-auto max-w-4xl">
        <h2 className="text-center font-display text-sm uppercase tracking-[0.18em] text-gold">
          How it works
        </h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.n} className="rounded-sm border border-line bg-ink-2 p-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold font-display text-gold">
                {s.n}
              </span>
              <h3 className="mt-4 font-display text-lg text-parchment">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Contribute + live tally */}
      <section className="mx-auto mt-12 max-w-2xl">
        <ContributeBox />
      </section>

      {/* The free draw */}
      <section className="mx-auto mt-12 max-w-2xl rounded-sm border border-line bg-ink-2 p-8">
        <h2 className="font-display text-2xl text-parchment">The free monthly draw</h2>
        <p className="mt-3 leading-relaxed text-parchment-dim">
          Entry is completely free and open to anyone facing financial hardship —
          there is never any payment or purchase to enter. Each month a stick is
          ready, we draw one name at random and post the stick out, free of charge.
        </p>
        {payItForward.registerUrl ? (
          <a
            href={payItForward.registerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${btnGhost} mt-6`}
          >
            Register for the draw
          </a>
        ) : (
          <p className="mt-6 text-sm text-muted">
            The free draw opens for registration soon — check back shortly.
          </p>
        )}
      </section>

      {/* Honest small print — keeps us clearly on the commercial side of the line */}
      <section className="mx-auto mt-10 max-w-2xl text-center">
        <p className="text-xs leading-relaxed text-muted">
          Sherred &amp; Sons is a small family workshop, not a registered charity,
          so contributions aren&apos;t tax-deductible and there&apos;s no Gift Aid.
          This is our own goodwill programme — you&apos;re helping us make and give
          away our own handmade sticks, at our discretion. The draw is a free prize
          draw: no purchase or payment is ever needed to enter.
        </p>
      </section>
    </div>
  );
}
