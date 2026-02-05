export type Shipping = {
  price: number;
  freeOver?: number;
  etaDaysMin: number;
  etaDaysMax: number;
};

export type ProductVariant = {
  name: string;
  options: string[];
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  description: {
    short: string;
    long: string;
  };
  images: string[];
  category: string;
  tags: string[];
  priceOriginal: number;
  priceDiscounted: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  shipping: Shipping;
  variants?: ProductVariant[];
  badges?: string[];
  isFlashDeal?: boolean;
  flashDealEndsAt?: string;
};

export type CartItem = {
  productId: string;
  quantity: number;
  selectedVariant?: string;
};
