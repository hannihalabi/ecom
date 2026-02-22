import Link from "next/link";
import { formatRating } from "@/lib/format";

type RatingProps = {
  rating: number;
  count: number;
  compact?: boolean;
  showCount?: boolean;
  countHref?: string;
};

export const Rating = ({
  rating,
  count,
  compact,
  showCount,
  countHref,
}: RatingProps) => {
  const stars = Math.round(rating);
  const filled = "★".repeat(stars);
  const empty = "☆".repeat(Math.max(0, 5 - stars));
  const shouldShowCount = showCount ?? !compact;
  const countText = `${count.toLocaleString("sv-SE")} recensioner`;

  return (
    <div className="flex items-center gap-1.5 text-xs text-[var(--lux-muted)]">
      <span aria-hidden className="text-[var(--lux-gold)]">
        {filled}
        <span className="text-[rgba(183,153,116,0.45)]">{empty}</span>
      </span>
      <span className="font-semibold text-[var(--lux-accent-strong)]">
        {formatRating(rating)}
      </span>
      {shouldShowCount &&
        (countHref ? (
          <Link
            href={countHref}
            className="underline decoration-[rgba(137,99,60,0.55)] underline-offset-2"
          >
            {compact ? countText : `(${countText})`}
          </Link>
        ) : (
          <span>{compact ? countText : `(${countText})`}</span>
        ))}
    </div>
  );
};
