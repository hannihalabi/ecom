import { Skeleton } from "@/components/shared/Skeleton";

export default function Loading() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <Skeleton className="aspect-square w-full rounded-2xl" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}
