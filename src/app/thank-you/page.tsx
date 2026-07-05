import type { Metadata } from "next";
import Link from "next/link";
import { IconCheck } from "@/components/Icons";
import { btnPrimary } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Thank you",
  description: "Your order is confirmed.",
};

export default function ThankYouPage() {
  return (
    <div className="container-page flex flex-col items-center py-28 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold text-gold">
        <IconCheck className="h-8 w-8" />
      </span>
      <h1 className="mt-6 font-display text-3xl text-parchment">Thank you</h1>
      <p className="mt-4 max-w-md text-muted">
        Your payment went through and your order is confirmed. You&apos;ll get a
        receipt by email, and we&apos;ll be in touch about posting your stick.
      </p>
      <Link href="/shop" className={`${btnPrimary} mt-8`}>
        Back to the shop
      </Link>
    </div>
  );
}
