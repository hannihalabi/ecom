import { ProductGridSkeleton } from "@/components/shared/Skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="h-40 animate-pulse rounded-3xl bg-slate-200" />
      <ProductGridSkeleton count={8} />
    </div>
  );
}
