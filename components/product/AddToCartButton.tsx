"use client";

import { useCart } from "@/store/cart";

type AddToCartButtonProps = {
  productId: string;
  className?: string;
};

export const AddToCartButton = ({ productId, className }: AddToCartButtonProps) => {
  const { addItem } = useCart();

  return (
    <button
      type="button"
      onClick={() => addItem(productId, 1)}
      className={[
        "w-full rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800",
        className ?? "",
      ].join(" ")}
    >
      Lägg i varukorg
    </button>
  );
};
