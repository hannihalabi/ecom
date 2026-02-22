"use client";

import { useState } from "react";
import Link from "next/link";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { CartSummary } from "@/components/cart/CartSummary";
import { track } from "@/lib/analytics";
import { formatMoney } from "@/lib/format";
import { createStripeCheckoutSession } from "@/lib/stripeCheckout";
import { useCart } from "@/store/cart";

export const CartPage = () => {
  const { detailedItems, updateQuantity, removeItem, subtotal, savings } = useCart();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (detailedItems.length === 0 || isCheckoutLoading) return;

    setCheckoutError(null);
    setIsCheckoutLoading(true);

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
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Kunde inte ansluta till Stripe. Försök igen.";
      setCheckoutError(message);
      setIsCheckoutLoading(false);
    }
  };

  if (detailedItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center">
        <h1 className="text-xl font-semibold text-slate-900">Din varukorg är tom</h1>
        <p className="text-sm text-slate-600">
          Ta del av de bästa erbjudandena innan de tar slut.
        </p>
        <Link
          href="/"
          className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
        >
          Se erbjudanden
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Du sparade {formatMoney(savings)} i den här varukorgen.
        </div>
        {detailedItems.map(({ item, product, lineTotal }) => (
          <CartItemRow
            key={`${item.productId}-${item.selectedVariant ?? "default"}`}
            item={item}
            product={product}
            lineTotal={lineTotal}
            onUpdate={(quantity) =>
              updateQuantity(item.productId, quantity, item.selectedVariant)
            }
            onRemove={() => removeItem(item.productId, item.selectedVariant)}
          />
        ))}
      </div>
      <div className="flex flex-col gap-4">
        <CartSummary
          onCheckout={handleCheckout}
          isCheckoutLoading={isCheckoutLoading}
        />
        {checkoutError && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {checkoutError}
          </div>
        )}
        <div className="rounded-xl border border-slate-200 bg-white/90 p-4 text-xs text-slate-600">
          <p className="font-semibold text-slate-700">Frakt och returer</p>
          <p>Fri frakt över 3 000 kr. 30 dagars öppet köp.</p>
        </div>
      </div>

      <div className="fixed bottom-16 left-0 right-0 z-40 mx-auto w-full max-w-6xl md:hidden">
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg">
          <div>
            <p className="text-xs text-slate-500">Totalt</p>
            <p className="text-base font-semibold text-slate-900">
              {formatMoney(subtotal)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCheckout}
            disabled={isCheckoutLoading}
            className="rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isCheckoutLoading ? "Skickar till Stripe..." : "Till kassan"}
          </button>
        </div>
      </div>
    </div>
  );
};
