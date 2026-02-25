import type { CartItem } from "@/types";

type CheckoutCustomer = {
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
  city?: string;
  postalCode?: string;
};

type CheckoutPayload = {
  items: CartItem[];
  customer?: CheckoutCustomer;
  promotionCode?: string;
};

type CheckoutResponse = {
  url?: string;
  error?: string;
};

export const createStripeCheckoutSession = async (payload: CheckoutPayload) => {
  const response = await fetch("/api/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as CheckoutResponse;

  if (!response.ok || !data.url) {
    throw new Error(
      data.error ?? "Kunde inte starta Stripe-betalningen. Försök igen.",
    );
  }

  return data.url;
};
