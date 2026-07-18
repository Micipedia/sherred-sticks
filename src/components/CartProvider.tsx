"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartLine, Product } from "@/lib/types";
import { mainImage } from "@/lib/product-helpers";
import { PAY_IT_FORWARD_SLUG } from "@/lib/pay-it-forward";

const STORAGE_KEY = "sherred-cart-v1";

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotalCents: number;
  isOpen: boolean;
  hydrated: boolean;
  open: () => void;
  close: () => void;
  add: (product: Product, qty?: number) => void;
  addLine: (
    line: { slug: string; name: string; priceCents: number; image: string },
    qty?: number
  ) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  setContribution: (cents: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load any saved cart after mount (localStorage is browser-only).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // One-time hydration from localStorage (client-only external read).
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (Array.isArray(parsed)) setLines(parsed);
      }
    } catch {
      /* ignore malformed storage */
    }
    setHydrated(true);
  }, []);

  // Persist whenever the cart changes (after initial hydration).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage may be unavailable (private mode) */
    }
  }, [lines, hydrated]);

  // Generic add — works for any purchasable item (sticks or accessories).
  const addLine = useCallback(
    (
      line: { slug: string; name: string; priceCents: number; image: string },
      qty = 1
    ) => {
      setLines((prev) => {
        const i = prev.findIndex((l) => l.slug === line.slug);
        if (i >= 0) {
          const next = [...prev];
          next[i] = { ...next[i], qty: next[i].qty + qty };
          return next;
        }
        return [...prev, { ...line, qty }];
      });
      setIsOpen(true);
    },
    []
  );

  const add = useCallback(
    (product: Product, qty = 1) =>
      addLine(
        {
          slug: product.slug,
          name: product.name,
          priceCents: product.priceCents ?? 0,
          image: mainImage(product),
        },
        qty
      ),
    [addLine]
  );

  const setQty = useCallback((slug: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.slug !== slug)
        : prev.map((l) => (l.slug === slug ? { ...l, qty } : l))
    );
  }, []);

  const remove = useCallback(
    (slug: string) => setLines((prev) => prev.filter((l) => l.slug !== slug)),
    []
  );

  // A Pay It Forward contribution rides in the basket as a single special line
  // (crest image, chosen amount, qty 1). Setting it replaces any existing one; 0
  // removes it. It's peeled back out at checkout and sent as the contribution.
  const setContribution = useCallback((cents: number) => {
    setLines((prev) => {
      const others = prev.filter((l) => l.slug !== PAY_IT_FORWARD_SLUG);
      if (cents <= 0) return others;
      return [
        ...others,
        { slug: PAY_IT_FORWARD_SLUG, name: "Pay It Forward", priceCents: cents, image: "/brand/crest.png", qty: 1 },
      ];
    });
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const count = useMemo(() => lines.reduce((n, l) => n + l.qty, 0), [lines]);
  const subtotalCents = useMemo(
    () => lines.reduce((s, l) => s + l.qty * l.priceCents, 0),
    [lines]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count,
      subtotalCents,
      isOpen,
      hydrated,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add,
      addLine,
      setQty,
      remove,
      setContribution,
      clear,
    }),
    [lines, count, subtotalCents, isOpen, hydrated, add, addLine, setQty, remove, setContribution, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
