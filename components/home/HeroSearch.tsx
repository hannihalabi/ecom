"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useDeferredValue,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { formatMoney } from "@/lib/format";
import { searchProductList } from "@/lib/products";
import { useCart } from "@/store/cart";
import type { Product } from "@/types";

const SearchIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="h-6 w-6"
  >
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4 4" />
  </svg>
);

type HeroSearchProps = {
  products: Product[];
};

type FlyingProduct = {
  productId: string;
  title: string;
  image: string;
  startLeft: number;
  startTop: number;
  travelX: number;
  travelY: number;
  midpointX: number;
  midpointY: number;
};

type FlightStyle = CSSProperties & {
  "--flight-x": string;
  "--flight-y": string;
  "--flight-mid-x": string;
  "--flight-mid-y": string;
};

export const HeroSearch = ({ products }: HeroSearchProps) => {
  const [query, setQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [flyingProduct, setFlyingProduct] = useState<FlyingProduct | null>(null);
  const [cartAnnouncement, setCartAnnouncement] = useState("");
  const searchRegionRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const deferredQuery = useDeferredValue(query);
  const { addItem } = useCart();

  const normalizedQuery = deferredQuery.trim();
  const results = useMemo(
    () => searchProductList(products, normalizedQuery),
    [normalizedQuery, products],
  );
  const isSearching = query !== deferredQuery;
  const showResults = isSearchActive && query.trim().length > 0;

  const commitProductToCart = (productId: string, title: string) => {
    addItem(productId, 1);
    setCartAnnouncement(`${title} har lagts i varukorgen.`);
  };

  const handleAdd = (
    product: Product,
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    if (flyingProduct) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const sourceElement = event.currentTarget
      .closest("article")
      ?.querySelector<HTMLElement>("[data-cart-source]");
    const cartElement = document.querySelector<HTMLElement>("[data-floating-cart]");

    if (prefersReducedMotion || !sourceElement || !cartElement) {
      commitProductToCart(product.id, product.title);
      return;
    }

    const sourceRect = sourceElement.getBoundingClientRect();
    const cartRect = cartElement.getBoundingClientRect();
    const animationSize = 64;
    const sourceCenterX = sourceRect.left + sourceRect.width / 2;
    const sourceCenterY = sourceRect.top + sourceRect.height / 2;
    const cartCenterX = cartRect.left + cartRect.width / 2;
    const cartCenterY = cartRect.top + cartRect.height / 2;
    const travelX = cartCenterX - sourceCenterX;
    const travelY = cartCenterY - sourceCenterY;

    setCartAnnouncement(`${product.title} läggs i varukorgen.`);
    setFlyingProduct({
      productId: product.id,
      title: product.title,
      image: product.images[0],
      startLeft: sourceCenterX - animationSize / 2,
      startTop: sourceCenterY - animationSize / 2,
      travelX,
      travelY,
      midpointX: travelX * 0.48,
      midpointY: travelY * 0.42 - 44,
    });
  };

  const handleFlightComplete = () => {
    if (!flyingProduct) return;

    commitProductToCart(flyingProduct.productId, flyingProduct.title);
    setFlyingProduct(null);

    document.querySelector<HTMLElement>("[data-floating-cart]")?.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.18)" },
        { transform: "scale(0.94)" },
        { transform: "scale(1)" },
      ],
      {
        duration: 420,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    );
  };

  const handleSearchBlur = (event: FocusEvent<HTMLDivElement>) => {
    const nextFocusedElement = event.relatedTarget;

    if (
      nextFocusedElement instanceof Node &&
      event.currentTarget.contains(nextFocusedElement)
    ) {
      return;
    }

    setIsSearchActive(false);
  };

  const handleOutsidePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (searchRegionRef.current?.contains(event.target as Node)) return;

    searchInputRef.current?.blur();
    setIsSearchActive(false);
  };

  return (
    <section className="bags-hero relative min-h-[100svh] overflow-hidden bg-black">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/mp4/LV1.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.38)_48%,rgba(0,0,0,0.58)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.2)_72%,rgba(0,0,0,0.48)_100%)]" />

      <div
        className="relative z-10 min-h-[100svh]"
        onPointerDown={handleOutsidePointerDown}
      >
        <div
          ref={searchRegionRef}
          onFocusCapture={() => setIsSearchActive(true)}
          onBlurCapture={handleSearchBlur}
          className={[
            "absolute left-4 right-4 mx-auto w-auto max-w-3xl transition-[top,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:left-6 sm:right-6",
            isSearchActive
              ? "top-3 translate-y-0 sm:top-6"
              : "top-1/2 -translate-y-1/2",
          ].join(" ")}
        >
          <label htmlFor="product-search" className="sr-only">
            Sök efter väska, modell eller varumärke
          </label>
          <div className="flex h-16 items-center gap-3 rounded-full border border-white/40 bg-white/95 px-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl transition focus-within:border-white sm:h-[4.5rem] sm:px-6">
            <span className="shrink-0 text-black/55">
              <SearchIcon />
            </span>
            <input
              id="product-search"
              ref={searchInputRef}
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") setQuery("");
              }}
              placeholder="Sök efter modell eller varumärke"
              autoComplete="off"
              spellCheck="false"
              className="min-w-0 flex-1 bg-transparent text-base font-medium text-[#111] outline-none placeholder:font-normal placeholder:text-black/45 sm:text-lg"
            />
            {query && (
              <button
                type="button"
                onPointerDown={(event) => event.preventDefault()}
                onClick={() => {
                  setQuery("");
                  searchInputRef.current?.focus();
                }}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl text-black/45 transition hover:bg-black/5 hover:text-black"
                aria-label="Rensa sökning"
              >
                ×
              </button>
            )}
          </div>

          {showResults && (
            <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] overflow-hidden rounded-[1.5rem] border border-white/20 bg-[#f7f7f5]/98 shadow-[0_32px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-black/10 px-5 py-3.5">
                <p className="text-sm font-medium text-black/65" aria-live="polite">
                  {isSearching
                    ? "Söker…"
                    : `${results.length} ${results.length === 1 ? "modell" : "modeller"}`}
                </p>
                {results.length > 0 && (
                  <p className="text-xs text-black/45">Aktuellt sortiment</p>
                )}
              </div>

              {!isSearching && results.length === 0 ? (
                <div className="px-6 py-10 text-center">
                  <p className="font-medium text-black">Ingen modell hittades</p>
                  <p className="mt-1 text-sm text-black/50">
                    Prova ett varumärke, till exempel LV eller Gucci.
                  </p>
                </div>
              ) : (
                <div className="grid max-h-[calc(100dvh-10rem)] grid-cols-1 gap-px overflow-y-auto overscroll-contain bg-black/10 sm:grid-cols-2">
                  {results.map((product) => (
                    <article
                      key={product.id}
                      className="grid grid-cols-[5.5rem_1fr] gap-3 bg-[#f7f7f5] p-3 sm:grid-cols-[6rem_1fr]"
                    >
                      <Link
                        href={`/p/${product.slug}`}
                        data-cart-source
                        className="relative aspect-square overflow-hidden rounded-xl bg-[#e9e7e2]"
                        aria-label={`Visa ${product.title}`}
                      >
                        <Image
                          src={product.images[0]}
                          alt={product.title}
                          fill
                          sizes="96px"
                          className="object-cover transition duration-300 hover:scale-[1.03]"
                        />
                      </Link>
                      <div className="flex min-w-0 flex-col justify-between gap-2 py-0.5">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-black/45">
                            {product.category}
                          </p>
                          <Link
                            href={`/p/${product.slug}`}
                            className="mt-1 line-clamp-2 block text-sm font-semibold leading-snug text-black hover:underline hover:underline-offset-2"
                          >
                            {product.title}
                          </Link>
                          <p className="mt-1 text-sm font-medium text-black/75">
                            {formatMoney(product.priceDiscounted)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/p/${product.slug}`}
                            className="rounded-full border border-black/15 px-3 py-1.5 text-[11px] font-semibold text-black transition hover:border-black/35"
                          >
                            Visa
                          </Link>
                          <button
                            type="button"
                            onPointerDown={(event) => event.preventDefault()}
                            onClick={(event) => handleAdd(product, event)}
                            disabled={Boolean(flyingProduct)}
                            className="rounded-full bg-black px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-black/75 disabled:cursor-wait disabled:opacity-55"
                          >
                            {flyingProduct?.productId === product.id
                              ? "Lägger till…"
                              : "Lägg till"}
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {cartAnnouncement}
      </p>

      {flyingProduct && (
        <div
          className="product-to-cart pointer-events-none fixed z-[70] h-16 w-16 overflow-hidden rounded-2xl border-2 border-white bg-white shadow-[0_14px_34px_rgba(0,0,0,0.42)]"
          style={
            {
              left: flyingProduct.startLeft,
              top: flyingProduct.startTop,
              "--flight-x": `${flyingProduct.travelX}px`,
              "--flight-y": `${flyingProduct.travelY}px`,
              "--flight-mid-x": `${flyingProduct.midpointX}px`,
              "--flight-mid-y": `${flyingProduct.midpointY}px`,
            } as FlightStyle
          }
          onAnimationEnd={handleFlightComplete}
          aria-hidden="true"
        >
          <Image
            src={flyingProduct.image}
            alt=""
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
      )}
    </section>
  );
};
