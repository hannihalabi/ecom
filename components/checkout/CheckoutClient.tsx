"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatMoney } from "@/lib/format";
import { track } from "@/lib/analytics";
import { useCart } from "@/store/cart";

export const CheckoutClient = () => {
  const { detailedItems, subtotal, savings, clear } = useCart();
  const [placed, setPlaced] = useState(false);

  useEffect(() => {
    track("begin_checkout", {
      items: detailedItems.map(({ item }) => item),
    });
  }, [detailedItems]);

  if (placed) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <h1 className="text-2xl font-semibold text-emerald-800">
          Beställning lagd!
        </h1>
        <p className="mt-2 text-sm text-emerald-700">
          Vi har skickat bekräftelse och leveransuppdateringar till din e-post.
        </p>
        <Link
          href="/orders"
          className="mt-4 inline-flex rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white"
        >
          Visa beställningar
        </Link>
      </div>
    );
  }

  if (detailedItems.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 text-center">
        <h1 className="text-xl font-semibold text-slate-900">Varukorgen är tom</h1>
        <p className="mt-2 text-sm text-slate-600">
          Lägg till produkter innan du går till kassan.
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
        >
          Handla erbjudanden
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <form
        className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm"
        onSubmit={(event) => {
          event.preventDefault();
          track("purchase", { total: subtotal });
          clear();
          setPlaced(true);
        }}
      >
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Kassa</h1>
          <p className="text-sm text-slate-600">
            Snabb, säker och mobilanpassad kassa.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700">
            Förnamn
            <input
              required
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Efternamn
            <input
              required
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700 md:col-span-2">
            E-post
            <input
              type="email"
              required
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700 md:col-span-2">
            Adress
            <input
              required
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Stad
            <input
              required
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Postnummer
            <input
              required
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-700">Betalning</p>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            <label className="flex items-center gap-2">
              <input type="radio" name="payment" defaultChecked />
              Kort som slutar på 4242 (demo)
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="payment" />
              PayPal (demo)
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
        >
          Lägg beställning
        </button>
        <p className="text-xs text-slate-500">
          Genom att lägga beställningen godkänner du våra villkor och returpolicy.
        </p>
      </form>

      <aside className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Ordersammanfattning</h2>
        <div className="space-y-3 text-sm text-slate-600">
          {detailedItems.map(({ product, item, lineTotal }) => (
            <div key={`${item.productId}-${item.selectedVariant ?? "default"}`}>
              <div className="flex items-center justify-between">
                <span>{product.title}</span>
                <span>{formatMoney(lineTotal)}</span>
              </div>
              {item.selectedVariant && (
                <span className="text-xs text-slate-400">{item.selectedVariant}</span>
              )}
            </div>
          ))}
        </div>
        <div className="rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          Du sparade {formatMoney(savings)} idag.
        </div>
        <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
          <span>Totalt</span>
          <span>{formatMoney(subtotal)}</span>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
          Säker kassa - Krypterad betalning - Snabb support
        </div>
      </aside>
    </div>
  );
};
