import { NextResponse } from "next/server";
import { products } from "@/data/products";
import { applyPromotionDiscountCents, validatePromotionCode } from "@/lib/promotions";
import { SHIPPING_COST_PER_PRODUCT } from "@/lib/shipping";
import type { CartItem } from "@/types";

const STRIPE_CHECKOUT_URL = "https://api.stripe.com/v1/checkout/sessions";
const MAX_LINES = 50;
const PRODUCT_MAP = new Map(products.map((product) => [product.id, product]));

type CheckoutCustomer = {
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
  city?: string;
  postalCode?: string;
};

type CheckoutRequestBody = {
  items?: CartItem[];
  customer?: CheckoutCustomer;
  promotionCode?: string;
};

const safeText = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const getBaseUrl = (request: Request) => {
  const fromEnv = safeText(process.env.NEXT_PUBLIC_APP_URL);
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }
  return new URL(request.url).origin;
};

export async function POST(request: Request) {
  const secretKey = safeText(process.env.STRIPE_SECRET_KEY);
  if (!secretKey) {
    return NextResponse.json(
      { error: "Stripe saknar servernyckel. Sätt STRIPE_SECRET_KEY i miljön." },
      { status: 500 },
    );
  }

  let body: CheckoutRequestBody;
  try {
    body = (await request.json()) as CheckoutRequestBody;
  } catch {
    return NextResponse.json({ error: "Ogiltig request-body." }, { status: 400 });
  }

  const items = Array.isArray(body.items) ? body.items.slice(0, MAX_LINES) : [];
  if (items.length === 0) {
    return NextResponse.json({ error: "Varukorgen är tom." }, { status: 400 });
  }

  const lineItems = items
    .map((item) => {
      const product = PRODUCT_MAP.get(item.productId);
      if (!product) return null;

      const quantity = Number.isFinite(item.quantity) ? Math.floor(item.quantity) : 0;
      if (quantity <= 0) return null;

      return {
        product,
        quantity,
        selectedVariant: safeText(item.selectedVariant),
      };
    })
    .filter((line): line is NonNullable<typeof line> => Boolean(line));

  if (lineItems.length === 0) {
    return NextResponse.json({ error: "Inga giltiga produkter i varukorgen." }, { status: 400 });
  }
  const totalItems = lineItems.reduce((sum, line) => sum + line.quantity, 0);

  const customer = body.customer ?? {};
  const customerName = [safeText(customer.firstName), safeText(customer.lastName)]
    .filter(Boolean)
    .join(" ");
  const rawPromotionCode = safeText(body.promotionCode);
  const promotionValidation = rawPromotionCode
    ? validatePromotionCode(rawPromotionCode)
    : {
        promotion: null,
        normalized: "",
        error: null as string | null,
      };

  if (rawPromotionCode && (promotionValidation.error || !promotionValidation.promotion)) {
    return NextResponse.json(
      {
        error:
          promotionValidation.error ??
          "Rabattkoden kunde inte användas just nu.",
      },
      { status: 400 },
    );
  }

  const promotion = promotionValidation.promotion;

  const baseUrl = getBaseUrl(request);
  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("locale", "sv");
  if (!promotion) {
    params.set("allow_promotion_codes", "true");
  }
  params.set("billing_address_collection", "required");
  params.set("phone_number_collection[enabled]", "true");
  params.set("success_url", `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`);
  params.set("cancel_url", `${baseUrl}/checkout/cancel`);

  const customerEmail = safeText(customer.email);
  if (customerEmail) {
    params.set("customer_email", customerEmail);
  }

  if (customerName) params.set("metadata[customer_name]", customerName);
  if (safeText(customer.address)) params.set("metadata[address]", safeText(customer.address));
  if (safeText(customer.city)) params.set("metadata[city]", safeText(customer.city));
  if (safeText(customer.postalCode)) {
    params.set("metadata[postal_code]", safeText(customer.postalCode));
  }
  if (promotion) {
    params.set("metadata[promotion_code]", promotion.code);
    params.set("metadata[promotion_percent_off]", String(promotion.percentOff));
  }

  lineItems.forEach(({ product, quantity, selectedVariant }, index) => {
    const baseUnitAmount = Math.round(product.priceDiscounted * 100);
    const { discountedAmount: discountedUnitAmount } = applyPromotionDiscountCents(
      baseUnitAmount,
      promotion,
    );

    params.set(`line_items[${index}][quantity]`, String(quantity));
    params.set(`line_items[${index}][price_data][currency]`, "sek");
    params.set(
      `line_items[${index}][price_data][unit_amount]`,
      String(discountedUnitAmount),
    );
    params.set(
      `line_items[${index}][price_data][product_data][name]`,
      product.title,
    );
    params.set(
      `line_items[${index}][price_data][product_data][metadata][product_id]`,
      product.id,
    );
    params.set(
      `line_items[${index}][price_data][product_data][metadata][product_slug]`,
      product.slug,
    );

    if (selectedVariant) {
      params.set(
        `line_items[${index}][price_data][product_data][description]`,
        selectedVariant,
      );
    }
  });

  params.set(`line_items[${lineItems.length}][quantity]`, String(totalItems));
  params.set(`line_items[${lineItems.length}][price_data][currency]`, "sek");
  params.set(
    `line_items[${lineItems.length}][price_data][unit_amount]`,
    String(Math.round(SHIPPING_COST_PER_PRODUCT * 100)),
  );
  params.set(
    `line_items[${lineItems.length}][price_data][product_data][name]`,
    "Frakt per produkt",
  );
  params.set(
    `line_items[${lineItems.length}][price_data][product_data][description]`,
    `${SHIPPING_COST_PER_PRODUCT} kr x antal produkter`,
  );

  try {
    const stripeResponse = await fetch(STRIPE_CHECKOUT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const stripeData = (await stripeResponse.json()) as {
      url?: string;
      error?: { message?: string };
    };

    if (!stripeResponse.ok || !stripeData.url) {
      return NextResponse.json(
        {
          error:
            stripeData.error?.message ??
            "Kunde inte skapa Stripe-checkout just nu. Försök igen.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: stripeData.url });
  } catch {
    return NextResponse.json(
      { error: "Nätverksfel mot Stripe. Försök igen om en stund." },
      { status: 502 },
    );
  }
}
