"use client";

import { useState } from "react";
import { IconCheck } from "./Icons";
import { btnPrimary } from "@/lib/ui";

// Where enquiries are delivered. FormSubmit relays the form to this inbox with
// no backend needed. One-time activation: the first submission triggers a
// FormSubmit confirmation email to this address — click it once to switch the
// relay on. TODO: swap this plain address for FormSubmit's hashed endpoint
// (shown after activation) so the email isn't exposed in this PUBLIC repo.
const CONTACT_ENDPOINT = "Pitchperfectno1@gmail.com";

const inputClass =
  "w-full rounded-sm border border-line bg-ink px-3 py-2 text-parchment placeholder:text-muted/60 focus:border-gold focus:outline-none";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_ENDPOINT}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          subject: data.get("subject"),
          message: data.get("message"),
          _subject: "New enquiry — Sherred & Sons",
          _template: "table",
        }),
      });
      if (!res.ok) throw new Error("bad response");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-sm border border-gold/40 bg-gold/5 p-8 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold text-gold">
          <IconCheck className="h-7 w-7" />
        </span>
        <h2 className="font-display text-2xl text-parchment">Message sent</h2>
        <p className="text-muted">
          Thanks for getting in touch — we will reply as soon as we can.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1 block text-xs uppercase tracking-[0.14em] text-muted">
            Your name
          </label>
          <input id="name" name="name" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-xs uppercase tracking-[0.14em] text-muted">
            Email
          </label>
          <input id="email" type="email" name="email" required className={inputClass} />
        </div>
      </div>
      <div>
        <label htmlFor="subject" className="mb-1 block text-xs uppercase tracking-[0.14em] text-muted">
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          placeholder="Which stick, or how can we help?"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block text-xs uppercase tracking-[0.14em] text-muted">
          Message
        </label>
        <textarea id="message" name="message" required rows={5} className={inputClass} />
      </div>

      {status === "error" && (
        <p className="text-sm text-oxblood">
          Something went wrong sending your message. Please try again in a moment.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className={`${btnPrimary} w-full disabled:opacity-60 sm:w-auto`}
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
