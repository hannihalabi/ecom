import Link from "next/link";
import { ProductGrid } from "@/components/product/ProductGrid";
import {
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

  const trending = getTrending();
  const underThreeThousand = getUnderPrice(3000);
  const forYou = getForYou();

  return (
    <div className="flex flex-col gap-12 pb-2">
      <section className="relative left-1/2 -mt-6 h-[100svh] w-screen -translate-x-1/2 overflow-hidden md:hidden">
        <video
          className="h-full w-full object-cover"
          src="/mp4/gucci1.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label="Produktvideo"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,14,8,0.12),rgba(23,14,8,0.45))]" />
      </section>

      <section className="flex flex-col gap-4 animate-fade">
        <ProductGrid products={trending} />
      </section>

      <section className="flex flex-col gap-4 animate-fade">
        <ProductGrid products={underThreeThousand} />
      </section>

      <section className="flex flex-col gap-4 animate-fade">
        <ProductGrid products={forYou} />
      </section>

      <section className="flex flex-col gap-4 animate-fade">
        <ProductGrid products={items} />
        <div className="flex items-center justify-between text-sm text-[var(--lux-muted)]">
          <span>
            Sida {page} av {totalPages}
          </span>
          <div className="flex gap-3">
            {page > 1 && (
              <Link
                href={`/?page=${page - 1}`}
                className="rounded-full border border-[rgba(163,124,75,0.5)] bg-[rgba(248,238,223,0.9)] px-4 py-2 text-xs font-semibold text-[var(--lux-accent-strong)]"
              >
                Föregående
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/?page=${page + 1}`}
                className="rounded-full border border-[rgba(163,124,75,0.5)] bg-[rgba(248,238,223,0.9)] px-4 py-2 text-xs font-semibold text-[var(--lux-accent-strong)]"
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
