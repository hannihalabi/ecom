import Link from "next/link";

export const metadata = {
  title: "Betalning avbruten",
};

export default function CheckoutCancelPage() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
      <h1 className="text-2xl font-semibold text-amber-700">Betalningen avbröts</h1>
      <p className="mt-2 text-sm text-amber-700">
        Ingen debitering gjordes. Du kan gå tillbaka till kassan och försöka igen.
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/checkout"
          className="inline-flex rounded-full bg-amber-700 px-5 py-3 text-sm font-semibold text-white"
        >
          Tillbaka till kassan
        </Link>
        <Link
          href="/cart"
          className="inline-flex rounded-full border border-amber-700 px-5 py-3 text-sm font-semibold text-amber-800"
        >
          Visa varukorg
        </Link>
      </div>
    </div>
  );
}
