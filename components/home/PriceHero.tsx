"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { validatePromotionCode } from "@/lib/promotions";
import { WEBSITE_OFFERS } from "@/lib/websiteOffers";

export const PriceHero = () => {
  const router = useRouter();
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [promotionInput, setPromotionInput] = useState("");
  const [activePromotionCode, setActivePromotionCode] = useState<string | null>(null);
  const [promotionError, setPromotionError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSelectOffer = (offerId: string) => {
    setSelectedOfferId(offerId);
    startTransition(() => {
      const params = new URLSearchParams({ offer: offerId });
      if (activePromotionCode) {
        params.set("promo", activePromotionCode);
      }
      router.push(`/checkout?${params.toString()}`);
    });
  };

  const handleActivatePromotion = () => {
    const { normalized, error } = validatePromotionCode(promotionInput);
    if (error) {
      setPromotionError(error);
      setActivePromotionCode(null);
      return;
    }

    setPromotionInput(normalized);
    setActivePromotionCode(normalized);
    setPromotionError(null);
  };

  return (
    <section className="relative left-1/2 min-h-screen w-screen -translate-x-1/2 overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/mp4/gucci1.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,11,7,0.24),rgba(18,11,7,0.74))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,226,191,0.2),transparent_56%)]" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-10 md:px-6">
        <div className="lux-panel w-full max-w-2xl p-6 text-center md:p-8">
          <div className="space-y-6">
            <h1 className="lux-title text-3xl leading-tight md:text-5xl">
              Handgjord väska likt originalet i topp klass
            </h1>

            <div className="flex flex-col gap-3">
              {WEBSITE_OFFERS.map((offer) => {
                const isLoading = isPending && selectedOfferId === offer.id;

                return (
                  <button
                    key={offer.id}
                    type="button"
                    onClick={() => handleSelectOffer(offer.id)}
                    disabled={isPending}
                    className="rounded-full border border-[rgba(163,124,75,0.45)] bg-[rgba(255,248,239,0.88)] px-6 py-4 text-lg font-semibold text-[var(--lux-dark)] shadow-[0_18px_34px_rgba(47,31,15,0.12)] transition hover:border-[rgba(137,99,60,0.58)] hover:bg-[rgba(255,251,246,0.96)] disabled:cursor-wait disabled:opacity-80 md:text-xl"
                  >
                    {isLoading ? "Vidare..." : `${offer.price} kr`}
                  </button>
                );
              })}
            </div>

            <div className="rounded-[28px] border border-[rgba(163,124,75,0.35)] bg-[rgba(255,250,243,0.72)] p-4 text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--lux-accent-strong)]">
                Rabattkod
              </p>
              <form
                className="mt-3 flex flex-col gap-2 sm:flex-row"
                onSubmit={(event) => {
                  event.preventDefault();
                  handleActivatePromotion();
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
                  placeholder="Skriv rabattkod"
                  className="h-12 flex-1 rounded-full border border-[rgba(163,124,75,0.35)] bg-[rgba(255,255,255,0.82)] px-4 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--lux-ink)] outline-none placeholder:text-[rgba(111,90,71,0.7)]"
                />
                <button
                  type="submit"
                  className="h-12 rounded-full border border-[rgba(163,124,75,0.45)] bg-[var(--lux-dark)] px-5 text-sm font-semibold text-[rgba(251,239,221,0.96)]"
                >
                  Aktivera
                </button>
              </form>
              {activePromotionCode && (
                <p className="mt-3 text-sm font-semibold text-emerald-700">
                  Kod {activePromotionCode} aktiv. 25% rabatt tillampas i kassan.
                </p>
              )}
              {promotionError && (
                <p className="mt-3 text-sm text-rose-700">{promotionError}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
