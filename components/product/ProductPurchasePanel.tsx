"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PriceBlock } from "@/components/product/PriceBlock";
import { DealCountdown } from "@/components/product/DealCountdown";
import { formatMoney } from "@/lib/format";
import { formatDeliveryEta } from "@/lib/shipping";
import { useCart } from "@/store/cart";
import type { Product } from "@/types";

const buildVariantLabel = (selection: Record<string, string>) => {
  const entries = Object.entries(selection);
  if (!entries.length) return undefined;
  return entries.map(([name, value]) => `${name}: ${value}`).join(" / ");
};

type ProductPurchasePanelProps = {
  product: Product;
};

export const ProductPurchasePanel = ({ product }: ProductPurchasePanelProps) => {
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selection, setSelection] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    product.variants?.forEach((variant) => {
      if (variant.options.length > 0) {
        initial[variant.name] = variant.options[0];
      }
    });
    return initial;
  });

  const selectedVariant = useMemo(() => buildVariantLabel(selection), [selection]);

  const onAdd = () => addItem(product.id, quantity, selectedVariant);

  const onBuy = () => {
    addItem(product.id, quantity, selectedVariant);
    router.push("/checkout");
  };

  const shippingLabel =
    product.shipping.price === 0
      ? "Fri frakt"
      : `${formatMoney(product.shipping.price)} frakt`;

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex flex-col gap-2">
        <PriceBlock
          priceOriginal={product.priceOriginal}
          priceDiscounted={product.priceDiscounted}
          discountPercent={product.discountPercent}
        />
        <div className="text-xs text-slate-500">
          {shippingLabel} - Leverans om {formatDeliveryEta(product.shipping)}
        </div>
        {product.shipping.freeOver && product.shipping.freeOver > 0 && (
          <div className="text-xs text-emerald-600">
            Fri frakt över {formatMoney(product.shipping.freeOver)}
          </div>
        )}
        {product.isFlashDeal && product.flashDealEndsAt && (
          <DealCountdown endsAt={product.flashDealEndsAt} />
        )}
      </div>

      {product.variants && product.variants.length > 0 && (
        <div className="grid gap-3">
          {product.variants.map((variant) => (
            <label key={variant.name} className="text-sm font-medium">
              <span className="text-slate-600">{variant.name}</span>
              <select
                value={selection[variant.name]}
                onChange={(event) =>
                  setSelection((prev) => ({
                    ...prev,
                    [variant.name]: event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                {variant.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-full border border-slate-200">
          <button
            type="button"
            onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-2 text-sm"
            aria-label="Minska antal"
          >
            -
          </button>
          <span className="min-w-[32px] text-center text-sm font-semibold">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((prev) => prev + 1)}
            className="px-3 py-2 text-sm"
            aria-label="Öka antal"
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="flex-1 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
        >
          Lägg i varukorg
        </button>
      </div>

      <button
        type="button"
        onClick={onBuy}
        className="rounded-full border border-slate-900 px-4 py-3 text-sm font-semibold text-slate-900"
      >
        Köp nu
      </button>

      <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
        <p className="font-semibold text-slate-700">Säker kassa</p>
        <p>Krypterade betalningar - 30 dagars öppet köp - Support 7 dagar i veckan</p>
      </div>

      <div className="fixed bottom-16 left-0 right-0 z-40 mx-auto w-full max-w-6xl md:hidden">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg">
          <div>
            <p className="text-xs text-slate-500">Idag</p>
            <p className="text-base font-semibold text-slate-900">
              {formatMoney(product.priceDiscounted)}
            </p>
          </div>
          <button
            type="button"
            onClick={onAdd}
            className="flex-1 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
          >
            Lägg i varukorg
          </button>
          <button
            type="button"
            onClick={onBuy}
            className="rounded-full border border-slate-900 px-4 py-3 text-sm font-semibold text-slate-900"
          >
            Köp
          </button>
        </div>
      </div>
    </section>
  );
};
