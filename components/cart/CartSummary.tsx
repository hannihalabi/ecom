"use client";

import { useState } from "react";
import { formatMoney } from "@/lib/format";
import { useCart } from "@/store/cart";

type CartSummaryProps = {
  onCheckout: () => void;
  isCheckoutLoading: boolean;
};

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

const ArrowIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

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
    <>
      <aside className="overflow-hidden rounded-[1.75rem] bg-[#11110f] text-white shadow-[0_24px_70px_rgba(15,15,13,0.16)]">
        <div className="p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                Din beställning
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-white [font-family:var(--font-sans)]">
                Ordersammanfattning
              </h2>
            </div>
            <span className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-1.5 text-xs text-white/65">
              {totalItems} {totalItems === 1 ? "produkt" : "produkter"}
            </span>
          </div>

          <div className="mt-7 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4 text-white/58">
              <span>Ordinarie total</span>
              <span className="tabular-nums">{formatMoney(originalTotal)}</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-[#9fddb2]">
              <span>Din rabatt</span>
              <span className="font-medium tabular-nums">−{formatMoney(savings)}</span>
            </div>
            {promotionDiscount > 0 && promotionCode && (
              <div className="flex items-center justify-between gap-4 text-xs text-[#9fddb2]">
                <span>Kod {promotionCode} ({promotionPercentOff}%)</span>
                <span className="tabular-nums">−{formatMoney(promotionDiscount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between gap-4 text-white/72">
              <span>Delsumma</span>
              <span className="tabular-nums">{formatMoney(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-white/72">
              <span>Frakt</span>
              <span className="tabular-nums">{formatMoney(shippingTotal)}</span>
            </div>
          </div>

          <div className="my-6 h-px bg-white/12" />

          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-white/55">Totalt att betala</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-white/35">
                SEK
              </p>
            </div>
            <p className="text-3xl font-semibold tracking-[-0.04em] tabular-nums text-white [font-family:var(--font-sans)]">
              {formatMoney(total)}
            </p>
          </div>

          <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.055] p-4">
            <p className="text-xs font-medium text-white/75">Har du en rabattkod?</p>
            <form
              className="mt-3 flex items-center gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                handleApplyPromotion();
              }}
            >
              <input
                value={promotionInput}
                onChange={(event) => {
                  setPromotionInput(event.target.value);
                  if (promotionError) setPromotionError(null);
                }}
                placeholder="Ange kod"
                aria-label="Rabattkod"
                className="h-11 min-w-0 flex-1 rounded-xl border border-white/12 bg-black/25 px-3 text-sm uppercase tracking-[0.04em] text-white outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-white/32 focus:border-white/35"
              />
              <button
                type="submit"
                className="h-11 rounded-xl bg-white px-4 text-xs font-semibold text-[#161614] transition hover:bg-[#eeeeea]"
              >
                Använd
              </button>
            </form>
            {promotionCode && (
              <div className="mt-3 flex items-center justify-between rounded-xl bg-[#183c25] px-3 py-2 text-xs text-[#bce5c8]">
                <span>Kod {promotionCode} är aktiv.</span>
                <button
                  type="button"
                  onClick={handleRemovePromotion}
                  className="font-semibold underline underline-offset-2"
                >
                  Ta bort
                </button>
              </div>
            )}
            {promotionError && (
              <p className="mt-3 text-xs text-[#ffb8b8]">{promotionError}</p>
            )}
          </div>

          <button
            type="button"
            onClick={onCheckout}
            disabled={isCheckoutLoading}
            className="mt-5 flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-white px-5 text-sm font-semibold text-[#11110f] transition hover:bg-[#efefe9] disabled:cursor-wait disabled:opacity-65"
          >
            {isCheckoutLoading ? "Öppnar Stripe…" : "Fortsätt till säker betalning"}
            {!isCheckoutLoading && <ArrowIcon />}
          </button>

          <p className="mt-4 flex items-center justify-center gap-2 text-center text-[11px] text-white/45">
            <LockIcon />
            Säker betalning hanteras av Stripe
          </p>
        </div>

        {savings > 0 && (
          <div className="border-t border-white/10 bg-[#173721] px-6 py-3 text-center text-xs font-medium text-[#bce5c8]">
            Du sparar {formatMoney(savings)} på beställningen
          </div>
        )}
      </aside>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#deded8] bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_35px_rgba(15,15,13,0.1)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-4">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.12em] text-[#777771]">Totalt</p>
            <p className="truncate text-lg font-semibold tracking-[-0.025em] tabular-nums text-[#161614]">
              {formatMoney(total)}
            </p>
          </div>
          <button
            type="button"
            onClick={onCheckout}
            disabled={isCheckoutLoading}
            className="ml-auto flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#11110f] px-4 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-65"
          >
            <LockIcon />
            {isCheckoutLoading ? "Öppnar…" : "Betala säkert"}
          </button>
        </div>
      </div>
    </>
  );
};
