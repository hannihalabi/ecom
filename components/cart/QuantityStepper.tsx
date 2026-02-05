import type { CartItem } from "@/types";

type QuantityStepperProps = {
  item: CartItem;
  onChange: (quantity: number) => void;
};

export const QuantityStepper = ({ item, onChange }: QuantityStepperProps) => {
  return (
    <div className="flex items-center rounded-full border border-slate-200">
      <button
        type="button"
        onClick={() => onChange(Math.max(item.quantity - 1, 0))}
        className="px-3 py-1 text-sm"
        aria-label="Minska antal"
      >
        -
      </button>
      <span className="min-w-[24px] text-center text-sm font-semibold">
        {item.quantity}
      </span>
      <button
        type="button"
        onClick={() => onChange(item.quantity + 1)}
        className="px-3 py-1 text-sm"
        aria-label="Öka antal"
      >
        +
      </button>
    </div>
  );
};
