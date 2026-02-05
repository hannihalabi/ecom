import Link from "next/link";
import { HeroBanner } from "@/components/home/HeroBanner";
import { SectionHeader } from "@/components/home/SectionHeader";
import { CategoryChips } from "@/components/home/CategoryChips";
import { ProductGrid } from "@/components/product/ProductGrid";
import {
  getCategories,
  getFlashDeals,
  getForYou,
  getPaginated,
  getTrending,
  getUnderPrice,
} from "@/lib/products";

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const pageValue = searchParams ? await searchParams : undefined;
  const page = Number(pageValue?.page ?? "1");
  const perPage = 12;
  const { items, totalPages } = getPaginated(page, perPage);

  const flashDeals = getFlashDeals();
  const trending = getTrending();
  const underThreeThousand = getUnderPrice(3000);
  const forYou = getForYou();
  const categories = getCategories();

  return (
    <div className="flex flex-col gap-10">
      <HeroBanner />

      <section className="flex flex-col gap-4 animate-fade">
        <SectionHeader
          title="Handla efter kategori"
          subtitle="Tryck på en kategori för att gå direkt till erbjudandena."
        />
        <CategoryChips categories={categories} />
      </section>

      <section className="flex flex-col gap-4 animate-fade">
        <SectionHeader
          title="Flash-erbjudanden"
          subtitle="Tidsbegränsade fynd du kan ta del av idag."
          action={
            <Link href="/search?q=flash" className="text-xs font-semibold text-rose-600">
              Se alla
            </Link>
          }
        />
        <ProductGrid products={flashDeals} />
      </section>

      <section className="flex flex-col gap-4 animate-fade">
        <SectionHeader
          title="Trendigt just nu"
          subtitle="Populära produkter som snabbt läggs i varukorgen."
          action={
            <Link href="/search?q=trending" className="text-xs font-semibold text-rose-600">
              Utforska
            </Link>
          }
        />
        <ProductGrid products={trending} />
      </section>

      <section className="flex flex-col gap-4 animate-fade">
        <SectionHeader
          title="Under 3 000 kr"
          subtitle="Prisvärda uppgraderingar som gör stor skillnad."
          action={
            <Link href="/search?max=3000" className="text-xs font-semibold text-rose-600">
              Visa alla
            </Link>
          }
        />
        <ProductGrid products={underThreeThousand} />
      </section>

      <section className="flex flex-col gap-4 animate-fade">
        <SectionHeader
          title="För dig"
          subtitle="En personlig mix av utvalda favoriter."
        />
        <ProductGrid products={forYou} />
      </section>

      <section className="flex flex-col gap-4 animate-fade">
        <SectionHeader
          title="Alla erbjudanden"
          subtitle="Fortsätt scrolla för fler släpp."
        />
        <ProductGrid products={items} />
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>
            Sida {page} av {totalPages}
          </span>
          <div className="flex gap-3">
            {page > 1 && (
              <Link
                href={`/?page=${page - 1}`}
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold"
              >
                Föregående
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/?page=${page + 1}`}
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold"
              >
                Nästa
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
