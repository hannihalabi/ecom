import { normalizeShipping } from "@/lib/shipping";
import type { Product } from "@/types";

export const SPECIAL_ORDER_PRODUCT_ID = "special-order";
export const SPECIAL_ORDER_VARIANT = "special-order";

export const SPECIAL_ORDER_PRODUCT: Product = {
  id: SPECIAL_ORDER_PRODUCT_ID,
  slug: "special-order",
  title: "Special order",
  description: {
    short: "Specialdesignad väska utifrån kundens önskemål.",
    long: "Vi tar fram en specialdesignad väska utifrån modellnamn, referenser och önskad känsla. Du kan uppdatera din brief i varukorgen innan checkout.",
  },
  images: ["/special-order-card.svg"],
  category: "Specialdesign",
  tags: ["special order", "custom", "design", "bag"],
  priceOriginal: 4699,
  priceDiscounted: 3999,
  discountPercent: 15,
  rating: 5,
  reviewCount: 0,
  stock: 999,
  shipping: normalizeShipping({
    price: 0,
    freeOver: 0,
    etaDaysMin: 14,
    etaDaysMax: 14,
  }),
  badges: ["Specialdesign"],
  isFlashDeal: false,
};

export const isSpecialOrderProductId = (productId: string) =>
  productId === SPECIAL_ORDER_PRODUCT_ID;
