import Link from "next/link";

export const metadata = {
  title: "Konto",
};

export default function AccountPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-slate-900">Konto</h1>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Profil</p>
          <p className="mt-2 text-sm text-slate-600">Hej, Jamie Shopper</p>
          <p className="text-xs text-slate-500">jamie@example.com</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Medlemsförmåner</p>
          <ul className="mt-2 space-y-2 text-sm text-slate-600">
            <li>Exklusiva veckosläpp</li>
            <li>Prioriterad support</li>
            <li>Prisbevakning i realtid</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Leverans</p>
          <p className="mt-2 text-sm text-slate-600">
            Storgatan 21, Stockholm
          </p>
          <Link href="/checkout" className="mt-3 inline-flex text-xs font-semibold text-rose-600">
            Redigera adress
          </Link>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Betalning</p>
          <p className="mt-2 text-sm text-slate-600">Visa **** 4242</p>
          <Link href="/checkout" className="mt-3 inline-flex text-xs font-semibold text-rose-600">
            Uppdatera betalning
          </Link>
        </div>
      </div>
    </div>
  );
}
