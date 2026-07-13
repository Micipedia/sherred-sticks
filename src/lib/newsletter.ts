/**
 * Mailing-list configuration.
 *
 * The list is run on Brevo (free tier) — Brevo stores the subscribers, sends
 * the confirmation email, handles unsubscribe, and mails people when a new
 * stick is listed (weekly / monthly digests too). The sign-up form on the site
 * posts straight to Brevo; no server or secret key is involved.
 *
 * The sign-up band stays HIDDEN until `enabled` is true, so the live shop never
 * shows a form that goes nowhere. To switch it on, follow MAILING-LIST-SETUP.md:
 *   1. create the Brevo form (it gives you the `formAction` URL + field names),
 *   2. paste them in below,
 *   3. do one real test sign-up end-to-end,
 *   4. set `enabled: true`.
 */
export const newsletter = {
  // Flip to true only after a real test sign-up has worked end-to-end.
  enabled: false,

  // Brevo → Contacts → Forms → your form → "Share" → the URL inside the
  // generated <form action="…">. It looks like:
  //   https://xxxxxxx.sibforms.com/serve/MUIF-<long-id>
  formAction: "",

  // The input names Brevo puts on that generated form. EMAIL is Brevo's
  // default; the frequency field name is whatever you call the attribute
  // (e.g. FREQUENCY). If Brevo generates different names, match them here.
  emailField: "EMAIL",
  frequencyField: "FREQUENCY",

  // The three choices a subscriber picks. Each `value` MUST match the option
  // value stored on Brevo's FREQUENCY attribute — that value is how the three
  // RSS campaigns (new-stick / weekly / monthly) segment who gets what.
  frequencies: [
    {
      value: "new",
      label: "Every new stick",
      hint: "A short note whenever a new stick is listed",
    },
    {
      value: "weekly",
      label: "Weekly round-up",
      hint: "One email a week with that week's new sticks",
    },
    {
      value: "monthly",
      label: "Monthly round-up",
      hint: "A single email once a month",
    },
  ],
} as const;

export type Newsletter = typeof newsletter;
