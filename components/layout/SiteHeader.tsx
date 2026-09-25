"use client";

import Link from "next/link";
import { useCart } from "@/store/cart";

const BagIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    className="h-5 w-5"
  >
    <path d="M5.5 8.5h13l1 12h-15l1-12Z" />
    <path d="M9 9V6.5a3 3 0 0 1 6 0V9" />
  </svg>
);

export const SiteHeader = () => {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-white/10 bg-[#0b0b0b]/95 text-white backdrop-blur-xl">
      <nav
        className="mx-auto flex h-full max-w-7xl items-center justify-between px-5 sm:px-8"
        aria-label="Huvudnavigation"
      >
        <Link
          href="/"
          className="text-[1.35rem] font-semibold lowercase tracking-[-0.04em] text-white"
          aria-label="bags – startsida"
        >
          bags
        </Link>

        <Link
          href="/cart"
          className="group relative flex h-10 items-center gap-2 rounded-full border border-white/15 px-4 text-sm font-medium text-white/90 transition hover:border-white/35 hover:bg-white/10 hover:text-white"
          aria-label={`Varukorg, ${totalItems} produkter`}
        >
          <BagIcon />
          <span className="hidden sm:inline">Varukorg</span>
          {totalItems > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[11px] font-bold text-black">
              {totalItems}
            </span>
          )}
        </Link>
      </nav>
    </header>
  );
};
