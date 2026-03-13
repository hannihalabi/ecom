import Image from "next/image";
import Link from "next/link";
import { formatMoney } from "@/lib/format";
import { isSpecialOrderProductId } from "@/lib/specialOrder";
import { QuantityStepper } from "@/components/cart/QuantityStepper";
import type { CartItem, Product } from "@/types";

type CartItemRowProps = {
  item: CartItem;
  product: Product;
  lineTotal: number;
  onUpdate: (quantity: number) => void;
  onUpdateRequest?: (request: string) => void;
  onRemove: () => void;
};

export const CartItemRow = ({
  item,
  product,
  lineTotal,
  onUpdate,
  onUpdateRequest,
  onRemove,
}: CartItemRowProps) => {
  const isSpecialOrder = isSpecialOrderProductId(item.productId);

  return (
    <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-sm">
      {isSpecialOrder ? (
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl">
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
      ) : (
        <Link href={`/p/${product.slug}`} className="relative h-24 w-24 flex-shrink-0">
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="rounded-xl object-cover"
            sizes="96px"
          />
        </Link>
      )}
      <div className="flex flex-1 flex-col gap-2">
        <div>
          {isSpecialOrder ? (
            <p className="text-sm font-semibold">{product.title}</p>
          ) : (
            <Link href={`/p/${product.slug}`} className="text-sm font-semibold">
              {product.title}
            </Link>
          )}
          {!isSpecialOrder && item.selectedVariant && (
            <p className="text-xs text-slate-500">{item.selectedVariant}</p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-semibold text-slate-900">
            {formatMoney(product.priceDiscounted)}
          </span>
          <span className="text-xs text-slate-400 line-through">
            {formatMoney(product.priceOriginal)}
          </span>
          <span className="text-xs text-emerald-600">
            Du sparar {formatMoney(product.priceOriginal - product.priceDiscounted)}
          </span>
        </div>
        {isSpecialOrder && (
          <label className="text-xs font-semibold text-slate-600">
            Önskad modell
            <textarea
              rows={3}
              value={item.specialRequest ?? ""}
              onChange={(event) => onUpdateRequest?.(event.target.value)}
              placeholder="Beskriv modellen du vill att vi ska ta fram"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-700 outline-none focus:border-slate-300"
            />
          </label>
        )}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {isSpecialOrder ? (
            <div className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
              Designbrief x {item.quantity}
            </div>
          ) : (
            <QuantityStepper item={item} onChange={onUpdate} />
          )}
          <div className="text-sm font-semibold text-slate-900">
            {formatMoney(lineTotal)}
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-left text-xs font-semibold text-rose-600"
        >
          Ta bort
        </button>
      </div>
    </div>
  );
};
