"use client";

import { useState } from "react";
import { asset } from "@/lib/asset";

/**
 * Interactive product gallery: clicking a thumbnail swaps the large image.
 * Thumbnails include every photo (the main one too) so any can be reselected.
 * The parent keys this per product (key={slug}) so state resets between products.
 */
export default function ProductGallery({
  images,
  name,
  sold = false,
}: {
  images: string[];
  name: string;
  sold?: boolean;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) return null;

  const safeActive = active < images.length ? active : 0;
  const main = images[safeActive];

  return (
    <div>
      {/* Main image */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-line bg-ink">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset(main)}
          alt={
            images.length > 1
              ? `${name} — photo ${safeActive + 1} of ${images.length}`
              : name
          }
          className="h-full w-full object-contain"
        />
        {sold && (
          <span className="absolute left-4 top-4 rounded-sm bg-ink/85 px-3 py-1 font-display text-xs uppercase tracking-[0.18em] text-gold backdrop-blur">
            Sold
          </span>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1} of ${images.length}`}
              aria-current={i === safeActive}
              className={`aspect-square overflow-hidden rounded-sm border bg-ink transition-colors ${
                i === safeActive
                  ? "border-gold"
                  : "border-line hover:border-gold/50"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(img)} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
