"use client";

import { useState } from "react";

type MonthlyData = { month: string; revenue: number };
type RecentOrder = {
  id: string;
  created: number;
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
};

type StatsData = {
  totalRevenueSEK: number;
  totalOrders: number;
  averageOrderSEK: number;
  monthlyData: MonthlyData[];
  recentOrders: RecentOrder[];
};

function formatSEK(amount: number) {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleDateString("sv-SE");
}

function formatMonth(key: string) {
  const [year, month] = key.split("-");
  const d = new Date(Number(year), Number(month) - 1, 1);
  return d.toLocaleDateString("sv-SE", { month: "short", year: "numeric" });
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<StatsData | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const json = (await res.json()) as { error?: string };
        setError(json.error ?? "Något gick fel.");
        return;
      }

      const json = (await res.json()) as StatsData;
      setData(json);
    } catch {
      setError("Nätverksfel. Försök igen.");
    } finally {
      setLoading(false);
    }
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="mb-1 text-xl font-semibold text-slate-900">Admin</h1>
          <p className="mb-6 text-sm text-slate-500">Logga in för att se försäljningsstatistik.</p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700" htmlFor="pw">
                Lösenord
              </label>
              <input
                id="pw"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                placeholder="••••••••"
                autoFocus
              />
            </div>

            {error && <p className="text-xs font-medium text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading || !password}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
            >
              {loading ? "Hämtar data…" : "Logga in"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const maxMonthRevenue = Math.max(...data.monthlyData.map((m) => m.revenue), 1);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900">Försäljningsstatistik</h1>
          <button
            onClick={() => setData(null)}
            className="text-sm font-medium text-slate-500 hover:text-slate-800"
          >
            Logga ut
          </button>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Total omsättning"
            value={formatSEK(data.totalRevenueSEK)}
          />
          <StatCard label="Antal beställningar" value={String(data.totalOrders)} />
          <StatCard
            label="Snittordervärde"
            value={formatSEK(data.averageOrderSEK)}
          />
        </div>

        {/* Monthly chart */}
        {data.monthlyData.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-slate-700">Omsättning per månad</h2>
            <div className="flex items-end gap-2 overflow-x-auto pb-2">
              {data.monthlyData.map((m) => {
                const heightPct = (m.revenue / maxMonthRevenue) * 100;
                return (
                  <div key={m.month} className="flex min-w-[48px] flex-1 flex-col items-center gap-1">
                    <span className="text-[10px] font-medium text-slate-500">
                      {formatSEK(m.revenue)}
                    </span>
                    <div
                      className="w-full rounded-t-md bg-slate-800"
                      style={{ height: `${Math.max(heightPct, 4)}px`, maxHeight: "120px", minHeight: "4px" }}
                    />
                    <span className="text-[10px] text-slate-400">{formatMonth(m.month)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent orders */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="text-sm font-semibold text-slate-700">Senaste beställningar</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {data.recentOrders.length === 0 && (
              <p className="px-6 py-4 text-sm text-slate-400">Inga beställningar än.</p>
            )}
            {data.recentOrders.map((order) => (
              <div key={order.id} className="flex flex-wrap items-center justify-between gap-2 px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-slate-800">{order.customerName}</p>
                  <p className="text-xs text-slate-400">{order.customerEmail}</p>
                  <p className="text-xs text-slate-400">{formatDate(order.created)}</p>
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  {formatSEK(order.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
