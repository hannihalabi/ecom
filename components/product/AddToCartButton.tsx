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
        "w-full rounded-full border border-[rgba(205,165,111,0.55)] bg-[linear-gradient(140deg,#2b1b11_0%,#17100a_100%)] px-4 py-2.5 text-sm font-semibold tracking-[0.02em] text-[rgba(245,224,191,0.98)] shadow-[0_8px_18px_rgba(29,18,9,0.34)] transition hover:border-[rgba(225,190,140,0.68)] hover:text-[#fff1d9]",
        className ?? "",
      ].join(" ")}
    >
      Lägg i varukorg
    </button>
  );
};
