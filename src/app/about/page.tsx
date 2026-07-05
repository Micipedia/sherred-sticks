import type { Metadata } from "next";
import Link from "next/link";
import CelticDivider from "@/components/CelticDivider";
import { btnPrimary } from "@/lib/ui";
import about from "@/data/content/about.json";

export const metadata: Metadata = {
  title: "Our story",
  description:
    "Sherred & Sons — a small workshop making walking sticks and traditional blackthorn the old way.",
};

export default function AboutPage() {
  return (
    <div className="container-page py-14">
      <header className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Our story</p>
        <h1 className="mt-3 font-display text-4xl text-parchment">Sherred &amp; Sons</h1>
        <p className="mt-6 text-lg leading-relaxed text-parchment-dim">
          {about.intro}
        </p>
      </header>

      <CelticDivider className="my-12" />

      <div className="mx-auto max-w-2xl space-y-5 leading-relaxed text-parchment-dim">
        {about.body.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      <section className="mt-16">
        <h2 className="text-center font-display text-2xl text-parchment">
          {about.stepsHeading}
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {about.steps.map((s, i) => (
            <div key={i} className="rounded-sm border border-line bg-surface p-6 hairline">
              <span className="font-display text-2xl text-gold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-lg text-parchment">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {about.notice && (
        <section className="mt-16 rounded-sm border border-line bg-ink-2 p-8 text-center">
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted">
            {about.notice}
          </p>
        </section>
      )}

      <div className="mt-12 flex justify-center">
        <Link href="/shop" className={btnPrimary}>
          Browse the collection
        </Link>
      </div>
    </div>
  );
}
