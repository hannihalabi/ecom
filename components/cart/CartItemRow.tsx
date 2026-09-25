import Image from "next/image";
import Link from "next/link";
import { QuantityStepper } from "@/components/cart/QuantityStepper";
import { formatMoney } from "@/lib/format";
import { isSpecialOrderProductId } from "@/lib/specialOrder";
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
  const lineSavings =
    (product.priceOriginal - product.priceDiscounted) * item.quantity;

  const productImage = (
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#f1f1ee]">
      <Image
        src={product.images[0]}
        alt={product.title}
        fill
        className="object-cover transition duration-300 hover:scale-[1.025]"
        sizes="(max-width: 640px) 104px, 136px"
      />
    </div>
  );

  return (
    <article className="grid grid-cols-[6.5rem_1fr] gap-4 rounded-[1.5rem] border border-[#e3e3df] bg-white p-4 shadow-[0_12px_35px_rgba(15,15,13,0.045)] sm:grid-cols-[8.5rem_1fr] sm:gap-6 sm:p-5">
      {isSpecialOrder ? (
        productImage
      ) : (
        <Link href={`/p/${product.slug}`} aria-label={`Visa ${product.title}`}>
          {productImage}
        </Link>
      )}

      <div className="flex min-w-0 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#85857e]">
              {product.category}
            </p>
            {isSpecialOrder ? (
              <p className="text-sm font-semibold leading-snug text-[#171715] sm:text-base">
                {product.title}
              </p>
            ) : (
              <Link
                href={`/p/${product.slug}`}
                className="line-clamp-2 text-sm font-semibold leading-snug text-[#171715] hover:underline hover:underline-offset-4 sm:text-base"
              >
                {product.title}
              </Link>
            )}
            {!isSpecialOrder && item.selectedVariant && (
              <p className="mt-1 text-xs text-[#74746e]">{item.selectedVariant}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="shrink-0 text-xs font-medium text-[#777771] underline decoration-[#c7c7c1] underline-offset-4 transition hover:text-black"
          >
            Ta bort
          </button>
        </div>

        <div className="mt-3">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-sm font-semibold tabular-nums text-[#171715] sm:text-base">
              {formatMoney(product.priceDiscounted)}
            </span>
            <span className="text-xs tabular-nums text-[#9b9b95] line-through">
              {formatMoney(product.priceOriginal)}
            </span>
          </div>
          <span className="mt-2 inline-flex whitespace-nowrap rounded-full bg-[#edf6ef] px-2.5 py-1 text-[10px] font-semibold text-[#2f6942]">
            Spara {formatMoney(lineSavings)}
          </span>
        </div>

        {isSpecialOrder && (
          <label className="mt-3 text-xs font-semibold text-[#5f5f59]">
            Önskad modell
            <textarea
              rows={3}
              value={item.specialRequest ?? ""}
              onChange={(event) => onUpdateRequest?.(event.target.value)}
              placeholder="Beskriv modellen du vill att vi ska ta fram"
              className="mt-2 w-full rounded-2xl border border-[#d8d8d4] bg-[#f8f8f6] px-3 py-2 text-sm font-normal text-[#343430] outline-none focus:border-[#171715]"
            />
          </label>
        )}

        <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-[#edede9] pt-4">
          {isSpecialOrder ? (
            <div className="rounded-full border border-[#d8d8d4] px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#686862]">
              Designbrief × {item.quantity}
            </div>
          ) : (
            <QuantityStepper item={item} onChange={onUpdate} />
          )}
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.12em] text-[#8b8b84]">
              Summa
            </p>
            <p className="mt-0.5 text-sm font-semibold tabular-nums text-[#171715] sm:text-base">
              {formatMoney(lineTotal)}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};
