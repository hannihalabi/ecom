export const Skeleton = ({ className }: { className?: string }) => (
  <div
    className={[
      "animate-pulse rounded-lg bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200",
      className ?? "",
    ].join(" ")}
  />
);

export const ProductCardSkeleton = () => (
  <div className="flex flex-col gap-3 border border-slate-200 bg-white/70 p-3 shadow-sm">
    <Skeleton className="h-36 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <div className="flex gap-2">
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-6 w-20" />
    </div>
    <Skeleton className="h-8 w-full" />
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }: { count?: number }) => (
  <div className="grid grid-cols-2 gap-0 md:grid-cols-4 md:gap-3 -mx-4 md:mx-0">
    {Array.from({ length: count }).map((_, index) => (
      <ProductCardSkeleton key={`skeleton-${index}`} />
    ))}
  </div>
);
