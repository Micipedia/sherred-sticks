import type { Metadata } from "next";
import CelticDivider from "@/components/CelticDivider";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Sherred & Sons about a stick, a size, or a custom order.",
};

export default function ContactPage() {
  return (
    <div className="container-page py-14">
      <header className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Get in touch</p>
        <h1 className="mt-3 font-display text-4xl text-parchment">Contact</h1>
        <p className="mt-6 text-lg leading-relaxed text-parchment-dim">
          Questions about a stick, a size, or a custom order? We are glad to
          help.
        </p>
      </header>

      <CelticDivider className="my-12" />

      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
        <div className="rounded-sm border border-line bg-surface p-6 hairline">
          <h2 className="font-display text-lg text-gold">Email</h2>
          <a
            href="mailto:hello@sherredsticks.com"
            className="mt-3 block text-parchment hover:text-gold"
          >
            hello@sherredsticks.com
          </a>
          <p className="mt-2 text-sm text-muted">
            We aim to reply within a couple of days.
          </p>
        </div>

        <div id="delivery" className="scroll-mt-24 rounded-sm border border-line bg-surface p-6 hairline">
          <h2 className="font-display text-lg text-gold">Delivery &amp; returns</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Sticks are made to order, boxed carefully and sent tracked. Full
            delivery times and our returns policy will be confirmed before the
            shop opens.
          </p>
        </div>

        <div id="sizing" className="scroll-mt-24 rounded-sm border border-line bg-surface p-6 hairline">
          <h2 className="font-display text-lg text-gold">Sizing your stick</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            For a support cane: stand upright in your usual shoes, arms relaxed,
            and measure from the floor to the crease of your wrist. That length
            is a good starting point. Tell us your height and we will help.
          </p>
        </div>
      </div>

      <p className="mx-auto mt-12 max-w-xl text-center text-xs text-muted">
        This is a preview site. Contact details are placeholders and will be
        confirmed before launch.
      </p>
    </div>
  );
}
