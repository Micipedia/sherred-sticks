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
      {/* Main image — with more than one photo, clicking it advances to the
          next (wrapping back to the first), so you can flick through without
          reaching for the thumbnails. */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-line bg-ink">
        {images.length > 1 ? (
          <button
            type="button"
            onClick={() => setActive((a) => (a + 1) % images.length)}
            aria-label={`Show next photo (currently ${safeActive + 1} of ${images.length})`}
            className="group block h-full w-full cursor-pointer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset(main)}
              alt={`${name} — photo ${safeActive + 1} of ${images.length}`}
              className="h-full w-full object-contain"
            />
            {/* Photo counter */}
            <span className="pointer-events-none absolute bottom-3 left-3 rounded-sm bg-ink/70 px-2 py-1 text-[0.65rem] tracking-wide text-parchment/80 backdrop-blur">
              {safeActive + 1} / {images.length}
            </span>
            {/* "Next photo" hint, shown on hover */}
            <span className="pointer-events-none absolute bottom-3 right-3 rounded-sm bg-ink/80 px-2.5 py-1 font-display text-[0.65rem] uppercase tracking-[0.15em] text-gold opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
              Next photo &rarr;
            </span>
          </button>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={asset(main)} alt={name} className="h-full w-full object-contain" />
        )}
        {sold && (
          <span className="pointer-events-none absolute left-4 top-4 rounded-sm bg-ink/85 px-3 py-1 font-display text-xs uppercase tracking-[0.18em] text-gold backdrop-blur">
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
