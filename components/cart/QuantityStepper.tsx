import type { CartItem } from "@/types";

type QuantityStepperProps = {
  item: CartItem;
  onChange: (quantity: number) => void;
};

export const QuantityStepper = ({ item, onChange }: QuantityStepperProps) => {
  return (
    <div className="inline-flex h-10 items-center rounded-full border border-[#d8d8d4] bg-[#f7f7f5] p-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(item.quantity - 1, 0))}
        className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-[#4b4b47] transition hover:bg-white hover:text-black"
        aria-label="Minska antal"
      >
        −
      </button>
      <span className="min-w-8 text-center text-sm font-semibold tabular-nums text-[#181816]">
        {item.quantity}
      </span>
      <button
        type="button"
        onClick={() => onChange(item.quantity + 1)}
        className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-[#4b4b47] transition hover:bg-white hover:text-black"
        aria-label="Öka antal"
      >
        +
      </button>
    </div>
  );
};
