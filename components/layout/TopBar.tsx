import Link from "next/link";

export const TopBar = () => {
  return (
    <header className="sticky top-0 z-30 hidden border-b border-white/60 bg-white/80 backdrop-blur md:block">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-white">
            SD
          </span>
          <span className="text-lg">SparkDeal</span>
        </Link>
        <Link
          href="/search"
          className="hidden md:block md:flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 shadow-sm transition hover:border-slate-300"
        >
          Sök erbjudanden, varumärken, kategorier...
        </Link>
        <div className="hidden text-xs text-slate-500 md:block">
          Fri frakt över 3 000 kr - 30 dagars öppet köp
        </div>
      </div>
    </header>
  );
};
