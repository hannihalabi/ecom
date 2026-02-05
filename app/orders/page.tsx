import Link from "next/link";

const orders = [
  {
    id: "ORD-1042",
    date: "22 jan 2026",
    status: "Levererad",
    total: "64,97 kr",
  },
  {
    id: "ORD-1038",
    date: "15 jan 2026",
    status: "På väg",
    total: "28,99 kr",
  },
  {
    id: "ORD-1031",
    date: "04 jan 2026",
    status: "Levererad",
    total: "112,48 kr",
  },
];

export const metadata = {
  title: "Beställningar",
};

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Dina beställningar</h1>
        <Link href="/" className="text-sm font-semibold text-rose-600">
          Fortsätt handla
        </Link>
      </div>
      <div className="grid gap-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {order.id}
                </p>
                <p className="text-xs text-slate-500">Beställd {order.date}</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {order.status}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
              <span>Totalt</span>
              <span className="font-semibold text-slate-900">{order.total}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
