"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartProvider";
import BrandMark from "./BrandMark";
import { IconCart, IconMenu, IconClose } from "./Icons";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/category/hiking", label: "Hiking" },
  { href: "/category/dinner", label: "Dinner" },
  { href: "/category/aid", label: "Aid" },
  { href: "/category/robust", label: "Robust" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const { count, hydrated, open } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname?.startsWith(href));

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-ink/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3" aria-label="Sherred & Sons home">
          <BrandMark className="h-9 w-9 shrink-0 text-gold" />
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg tracking-wide text-parchment">
              Sherred &amp; Sons
            </span>
            <span className="mt-0.5 text-[0.6rem] uppercase tracking-[0.32em] text-muted">
              Walking Sticks
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`font-display text-xs uppercase tracking-[0.16em] transition-colors hover:text-gold ${
                isActive(item.href) ? "text-gold" : "text-parchment-dim"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={open}
            aria-label="Open basket"
            className="relative rounded-sm p-2 text-parchment transition-colors hover:text-gold"
          >
            <IconCart className="h-6 w-6" />
            {hydrated && count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[0.6rem] font-semibold tabular-nums text-ink">
                {count}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="rounded-sm p-2 text-parchment transition-colors hover:text-gold lg:hidden"
          >
            {menuOpen ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="border-t border-line bg-ink-2 lg:hidden">
          <ul className="container-page flex flex-col py-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block py-3 font-display text-sm uppercase tracking-[0.16em] ${
                    isActive(item.href) ? "text-gold" : "text-parchment-dim"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
