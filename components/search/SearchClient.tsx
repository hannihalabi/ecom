"use client";

import { useMemo, useState } from "react";
import { ProductGrid } from "@/components/product/ProductGrid";
import type { Product } from "@/types";

const POPULAR_SEARCHES = [
  "gucci",
  "louis vuitton",
  "monogram",
  "axelväska",
  "duffelväska",
];

const STORAGE_KEY = "dealflow_recent_searches";

type SearchClientProps = {
  products: Product[];
  categories: string[];
  initialQuery?: string;
  initialFilters?: {
    minPrice?: string;
    maxPrice?: string;
    minDiscount?: string;
    minRating?: string;
    category?: string;
    freeShipping?: boolean;
    sort?: string;
  };
};

export const SearchClient = ({
  products,
  categories,
  initialQuery = "",
  initialFilters,
}: SearchClientProps) => {
  const [query, setQuery] = useState(initialQuery);
  const [recent, setRecent] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as string[];
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      return [];
    }
  });
  const [category, setCategory] = useState<string>(
    initialFilters?.category ?? "all",
  );
  const [minPrice, setMinPrice] = useState(initialFilters?.minPrice ?? "");
  const [maxPrice, setMaxPrice] = useState(initialFilters?.maxPrice ?? "");
  const [minDiscount, setMinDiscount] = useState(
    initialFilters?.minDiscount ?? "",
  );
  const [minRating, setMinRating] = useState(initialFilters?.minRating ?? "");
  const [freeShipping, setFreeShipping] = useState(
    initialFilters?.freeShipping ?? false,
  );
  const [sort, setSort] = useState(initialFilters?.sort ?? "relevance");

  const saveRecent = (term: string) => {
    if (!term) return;
    const next = [term, ...recent.filter((item) => item !== term)].slice(0, 5);
    setRecent(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const suggestions = useMemo(() => {
    if (query.trim().length < 2) return [];
    const lower = query.toLowerCase();
    return products
      .filter(
        (product) =>
          product.title.toLowerCase().includes(lower) ||
          product.tags.some((tag) => tag.toLowerCase().includes(lower)),
      )
      .slice(0, 5)
      .map((product) => product.title);
  }, [products, query]);

  const filtered = useMemo(() => {
    const lower = query.toLowerCase();
    const min = minPrice ? Number(minPrice) : undefined;
    const max = maxPrice ? Number(maxPrice) : undefined;
    const discount = minDiscount ? Number(minDiscount) : undefined;
    const rating = minRating ? Number(minRating) : undefined;

    let results = products.filter((product) => {
      const matchesQuery =
        !lower ||
        product.title.toLowerCase().includes(lower) ||
        product.category.toLowerCase().includes(lower) ||
        product.tags.some((tag) => tag.toLowerCase().includes(lower));

      const matchesCategory =
        category === "all" || product.category === category;

      const matchesPrice =
        (min === undefined || product.priceDiscounted >= min) &&
        (max === undefined || product.priceDiscounted <= max);

      const matchesDiscount =
        discount === undefined ||
        (product.discountPercent ?? 0) >= discount;

      const matchesRating = rating === undefined || product.rating >= rating;

      const matchesShipping =
        !freeShipping ||
        product.shipping.price === 0 ||
        (product.shipping.freeOver && product.shipping.freeOver <= product.priceDiscounted);

      return (
        matchesQuery &&
        matchesCategory &&
        matchesPrice &&
        matchesDiscount &&
        matchesRating &&
        matchesShipping
      );
    });

    switch (sort) {
      case "price-asc":
        results = [...results].sort(
          (a, b) => a.priceDiscounted - b.priceDiscounted,
        );
        break;
      case "price-desc":
        results = [...results].sort(
          (a, b) => b.priceDiscounted - a.priceDiscounted,
        );
        break;
      case "discount":
        results = [...results].sort(
          (a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0),
        );
        break;
      case "rating":
        results = [...results].sort(
          (a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount,
        );
        break;
      default:
        break;
    }

    return results;
  }, [
    products,
    query,
    category,
    minPrice,
    maxPrice,
    minDiscount,
    minRating,
    freeShipping,
    sort,
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <label className="text-sm font-semibold text-slate-700">Sök</label>
        <div className="relative mt-2">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onBlur={() => saveRecent(query.trim())}
            placeholder="Sök erbjudanden, varumärken, kategorier..."
            className="w-full rounded-full border border-slate-200 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none"
          />
          {suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-12 z-20 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    setQuery(suggestion);
                    saveRecent(suggestion);
                  }}
                  className="w-full rounded-xl px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {(recent.length > 0 || POPULAR_SEARCHES.length > 0) && (
          <div className="mt-4 space-y-2">
            {recent.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">
                  Senaste:
                </span>
                {recent.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600"
                  >
                    {term}
                  </button>
                ))}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Populärt:</span>
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-700"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_3fr]">
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
          <div>
            <p className="text-sm font-semibold text-slate-700">Kategori</p>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <option value="all">Alla kategorier</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-700">Pris</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <input
                value={minPrice}
                onChange={(event) => setMinPrice(event.target.value)}
                placeholder="Min"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
              <input
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                placeholder="Max"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-700">Rabatt</p>
            <input
              value={minDiscount}
              onChange={(event) => setMinDiscount(event.target.value)}
              placeholder="Min %"
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-700">Betyg</p>
            <select
              value={minRating}
              onChange={(event) => setMinRating(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <option value="">Alla betyg</option>
              <option value="4">4+ stjärnor</option>
              <option value="4.5">4.5+ stjärnor</option>
              <option value="4.7">4.7+ stjärnor</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={freeShipping}
              onChange={(event) => setFreeShipping(event.target.checked)}
            />
            Fri frakt
          </label>

          <div>
            <p className="text-sm font-semibold text-slate-700">Sortera efter</p>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <option value="relevance">Mest relevant</option>
              <option value="price-asc">Pris: lägst till högst</option>
              <option value="price-desc">Pris: högst till lägst</option>
              <option value="discount">Störst rabatt</option>
              <option value="rating">Högst betyg</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">
              {filtered.length} träffar
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("all");
                setMinPrice("");
                setMaxPrice("");
                setMinDiscount("");
                setMinRating("");
                setFreeShipping(false);
                setSort("relevance");
              }}
              className="text-xs font-semibold text-rose-600"
            >
              Rensa filter
            </button>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-8 text-center text-sm text-slate-600">
              Inga träffar hittades. Prova en annan sökning.
            </div>
          ) : (
            <ProductGrid products={filtered} />
          )}
        </div>
      </div>
    </div>
  );
};
