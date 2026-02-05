import Link from "next/link";

export const HeroBanner = () => {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-100 via-white to-rose-100 p-6 shadow-sm animate-rise">
      <div className="absolute -right-16 -top-10 h-40 w-40 rounded-full bg-rose-200/40 blur-3xl" />
      <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-amber-200/50 blur-3xl" />
      <div className="relative flex flex-col gap-4">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">
          Flash-vecka
        </span>
        <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
          Erbjudanden för snabb och smidig shopping
        </h1>
        <p className="max-w-xl text-sm text-slate-600">
          Upptäck trendiga favoriter, smarta hemuppgraderingar och fynd under
          3 000 kr. Nya erbjudanden släpps varje dag med tydliga rabatter och enkla returer.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/search"
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
          >
            Utforska erbjudanden
          </Link>
          <Link
            href="/search?q=flash%20deal"
            className="rounded-full border border-slate-900 px-5 py-3 text-sm font-semibold text-slate-900"
          >
            Flash-favoriter
          </Link>
        </div>
      </div>
    </section>
  );
};
