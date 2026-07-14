"use client";

import { useEffect, useState } from "react";
import { asset } from "@/lib/asset";

export type HeroSlide = { src: string; alt: string };

/**
 * The hero image, as a rotating showcase. Slides cross-fade every
 * `intervalMs` (default 5s) and loop back to the start. Fed a mix of the brand shot and real stick
 * photos by the home page, so it keeps itself fresh as Steve adds sticks.
 *
 * Nice-to-haves that keep it from being annoying: it pauses while the pointer
 * is over it (so you can actually look at a stick), it doesn't auto-rotate for
 * visitors who ask for reduced motion, and the dots let you jump between shots.
 */
export default function HeroCarousel({
  slides,
  intervalMs = 5000,
}: {
  slides: HeroSlide[];
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  useEffect(() => {
    if (count <= 1 || paused) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), intervalMs);
    return () => clearInterval(id);
  }, [count, paused, intervalMs]);

  if (count === 0) return null;

  return (
    <div
      className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-md border border-line bg-ink hairline"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((s, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={s.src}
          src={asset(s.src)}
          alt={s.alt}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          loading={i === 0 ? "eager" : "lazy"}
          aria-hidden={i === index ? undefined : true}
        />
      ))}

      {count > 1 && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {slides.map((s, i) => (
            <button
              key={s.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1} of ${count}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-5 bg-gold" : "w-1.5 bg-parchment/40 hover:bg-parchment/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
