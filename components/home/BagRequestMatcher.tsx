"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useDeferredValue, useMemo, useState } from "react";
import { searchCatalogProducts } from "@/lib/products";
import { useCart } from "@/store/cart";

const QUICK_SEARCHES = [
  "Speedy Trunk",
  "Neverfull",
  "Ophidia",
  "Boulogne",
] as const;

type BagRequestMatcherProps = {
  initialQuery?: string;
};

export const BagRequestMatcher = ({
  initialQuery = "",
}: BagRequestMatcherProps) => {
  const router = useRouter();
  const { addSpecialOrder } = useCart();
  const [query, setQuery] = useState(initialQuery);
  const deferredQuery = useDeferredValue(query);

  const normalizedQuery = deferredQuery.trim();
  const matchingProducts = useMemo(
    () => searchCatalogProducts(deferredQuery, 6),
    [deferredQuery],
  );
  const availableMatches = useMemo(
    () => matchingProducts.filter((product) => product.stock > 0),
    [matchingProducts],
  );
  const shouldShowResults = normalizedQuery.length >= 2;
  const shouldShowSpecialOrder = shouldShowResults && availableMatches.length === 0;

  const handleSpecialOrder = () => {
    const request = query.trim();
    if (request.length < 2) return;

    addSpecialOrder(request);
    startTransition(() => {
      router.push("/cart");
    });
  };

  return (
    <section
      id="onskemal"
      className="relative left-1/2 min-h-[calc(100svh-2rem)] w-screen -translate-x-1/2 overflow-hidden"
    >
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
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,11,7,0.3),rgba(18,11,7,0.78))]" />
      <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,rgba(245,226,191,0.28),transparent_60%)]" />

      <div className="relative mx-auto flex min-h-[calc(100svh-2rem)] max-w-6xl items-center px-4 py-8 md:px-6">
        <div className="mx-auto w-full max-w-2xl">
          <div className="lux-panel animate-rise stagger-1 p-4 md:p-6">
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--lux-accent-strong)]">
                  Sök modell
                </p>
                <h2 className="lux-title text-2xl leading-tight md:text-3xl">
                  Börja med ett namn, en modell eller en silhuett
                </h2>
                <p className="lux-subtitle text-sm md:text-base">
                  Exempel: Speedy Trunk, Neverfull eller Ophidia.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {QUICK_SEARCHES.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="rounded-full border border-[rgba(163,124,75,0.4)] bg-[rgba(255,248,239,0.72)] px-3 py-1.5 text-xs font-semibold text-[var(--lux-accent-strong)]"
                  >
                    {term}
                  </button>
                ))}
              </div>

              <label htmlFor="bag-search" className="sr-only">
                Sök efter väska
              </label>
              <div className="rounded-[28px] border border-[rgba(163,124,75,0.48)] bg-[rgba(255,250,243,0.88)] p-3 shadow-[0_18px_34px_rgba(47,31,15,0.12)]">
                <input
                  id="bag-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Skriv modellnamn, till exempel Speedy Trunk"
                  className="h-14 w-full bg-transparent px-3 text-base text-[var(--lux-ink)] outline-none placeholder:text-[rgba(111,90,71,0.78)]"
                />
              </div>

              {!shouldShowResults && (
                <div className="rounded-2xl border border-[rgba(163,124,75,0.3)] bg-[rgba(255,250,243,0.56)] p-4 text-sm text-[var(--lux-muted)]">
                  Börja skriva så visar vi relevanta modeller direkt, utan att du
                  behöver gå igenom hela sortimentet.
                </div>
              )}

              {availableMatches.length > 0 && shouldShowResults && (
                <div className="flex max-h-[26rem] flex-col gap-3 overflow-y-auto pr-1">
                  {availableMatches.map((product) => (
                    <Link
                      key={product.id}
                      href={`/p/${product.slug}`}
                      className="group flex items-center gap-3 rounded-2xl border border-[rgba(163,124,75,0.28)] bg-[rgba(255,250,243,0.82)] p-3 transition hover:border-[rgba(137,99,60,0.52)] hover:bg-[rgba(255,251,246,0.96)]"
                    >
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl">
                        <Image
                          src={product.images[0]}
                          alt={product.title}
                          fill
                          sizes="80px"
                          className="object-cover transition duration-300 group-hover:scale-[1.03]"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[var(--lux-ink)]">
                          {product.title}
                        </p>
                        <p className="mt-1 text-xs text-[var(--lux-muted)]">
                          {product.category} • {formatMoney(product.priceDiscounted)}
                        </p>
                        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--lux-accent-strong)]">
                          Visa modell
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {shouldShowSpecialOrder && (
                <div className="rounded-[28px] border border-[rgba(163,124,75,0.45)] bg-[linear-gradient(160deg,rgba(248,238,223,0.94),rgba(240,223,195,0.86))] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--lux-accent-strong)]">
                    Specialdesign
                  </p>
                  <h3 className="mt-2 text-2xl text-[var(--lux-ink)]">
                    Goda nyheter! Vi kan special designa väskan åt dig.
                  </h3>
                  <p className="mt-2 text-sm text-[var(--lux-muted)]">
                    Vi hittar ingen lagerförd träff på "{normalizedQuery}", men du kan
                    gå vidare med en special order direkt nu.
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={handleSpecialOrder}
                      className="rounded-full border border-[rgba(163,124,75,0.5)] bg-[var(--lux-dark)] px-5 py-3 text-sm font-semibold text-[rgba(251,239,221,0.96)]"
                    >
                      Skapa special order
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
