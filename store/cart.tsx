"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { products } from "@/data/products";
import { track } from "@/lib/analytics";
import {
  applyPromotionDiscountToLines,
  getPromotionByCode,
  normalizePromotionCode,
  validatePromotionCode,
} from "@/lib/promotions";
import { getShippingTotal } from "@/lib/shipping";
import {
  isSpecialOrderProductId,
  SPECIAL_ORDER_PRODUCT,
  SPECIAL_ORDER_VARIANT,
} from "@/lib/specialOrder";
import type { CartItem, Product } from "@/types";

const STORAGE_KEY = "dealflow_cart";

type CartState = {
  items: CartItem[];
  promotionCode: string;
};

type CartDetailedItem = {
  item: CartItem;
  product: Product;
  lineTotal: number;
  lineOriginal: number;
};

type PersistedCartState = {
  items: CartItem[];
  promotionCode?: string;
};

type ApplyPromotionResult = {
  normalized: string;
  error: string | null;
};

type CartContextValue = {
  items: CartItem[];
  detailedItems: CartDetailedItem[];
  addItem: (productId: string, quantity?: number, selectedVariant?: string) => void;
  addSpecialOrder: (request: string) => void;
  removeItem: (productId: string, selectedVariant?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedVariant?: string) => void;
  updateSpecialOrderRequest: (request: string) => void;
  clear: () => void;
  applyPromotionCode: (code: string) => ApplyPromotionResult;
  clearPromotionCode: () => void;
  promotionCode: string | null;
  promotionPercentOff: number;
  promotionDiscount: number;
  totalItems: number;
  subtotal: number;
  shippingTotal: number;
  total: number;
  originalTotal: number;
  savings: number;
};

type CartAction =
  | { type: "hydrate"; items: CartItem[]; promotionCode?: string }
  | { type: "add"; productId: string; quantity: number; selectedVariant?: string }
  | { type: "addSpecialOrder"; request: string }
  | { type: "remove"; productId: string; selectedVariant?: string }
  | { type: "update"; productId: string; quantity: number; selectedVariant?: string }
  | { type: "updateSpecialOrderRequest"; request: string }
  | { type: "setPromotionCode"; code: string }
  | { type: "clearPromotionCode" }
  | { type: "clear" };

const CartContext = createContext<CartContextValue | null>(null);

const isSameLine = (a: CartItem, b: CartItem) =>
  a.productId === b.productId && a.selectedVariant === b.selectedVariant;

const sanitizeSpecialRequest = (value?: string) => value?.trim() || undefined;

const isObjectRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isCartItem = (value: unknown): value is CartItem => {
  if (!isObjectRecord(value)) return false;
  if (typeof value.productId !== "string") return false;
  if (typeof value.quantity !== "number" || !Number.isFinite(value.quantity)) {
    return false;
  }
  if (value.selectedVariant !== undefined && typeof value.selectedVariant !== "string") {
    return false;
  }
  if (value.specialRequest !== undefined && typeof value.specialRequest !== "string") {
    return false;
  }
  return true;
};

const sanitizeItems = (items: CartItem[]) =>
  items
    .map((item) => ({
      productId: item.productId.trim(),
      quantity: Math.floor(item.quantity),
      selectedVariant: isSpecialOrderProductId(item.productId)
        ? SPECIAL_ORDER_VARIANT
        : item.selectedVariant?.trim() || undefined,
      specialRequest: sanitizeSpecialRequest(item.specialRequest),
    }))
    .filter((item) => item.productId.length > 0 && item.quantity > 0);

const parsePersistedCartState = (raw: string): CartState | null => {
  const parsed = JSON.parse(raw) as unknown;

  if (Array.isArray(parsed) && parsed.every(isCartItem)) {
    return {
      items: sanitizeItems(parsed),
      promotionCode: "",
    };
  }

  if (!isObjectRecord(parsed) || !Array.isArray(parsed.items)) {
    return null;
  }

  const items = parsed.items;
  if (!items.every(isCartItem)) {
    return null;
  }

  if (
    parsed.promotionCode !== undefined &&
    typeof parsed.promotionCode !== "string"
  ) {
    return null;
  }

  const normalizedPromotionCode = normalizePromotionCode(parsed.promotionCode);
  const activePromotionCode =
    getPromotionByCode(normalizedPromotionCode).promotion?.code ?? "";

  return {
    items: sanitizeItems(items),
    promotionCode: activePromotionCode,
  };
};

const reducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "hydrate":
      return {
        items: action.items,
        promotionCode: normalizePromotionCode(action.promotionCode),
      };
    case "add": {
      const existing = state.items.find((item) =>
        isSameLine(item, {
          productId: action.productId,
          quantity: action.quantity,
          selectedVariant: action.selectedVariant,
        }),
      );

      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            isSameLine(item, existing)
              ? { ...item, quantity: item.quantity + action.quantity }
              : item,
          ),
        };
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            productId: action.productId,
            quantity: action.quantity,
            selectedVariant: action.selectedVariant,
          },
        ],
      };
    }
    case "addSpecialOrder": {
      const specialRequest = sanitizeSpecialRequest(action.request);
      if (!specialRequest) {
        return state;
      }

      const existing = state.items.find((item) =>
        isSpecialOrderProductId(item.productId),
      );

      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            isSpecialOrderProductId(item.productId)
              ? {
                  ...item,
                  quantity: 1,
                  selectedVariant: SPECIAL_ORDER_VARIANT,
                  specialRequest,
                }
              : item,
          ),
        };
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            productId: SPECIAL_ORDER_PRODUCT.id,
            quantity: 1,
            selectedVariant: SPECIAL_ORDER_VARIANT,
            specialRequest,
          },
        ],
      };
    }
    case "remove":
      return {
        ...state,
        items: state.items.filter(
          (item) =>
            !(
              item.productId === action.productId &&
              item.selectedVariant === action.selectedVariant
            ),
        ),
      };
    case "update":
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.productId === action.productId &&
            item.selectedVariant === action.selectedVariant
              ? { ...item, quantity: action.quantity }
              : item,
          )
          .filter((item) => item.quantity > 0),
      };
    case "updateSpecialOrderRequest":
      return {
        ...state,
        items: state.items.map((item) =>
          isSpecialOrderProductId(item.productId)
            ? {
                ...item,
                selectedVariant: SPECIAL_ORDER_VARIANT,
                specialRequest: sanitizeSpecialRequest(action.request),
              }
            : item,
        ),
      };
    case "setPromotionCode":
      return { ...state, promotionCode: normalizePromotionCode(action.code) };
    case "clearPromotionCode":
      return { ...state, promotionCode: "" };
    case "clear":
      return { items: [], promotionCode: "" };
    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, { items: [], promotionCode: "" });

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = parsePersistedCartState(raw);
        if (!parsed) {
          window.localStorage.removeItem(STORAGE_KEY);
          return;
        }
        dispatch({
          type: "hydrate",
          items: parsed.items,
          promotionCode: parsed.promotionCode,
        });
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    const persistedState: PersistedCartState = { items: state.items };
    if (state.promotionCode) {
      persistedState.promotionCode = state.promotionCode;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persistedState));
  }, [state.items, state.promotionCode]);

  const productMap = useMemo(
    () =>
      new Map(
        [...products, SPECIAL_ORDER_PRODUCT].map((product) => [product.id, product]),
      ),
    [],
  );

  const detailedItems = useMemo<CartDetailedItem[]>(() => {
    return state.items
      .map((item) => {
        const product = productMap.get(item.productId);
        if (!product) return null;
        const lineTotal = product.priceDiscounted * item.quantity;
        const lineOriginal = product.priceOriginal * item.quantity;
        return { item, product, lineTotal, lineOriginal };
      })
      .filter((entry): entry is CartDetailedItem => Boolean(entry));
  }, [productMap, state.items]);

  const promotion = useMemo(
    () => getPromotionByCode(state.promotionCode).promotion,
    [state.promotionCode],
  );

  const lineTotals = useMemo(
    () => detailedItems.map((item) => item.lineTotal),
    [detailedItems],
  );

  const subtotalBeforePromotion = useMemo(
    () => lineTotals.reduce((sum, lineTotal) => sum + lineTotal, 0),
    [lineTotals],
  );

  const promotionTotals = useMemo(
    () => applyPromotionDiscountToLines(lineTotals, promotion),
    [lineTotals, promotion],
  );

  const subtotal = useMemo(
    () => promotionTotals.discountedTotal,
    [promotionTotals.discountedTotal],
  );

  const originalTotal = useMemo(
    () => detailedItems.reduce((sum, item) => sum + item.lineOriginal, 0),
    [detailedItems],
  );

  const savings = useMemo(
    () =>
      Math.max(originalTotal - subtotalBeforePromotion, 0) + promotionTotals.discount,
    [originalTotal, promotionTotals.discount, subtotalBeforePromotion],
  );

  const totalItems = useMemo(
    () => detailedItems.reduce((sum, { item }) => sum + item.quantity, 0),
    [detailedItems],
  );

  const shippingTotal = useMemo(() => getShippingTotal(totalItems), [totalItems]);

  const total = useMemo(() => subtotal + shippingTotal, [subtotal, shippingTotal]);

  const addItem = (productId: string, quantity = 1, selectedVariant?: string) => {
    dispatch({ type: "add", productId, quantity, selectedVariant });
    track("add_to_cart", { productId, quantity, selectedVariant });
  };

  const addSpecialOrder = (request: string) => {
    const specialRequest = sanitizeSpecialRequest(request);
    if (!specialRequest) return;

    dispatch({ type: "addSpecialOrder", request: specialRequest });
    track("add_to_cart", {
      productId: SPECIAL_ORDER_PRODUCT.id,
      quantity: 1,
      selectedVariant: SPECIAL_ORDER_VARIANT,
      specialRequest,
    });
  };

  const removeItem = (productId: string, selectedVariant?: string) => {
    dispatch({ type: "remove", productId, selectedVariant });
  };

  const updateQuantity = (
    productId: string,
    quantity: number,
    selectedVariant?: string,
  ) => {
    dispatch({ type: "update", productId, quantity, selectedVariant });
  };

  const updateSpecialOrderRequest = (request: string) => {
    dispatch({ type: "updateSpecialOrderRequest", request });
  };

  const clear = () => dispatch({ type: "clear" });

  const applyPromotionCode = (code: string): ApplyPromotionResult => {
    const { promotion: validPromotion, normalized, error } = validatePromotionCode(code);
    if (!validPromotion || error) {
      return {
        normalized,
        error: error ?? "Rabattkoden kunde inte användas.",
      };
    }

    dispatch({ type: "setPromotionCode", code: normalized });
    return { normalized, error: null };
  };

  const clearPromotionCode = () => dispatch({ type: "clearPromotionCode" });

  const value: CartContextValue = {
    items: state.items,
    detailedItems,
    addItem,
    addSpecialOrder,
    removeItem,
    updateQuantity,
    updateSpecialOrderRequest,
    clear,
    applyPromotionCode,
    clearPromotionCode,
    promotionCode: promotion?.code ?? null,
    promotionPercentOff: promotion?.percentOff ?? 0,
    promotionDiscount: promotionTotals.discount,
    totalItems,
    subtotal,
    shippingTotal,
    total,
    originalTotal,
    savings,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
