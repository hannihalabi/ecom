"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";
import { useCart } from "@/store/cart";

type CheckoutSuccessClientProps = {
  sessionId?: string;
};

export const CheckoutSuccessClient = ({
  sessionId,
}: CheckoutSuccessClientProps) => {
  const { clear, subtotal, totalItems } = useCart();
  const didRun = useRef(false);
  const purchaseSnapshot = useRef({ subtotal, totalItems });

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    track("purchase", {
      total: purchaseSnapshot.current.subtotal,
      itemCount: purchaseSnapshot.current.totalItems,
      sessionId,
    });

    clear();
  }, [clear, sessionId]);

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
      <h1 className="text-2xl font-semibold text-emerald-800">Tack för din beställning!</h1>
      <p className="mt-2 text-sm text-emerald-700">
        Betalningen är registrerad hos Stripe. Vi skickar bekräftelse och
        leveransuppdateringar till din e-post.
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white"
        >
          Fortsätt handla
        </Link>
        <Link
          href="/orders"
          className="inline-flex rounded-full border border-emerald-700 px-5 py-3 text-sm font-semibold text-emerald-800"
        >
          Visa ordrar
        </Link>
      </div>
    </div>
  );
};
