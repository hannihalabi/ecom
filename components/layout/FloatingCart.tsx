"use client";

import Link from "next/link";
import { useCart } from "@/store/cart";

const CartIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6"
  >
    <path d="M3 4h2l1.8 9.1a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L20 7H6" />
    <circle cx="9" cy="19" r="1.25" />
    <circle cx="17" cy="19" r="1.25" />
  </svg>
);

export const FloatingCart = () => {
  const { totalItems } = useCart();

  return (
    <Link
      href="/cart"
      data-floating-cart
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black text-white shadow-[0_16px_45px_rgba(0,0,0,0.38)] transition duration-200 hover:scale-105 hover:bg-[#202020] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:bottom-7 sm:right-7"
      aria-label={`Varukorg, ${totalItems} produkter`}
    >
      {totalItems > 0 && (
        <span
          className="cart-attention-pulse pointer-events-none absolute inset-0 rounded-full bg-black"
          aria-hidden="true"
        />
      )}
      <span className="relative z-10">
        <CartIcon />
      </span>
      {totalItems > 0 && (
        <span className="absolute -right-1 -top-1 z-20 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-black bg-white px-1 text-[11px] font-bold text-black">
          {totalItems}
        </span>
      )}
    </Link>
  );
};
