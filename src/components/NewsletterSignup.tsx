"use client";

import { useState } from "react";
import { IconCheck } from "./Icons";
import { btnPrimary } from "@/lib/ui";
import { newsletter } from "@/lib/newsletter";

// A site-wide "join the list" band. Subscribers pick how often they hear from
// us — every new stick, weekly, or monthly — and the choice is stored on Brevo
// so the three RSS campaigns can mail the right people.
//
// How the submit works without a backend: the form POSTs natively to Brevo's
// own form endpoint, targeting a hidden <iframe>, so the page never navigates
// away and there's no cross-origin fetch to be blocked. Brevo then sends the
// subscriber a confirmation email (double opt-in) — that email is the real
// completion step, which is why showing an optimistic "check your inbox" state
// here is honest: nobody is added until they click that link.
//
// The whole band stays hidden until the Brevo form is wired up (see
// src/lib/newsletter.ts) so the live shop never shows a dead form.

type Status = "idle" | "sent";

const radioName = newsletter.frequencyField;

export default function NewsletterSignup() {
  const [status, setStatus] = useState<Status>("idle");
  const [frequency, setFrequency] = useState<string>(newsletter.frequencies[0].value);

  if (!newsletter.enabled || !newsletter.formAction) return null;

  return (
    <section className="border-t border-line bg-ink-2">
      <div className="container-page py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Join the list</p>
          <h2 className="mt-3 font-display text-3xl text-parchment sm:text-4xl">
            Hear about new sticks first
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-parchment-dim">
            Each stick is one of a kind and often sells quickly. Leave your email
            and choose how often you&apos;d like to hear from us — you can
            unsubscribe any time.
          </p>
        </div>

        {status === "sent" ? (
          <div className="mx-auto mt-8 flex max-w-md flex-col items-center gap-4 rounded-sm border border-gold/40 bg-gold/5 p-8 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold text-gold">
              <IconCheck className="h-7 w-7" />
            </span>
            <h3 className="font-display text-2xl text-parchment">Almost there</h3>
            <p className="text-muted">
              Please check your inbox and click the confirmation link to finish
              joining the list.
            </p>
          </div>
        ) : (
          <form
            action={newsletter.formAction}
            method="POST"
            target="brevo-embed"
            onSubmit={() => setStatus("sent")}
            className="mx-auto mt-8 max-w-xl"
          >
            <fieldset>
              <legend className="mb-3 block text-center text-xs uppercase tracking-[0.14em] text-muted">
                How often?
              </legend>
              <div className="grid gap-3 sm:grid-cols-3">
                {newsletter.frequencies.map((f) => {
                  const active = frequency === f.value;
                  return (
                    <label
                      key={f.value}
                      className={`lift cursor-pointer rounded-sm border p-4 text-center ${
                        active
                          ? "border-gold bg-gold/10"
                          : "border-line bg-ink hover:border-gold/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name={radioName}
                        value={f.value}
                        checked={active}
                        onChange={() => setFrequency(f.value)}
                        className="sr-only"
                      />
                      <span className="block font-display text-sm text-parchment">
                        {f.label}
                      </span>
                      <span className="mt-1 block text-xs leading-snug text-muted">
                        {f.hint}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                name={newsletter.emailField}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full flex-1 rounded-sm border border-line bg-ink px-4 py-3 text-parchment placeholder:text-muted/60 focus:border-gold focus:outline-none"
              />
              <button type="submit" className={`${btnPrimary} shrink-0`}>
                Sign up
              </button>
            </div>

            <p className="mt-3 text-center text-xs text-muted">
              We&apos;ll only email you about our walking sticks. No spam, ever.
            </p>
          </form>
        )}

        {/* Brevo's form POST lands here instead of navigating the page away. */}
        <iframe name="brevo-embed" title="newsletter" className="hidden" />
      </div>
    </section>
  );
}
