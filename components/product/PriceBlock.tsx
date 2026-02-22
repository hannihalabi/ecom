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
    <div className={["flex flex-wrap items-end gap-2", className ?? ""].join(" ")}>
      <span className="[font-family:var(--font-display)] text-[2.15rem] leading-none text-[var(--lux-ink)] md:text-[2.35rem]">
        {formatMoney(priceDiscounted)}
      </span>
      <span className="pb-1 text-sm text-[var(--lux-muted)] line-through decoration-[rgba(137,99,60,0.55)]">
        {formatMoney(priceOriginal)}
      </span>
      {discountPercent && (
        <Badge label={`-${discountPercent}%`} variant="primary" className="mb-1" />
      )}
    </div>
  );
};
