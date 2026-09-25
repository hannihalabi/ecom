"use client";

import { useState } from "react";
import Link from "next/link";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { CartSummary } from "@/components/cart/CartSummary";
import { track } from "@/lib/analytics";
import { createStripeCheckoutSession } from "@/lib/stripeCheckout";
import { useCart } from "@/store/cart";

const ArrowLeftIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const LockIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="h-4 w-4"
  >
    <rect x="5" y="10" width="14" height="10" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);

const CheckoutHeader = () => (
  <header className="flex items-center justify-between gap-4 border-b border-[#deded8] py-5">
    <Link
      href="/"
      className="inline-flex items-center gap-2 text-sm font-medium text-[#55554f] transition hover:text-black"
    >
      <ArrowLeftIcon />
      Fortsätt handla
    </Link>
    <p className="flex items-center gap-2 text-xs font-medium text-[#686862]">
      <LockIcon />
      Säker checkout
    </p>
  </header>
);

const CheckoutProgress = () => (
  <ol className="mt-8 grid grid-cols-3 gap-2" aria-label="Checkout-steg">
    {[
      ["1", "Granska", true],
      ["2", "Betala", false],
      ["3", "Klart", false],
    ].map(([number, label, active]) => (
      <li key={label as string} className="flex items-center gap-2 sm:gap-3">
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
            active ? "bg-[#11110f] text-white" : "border border-[#d4d4ce] text-[#8b8b84]"
          }`}
        >
          {number}
        </span>
        <span
          className={`text-[11px] font-semibold uppercase tracking-[0.1em] ${
            active ? "text-[#171715]" : "text-[#9a9a93]"
          }`}
        >
          {label}
        </span>
        {number !== "3" && <span className="hidden h-px flex-1 bg-[#dcdcd6] sm:block" />}
      </li>
    ))}
  </ol>
);

export const CartPage = () => {
  const {
    detailedItems,
    updateQuantity,
    updateSpecialOrderRequest,
    removeItem,
    promotionCode,
  } = useCart();
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
        items: detailedItems.map(({ item }) => item),
        promotionCode: promotionCode ?? undefined,
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
      <div className="min-h-screen bg-[#f5f5f2] px-5 [font-family:var(--font-sans)] sm:px-8">
        <div className="mx-auto max-w-6xl">
          <CheckoutHeader />
          <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#d8d8d2] bg-white text-xl">
              0
            </div>
            <h1 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-[#171715]">
              Varukorgen väntar på dig
            </h1>
            <p className="mt-3 max-w-sm text-sm leading-6 text-[#6d6d66]">
              Sök fram en modell du gillar och lägg den i varukorgen för att fortsätta.
            </p>
            <Link
              href="/"
              className="mt-7 inline-flex h-12 items-center justify-center rounded-xl bg-[#11110f] px-6 text-sm font-semibold text-white"
            >
              Utforska modeller
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f2] px-4 pb-32 [font-family:var(--font-sans)] sm:px-8 lg:pb-16">
      <div className="mx-auto max-w-6xl">
        <CheckoutHeader />
        <CheckoutProgress />

        <div className="mt-10 max-w-2xl">
          <h1 className="text-4xl font-semibold tracking-[-0.055em] text-[#171715] sm:text-5xl">
            Din beställning
          </h1>
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_23.5rem] lg:gap-10">
          <div className="space-y-4">
            {detailedItems.map(({ item, product, lineTotal }) => (
              <CartItemRow
                key={`${item.productId}-${item.selectedVariant ?? "default"}`}
                item={item}
                product={product}
                lineTotal={lineTotal}
                onUpdate={(quantity) =>
                  updateQuantity(item.productId, quantity, item.selectedVariant)
                }
                onUpdateRequest={(request) => updateSpecialOrderRequest(request)}
                onRemove={() => removeItem(item.productId, item.selectedVariant)}
              />
            ))}

          </div>

          <div className="space-y-4 lg:sticky lg:top-6">
            <CartSummary
              onCheckout={handleCheckout}
              isCheckoutLoading={isCheckoutLoading}
            />
            {checkoutError && (
              <div
                role="alert"
                className="rounded-2xl border border-[#efc5c5] bg-[#fff1f1] p-4 text-sm leading-6 text-[#8c2929]"
              >
                {checkoutError}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
