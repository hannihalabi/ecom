import { formatMoney } from "@/lib/format";
import { Badge } from "@/components/shared/Badge";

type PriceBlockProps = {
  priceOriginal: number;
  priceDiscounted: number;
  discountPercent?: number;
  className?: string;
};

export const PriceBlock = ({
  priceOriginal,
  priceDiscounted,
  discountPercent,
  className,
}: PriceBlockProps) => {
  return (
    <div className={["flex flex-wrap items-center gap-2", className ?? ""].join(" ")}>
      <span className="text-xl font-semibold text-slate-900">
        {formatMoney(priceDiscounted)}
      </span>
      <span className="text-sm text-slate-400 line-through">
        {formatMoney(priceOriginal)}
      </span>
      {discountPercent && (
        <Badge label={`-${discountPercent}%`} variant="primary" />
      )}
    </div>
  );
};
