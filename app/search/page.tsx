import { SearchClient } from "@/components/search/SearchClient";
import { products } from "@/data/products";
import { getCategories } from "@/lib/products";

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{
    q?: string;
    min?: string;
    max?: string;
    discount?: string;
    rating?: string;
    category?: string;
    free?: string;
    sort?: string;
  }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const categories = getCategories();
  return (
    <div className="flex flex-col gap-6">
      <SearchClient
        products={products}
        categories={categories}
        initialQuery={params?.q ?? ""}
        initialFilters={{
          minPrice: params?.min,
          maxPrice: params?.max,
          minDiscount: params?.discount,
          minRating: params?.rating,
          category: params?.category,
          freeShipping: params?.free === "1" || params?.free === "true",
          sort: params?.sort,
        }}
      />
    </div>
  );
}
