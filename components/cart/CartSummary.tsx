"use client";

import { formatMoney } from "@/lib/format";
import { useCart } from "@/store/cart";

type CartSummaryProps = {
  onCheckout: () => void;
  isCheckoutLoading: boolean;
};

export const CartSummary = ({
  onCheckout,
  isCheckoutLoading,
}: CartSummaryProps) => {
  const { subtotal, originalTotal, savings } = useCart();

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">Ordersammanfattning</h3>
      <div className="space-y-2 text-sm text-slate-600">
        <div className="flex items-center justify-between">
          <span>Ordinarie total</span>
          <span>{formatMoney(originalTotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Rabatter</span>
          <span className="text-emerald-600">-{formatMoney(savings)}</span>
        </div>
        <div className="flex items-center justify-between font-semibold text-slate-900">
          <span>Totalt idag</span>
          <span>{formatMoney(subtotal)}</span>
        </div>
      </div>
      <div className="rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
        Du sparade {formatMoney(savings)} på den här beställningen.
      </div>
      <button
        type="button"
        onClick={onCheckout}
        disabled={isCheckoutLoading}
        className="rounded-full bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isCheckoutLoading ? "Skickar till Stripe..." : "Till kassan"}
      </button>
    </div>
  );
};
