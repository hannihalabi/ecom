"use client";

import { useState } from "react";
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
  const {
    subtotal,
    shippingTotal,
    total,
    totalItems,
    originalTotal,
    savings,
    applyPromotionCode,
    clearPromotionCode,
    promotionCode,
    promotionPercentOff,
    promotionDiscount,
  } = useCart();
  const [promotionInput, setPromotionInput] = useState(() => promotionCode ?? "");
  const [promotionError, setPromotionError] = useState<string | null>(null);

  const handleApplyPromotion = () => {
    const { normalized, error } = applyPromotionCode(promotionInput);
    if (error) {
      setPromotionError(error);
      return;
    }
    setPromotionInput(normalized);
    setPromotionError(null);
  };

  const handleRemovePromotion = () => {
    clearPromotionCode();
    setPromotionInput("");
    setPromotionError(null);
  };

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
        {promotionDiscount > 0 && promotionCode && (
          <div className="flex items-center justify-between text-xs text-emerald-700">
            <span>Aktiv kod ({promotionCode})</span>
            <span>-{formatMoney(promotionDiscount)}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span>Delsumma</span>
          <span>{formatMoney(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Frakt ({totalItems} st)</span>
          <span>{formatMoney(shippingTotal)}</span>
        </div>
        <div className="flex items-center justify-between font-semibold text-slate-900">
          <span>Totalt att betala</span>
          <span>{formatMoney(total)}</span>
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600">
          Rabattkod
        </p>
        <form
          className="mt-2 flex items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            handleApplyPromotion();
          }}
        >
          <input
            value={promotionInput}
            onChange={(event) => {
              setPromotionInput(event.target.value);
              if (promotionError) {
                setPromotionError(null);
              }
            }}
            placeholder="Ange rabattkod"
            className="h-10 flex-1 rounded-xl border border-slate-300 bg-white px-3 text-sm uppercase tracking-[0.04em] text-slate-900 placeholder:text-slate-400"
          />
          <button
            type="submit"
            className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
          >
            Använd
          </button>
        </form>
        {promotionCode && (
          <div className="mt-2 flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
            <span>
              Kod {promotionCode} aktiv (-{promotionPercentOff}%).
            </span>
            <button
              type="button"
              onClick={handleRemovePromotion}
              className="font-semibold text-emerald-700 underline underline-offset-2"
            >
              Ta bort
            </button>
          </div>
        )}
        {promotionError && (
          <p className="mt-2 text-xs text-rose-700">{promotionError}</p>
        )}
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
