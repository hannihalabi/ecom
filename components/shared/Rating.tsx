import { formatRating } from "@/lib/format";

type RatingProps = {
  rating: number;
  count: number;
  compact?: boolean;
};

export const Rating = ({ rating, count, compact }: RatingProps) => {
  const stars = Math.round(rating);
  return (
    <div className="flex items-center gap-1 text-xs text-slate-600">
      <span aria-hidden className="text-amber-500">
        {"*".repeat(stars)}
        {".".repeat(Math.max(0, 5 - stars))}
      </span>
      <span className="font-semibold text-slate-800">{formatRating(rating)}</span>
      {!compact && <span>({count.toLocaleString()} recensioner)</span>}
    </div>
  );
};
