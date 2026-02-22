import type { Shipping } from "@/types";

export const SHIPPING_COST_PER_PRODUCT = 129;
export const DELIVERY_ETA_MIN_DAYS = 14;
export const DELIVERY_ETA_MAX_DAYS = 14;

export const getShippingTotal = (totalItems: number) =>
  Math.max(totalItems, 0) * SHIPPING_COST_PER_PRODUCT;

export const normalizeShipping = (shipping: Shipping): Shipping => ({
  ...shipping,
  price: SHIPPING_COST_PER_PRODUCT,
  freeOver: 0,
  etaDaysMin: DELIVERY_ETA_MIN_DAYS,
  etaDaysMax: DELIVERY_ETA_MAX_DAYS,
});

export const formatDeliveryEta = (
  shipping: Pick<Shipping, "etaDaysMin" | "etaDaysMax">,
) => {
  if (shipping.etaDaysMax > shipping.etaDaysMin) {
    return `${shipping.etaDaysMin}-${shipping.etaDaysMax} dagar`;
  }

  return `${shipping.etaDaysMin}+ dagar`;
};
