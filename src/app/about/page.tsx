import type { Metadata } from "next";
import Link from "next/link";
import CelticDivider from "@/components/CelticDivider";
import { btnPrimary } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Our story",
  description:
    "Sherred & Sons — a small workshop making walking sticks and traditional blackthorn the old way.",
};

const STEPS = [
  {
    n: "01",
    title: "Select",
    text: "Each stick begins with a length of hardwood chosen for its straightness, strength and character.",
  },
  {
    n: "02",
    title: "Season",
    text: "The timber is dried slowly over months until it is hard, stable and true.",
  },
  {
    n: "03",
    title: "Shape",
    text: "Handles are shaped by hand — a knob, a derby, a crook or a natural fork — and the shaft rubbed back.",
  },
  {
    n: "04",
    title: "Finish",
    text: "A hand-oiled finish brings out the grain, and a brass ferrule is fitted for the road.",
  },
];

export default function AboutPage() {
  return (
    <div className="container-page py-14">
      <header className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Our story</p>
        <h1 className="mt-3 font-display text-4xl text-parchment">Sherred &amp; Sons</h1>
        <p className="mt-6 text-lg leading-relaxed text-parchment-dim">
          A small workshop making walking sticks the traditional way — good
          hardwood, seasoned slowly, shaped by hand and finished with care.
        </p>
      </header>

      <CelticDivider className="my-12" />

      <div className="mx-auto max-w-2xl space-y-5 leading-relaxed text-parchment-dim">
        <p>
          We make hiking staffs for the hills, dress canes for the evening,
          support sticks for every day, and the traditional Irish blackthorn
          that gives a stick real character.
        </p>
        <p>
          A stick is a companion. It should feel right in the hand, balance
          well, and last for years of walking. That is what we set out to make —
          honest sticks, built to be leaned on and handed down.
        </p>
      </div>

      <section className="mt-16">
        <h2 className="text-center font-display text-2xl text-parchment">
          How we make them
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="rounded-sm border border-line bg-surface p-6 hairline">
              <span className="font-display text-2xl text-gold">{s.n}</span>
              <h3 className="mt-3 font-display text-lg text-parchment">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-sm border border-line bg-ink-2 p-8 text-center">
        <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted">
          This is an early preview of our shop. The sticks shown are samples, to
          give a feel for the range and the look of the place. Full details,
          photography and stock are on the way.
        </p>
      </section>

      <div className="mt-12 flex justify-center">
        <Link href="/shop" className={btnPrimary}>
          Browse the collection
        </Link>
      </div>
    </div>
  );
}
