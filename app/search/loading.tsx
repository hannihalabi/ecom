import { ProductGridSkeleton } from "@/components/shared/Skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-10 w-40 animate-pulse rounded-full bg-slate-200" />
      <div className="h-48 animate-pulse rounded-2xl bg-slate-200" />
      <ProductGridSkeleton count={8} />
    </div>
  );
}
