"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";
import { createStripeCheckoutSession } from "@/lib/stripeCheckout";
import { useCart } from "@/store/cart";

export const CheckoutRedirectClient = () => {
  const { detailedItems } = useCart();
  const [error, setError] = useState<string | null>(null);
  const didAttempt = useRef(false);

  useEffect(() => {
    if (didAttempt.current || detailedItems.length === 0) return;
    didAttempt.current = true;

    const start = async () => {
      setError(null);

      track("begin_checkout", {
        items: detailedItems.map(({ item }) => item),
      });

      try {
        const url = await createStripeCheckoutSession({
          items: detailedItems.map(({ item }) => ({
            productId: item.productId,
            quantity: item.quantity,
            selectedVariant: item.selectedVariant,
          })),
        });
        window.location.assign(url);
      } catch (checkoutError) {
        const message =
          checkoutError instanceof Error
            ? checkoutError.message
            : "Kunde inte starta Stripe-checkout.";
        setError(message);
      }
    };

    void start();
  }, [detailedItems]);

  if (detailedItems.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 text-center">
        <h1 className="text-xl font-semibold text-slate-900">Varukorgen är tom</h1>
        <p className="mt-2 text-sm text-slate-600">
          Lägg till produkter innan du går till kassan.
        </p>
        <Link
          href="/cart"
          className="mt-4 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
        >
          Till varukorgen
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">Vidare till Stripe</h1>
      <p className="mt-2 text-sm text-slate-600">
        Vi förbereder din betalning och skickar dig vidare till Stripe.
      </p>
      {error && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}
      <div className="mt-5 flex items-center justify-center gap-3">
        <Link
          href="/cart"
          className="inline-flex rounded-full border border-slate-900 px-5 py-3 text-sm font-semibold text-slate-900"
        >
          Tillbaka till varukorg
        </Link>
      </div>
    </div>
  );
};
