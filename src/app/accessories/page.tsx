import type { Metadata } from "next";
import Link from "next/link";
import CelticDivider from "@/components/CelticDivider";
import AccessoryCard from "@/components/AccessoryCard";
import { getAccessories } from "@/lib/accessories";
import { btnPrimary } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Accessories",
  description:
    "Stick wax, polishing cloths and everyday care to keep your walking stick in good order.",
};

export default function AccessoriesPage() {
  const items = getAccessories();

  return (
    <div className="container-page py-14">
      <header className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Care &amp; extras</p>
        <h1 className="mt-3 font-display text-4xl text-parchment">Accessories</h1>
        <p className="mt-6 text-lg leading-relaxed text-parchment-dim">
          Wax, cloths and everyday bits to keep your stick looking its best.
        </p>
      </header>

      <CelticDivider className="my-12" />

      {items.length === 0 ? (
        <div className="mx-auto flex max-w-md flex-col items-center text-center text-muted">
          <p>Accessories are on their way — check back soon.</p>
          <Link href="/shop" className={`${btnPrimary} mt-8`}>
            Browse the sticks
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <AccessoryCard key={item.slug} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
