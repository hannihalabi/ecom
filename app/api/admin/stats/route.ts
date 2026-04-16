import { NextRequest, NextResponse } from "next/server";

const STRIPE_API = "https://api.stripe.com/v1";

type StripeSession = {
  id: string;
  created: number;
  amount_total: number | null;
  currency: string;
  payment_status: string;
  customer_details?: { email?: string; name?: string } | null;
  metadata?: Record<string, string>;
};

type StripeSessionList = {
  data: StripeSession[];
  has_more: boolean;
  url: string;
};

async function fetchAllSessions(secretKey: string): Promise<StripeSession[]> {
  const sessions: StripeSession[] = [];
  let startingAfter: string | null = null;
  let hasMore = true;

  while (hasMore) {
    const params = new URLSearchParams();
    params.set("limit", "100");
    if (startingAfter) params.set("starting_after", startingAfter);

    const res = await fetch(`${STRIPE_API}/checkout/sessions?${params.toString()}`, {
      headers: { Authorization: `Bearer ${secretKey}` },
    });

    if (!res.ok) {
      throw new Error("Stripe API error");
    }

    const data = (await res.json()) as StripeSessionList;
    sessions.push(...data.data);
    hasMore = data.has_more;
    if (hasMore && data.data.length > 0) {
      startingAfter = data.data[data.data.length - 1].id;
    }
  }

  return sessions;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { password?: string };
  if (body.password !== "Hemsida123") {
    return NextResponse.json({ error: "Fel lösenord." }, { status: 401 });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY ?? "";
  if (!secretKey) {
    return NextResponse.json({ error: "STRIPE_SECRET_KEY saknas." }, { status: 500 });
  }

  try {
    const sessions = await fetchAllSessions(secretKey);
    const paid = sessions.filter((s) => s.payment_status === "paid");

    const totalRevenueSEK = paid.reduce((sum, s) => {
      if (!s.amount_total) return sum;
      return sum + s.amount_total / 100;
    }, 0);

    const totalOrders = paid.length;

    // Per-month breakdown
    const byMonth: Record<string, number> = {};
    for (const s of paid) {
      if (!s.amount_total) continue;
      const d = new Date(s.created * 1000);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      byMonth[key] = (byMonth[key] ?? 0) + s.amount_total / 100;
    }

    const monthlyData = Object.entries(byMonth)
      .map(([month, revenue]) => ({ month, revenue }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Recent orders
    const recentOrders = paid.slice(0, 20).map((s) => ({
      id: s.id,
      created: s.created,
      amount: s.amount_total ? s.amount_total / 100 : 0,
      currency: s.currency,
      customerName: s.metadata?.customer_name ?? s.customer_details?.name ?? "—",
      customerEmail: s.customer_details?.email ?? "—",
    }));

    return NextResponse.json({
      totalRevenueSEK,
      totalOrders,
      averageOrderSEK: totalOrders > 0 ? totalRevenueSEK / totalOrders : 0,
      monthlyData,
      recentOrders,
    });
  } catch {
    return NextResponse.json({ error: "Kunde inte hämta data från Stripe." }, { status: 500 });
  }
}
