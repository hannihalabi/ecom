export type Promotion = {
  code: string;
  percentOff: number;
  endsAt: Date;
};

const MAND20_PROMO: Promotion = {
  code: "MAND20",
  percentOff: 20,
  endsAt: new Date(2026, 2, 31, 23, 59, 59, 999),
};

const PROMOTIONS = [MAND20_PROMO];

export const normalizePromotionCode = (code?: string) =>
  code ? code.trim().toUpperCase() : "";

const isPromotionActive = (promotion: Promotion, now: Date) =>
  now.getTime() <= promotion.endsAt.getTime();

export const formatPromotionEndDate = (promotion: Promotion) =>
  new Intl.DateTimeFormat("sv-SE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(promotion.endsAt);

export const getPromotionByCode = (code?: string, now = new Date()) => {
  const normalized = normalizePromotionCode(code);
  if (!normalized) return { promotion: null, normalized };

  const promotion = PROMOTIONS.find((promo) => promo.code === normalized) ?? null;
  if (!promotion) return { promotion: null, normalized };
  if (!isPromotionActive(promotion, now)) return { promotion: null, normalized };

  return { promotion, normalized };
};

export const validatePromotionCode = (code?: string, now = new Date()) => {
  const normalized = normalizePromotionCode(code);
  if (!normalized) {
    return { promotion: null, normalized, error: "Ange en rabattkod." };
  }

  const promotion = PROMOTIONS.find((promo) => promo.code === normalized) ?? null;
  if (!promotion) {
    return { promotion: null, normalized, error: "Rabattkoden känns inte igen." };
  }

  if (!isPromotionActive(promotion, now)) {
    return {
      promotion: null,
      normalized,
      error: "Rabattkoden har gått ut.",
    };
  }

  return { promotion, normalized, error: null };
};

export const applyPromotionDiscount = (amount: number, promotion: Promotion | null) => {
  if (!promotion) return { discountedAmount: amount, discount: 0 };
  const discount = Math.round((amount * promotion.percentOff) / 100);
  return {
    discountedAmount: Math.max(amount - discount, 0),
    discount,
  };
};

export const applyPromotionDiscountToLines = (
  lineTotals: number[],
  promotion: Promotion | null,
) => {
  const baseTotal = lineTotals.reduce((sum, line) => sum + line, 0);
  if (!promotion) return { discountedTotal: baseTotal, discount: 0 };

  let discount = 0;
  let discountedTotal = 0;

  lineTotals.forEach((lineTotal) => {
    const lineDiscount = Math.round((lineTotal * promotion.percentOff) / 100);
    discount += lineDiscount;
    discountedTotal += Math.max(lineTotal - lineDiscount, 0);
  });

  return { discountedTotal, discount };
};

export const applyPromotionDiscountCents = (
  amountInCents: number,
  promotion: Promotion | null,
) => {
  if (!promotion) return { discountedAmount: amountInCents, discount: 0 };
  const discount = Math.round((amountInCents * promotion.percentOff) / 100);
  return {
    discountedAmount: Math.max(amountInCents - discount, 0),
    discount,
  };
};
