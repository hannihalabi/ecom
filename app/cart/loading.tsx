import { ProductGridSkeleton } from "@/components/shared/Skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-4">
      <ProductGridSkeleton count={4} />
    </div>
  );
}
