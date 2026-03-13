import { BagRequestMatcher } from "@/components/home/BagRequestMatcher";

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{
    q?: string;
  }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  return (
    <div className="pb-2">
      <BagRequestMatcher initialQuery={params?.q ?? ""} />
    </div>
  );
}
