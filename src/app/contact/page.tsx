import type { Metadata } from "next";
import CelticDivider from "@/components/CelticDivider";
import ContactForm from "@/components/ContactForm";
import contact from "@/data/content/contact.json";

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
          {contact.intro}
        </p>
      </header>

      <CelticDivider className="my-12" />

      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-5">
        {/* Form */}
        <div className="rounded-sm border border-line bg-surface p-6 hairline sm:p-8 lg:col-span-3">
          <h2 className="mb-5 font-display text-xl text-gold">Send us a message</h2>
          <ContactForm />
        </div>

        {/* Info */}
        <div className="space-y-6 lg:col-span-2">
          <div id="delivery" className="scroll-mt-24 rounded-sm border border-line bg-surface p-6 hairline">
            <h2 className="font-display text-lg text-gold">{contact.deliveryHeading}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {contact.deliveryText}
            </p>
          </div>
          <div id="sizing" className="scroll-mt-24 rounded-sm border border-line bg-surface p-6 hairline">
            <h2 className="font-display text-lg text-gold">{contact.sizingHeading}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {contact.sizingText}
            </p>
          </div>
        </div>
      </div>

      {contact.footnote && (
        <p className="mx-auto mt-12 max-w-xl text-center text-xs text-muted">
          {contact.footnote}
        </p>
      )}
    </div>
  );
}
