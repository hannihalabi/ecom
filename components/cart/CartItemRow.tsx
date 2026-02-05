import Image from "next/image";
import Link from "next/link";
import { formatMoney } from "@/lib/format";
import { QuantityStepper } from "@/components/cart/QuantityStepper";
import type { CartItem, Product } from "@/types";

type CartItemRowProps = {
  item: CartItem;
  product: Product;
  lineTotal: number;
  onUpdate: (quantity: number) => void;
  onRemove: () => void;
};

export const CartItemRow = ({
  item,
  product,
  lineTotal,
  onUpdate,
  onRemove,
}: CartItemRowProps) => {
  return (
    <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-sm">
      <Link href={`/p/${product.slug}`} className="relative h-24 w-24 flex-shrink-0">
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          className="rounded-xl object-cover"
          sizes="96px"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2">
        <div>
          <Link href={`/p/${product.slug}`} className="text-sm font-semibold">
            {product.title}
          </Link>
          {item.selectedVariant && (
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
        <div className="flex flex-wrap items-center justify-between gap-2">
          <QuantityStepper item={item} onChange={onUpdate} />
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
