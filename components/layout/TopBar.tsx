import Link from "next/link";
import { formatMoney } from "@/lib/format";
import { SHIPPING_COST_PER_PRODUCT } from "@/lib/shipping";

export const TopBar = () => {
  return (
    <header className="sticky top-0 z-30 hidden border-b border-[rgba(166,123,78,0.45)] bg-[rgba(247,238,224,0.8)] backdrop-blur-md md:block">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-3 font-semibold text-[var(--lux-dark)]">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[rgba(205,165,111,0.5)] bg-[linear-gradient(145deg,#19120d,#2f1f13)] text-sm font-semibold tracking-[0.08em] text-[var(--lux-gold)]">
            SD
          </span>
          <span className="[font-family:var(--font-display)] text-2xl tracking-[0.08em]">
            SparkDeal
          </span>
        </Link>
        <Link
          href="/search"
          className="hidden rounded-full border border-[rgba(166,123,78,0.45)] bg-[rgba(251,246,237,0.92)] px-5 py-2 text-sm text-[var(--lux-muted)] shadow-[0_6px_18px_rgba(47,31,15,0.08)] transition hover:border-[rgba(137,99,60,0.55)] md:block md:flex-1"
        >
          Sök erbjudanden, varumärken, kategorier...
        </Link>
        <div className="hidden text-[11px] uppercase tracking-[0.12em] text-[var(--lux-muted)] md:block">
          {formatMoney(SHIPPING_COST_PER_PRODUCT)} frakt per produkt | 30 dagars öppet köp
        </div>
      </div>
    </header>
  );
};
