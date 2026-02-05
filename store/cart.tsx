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
import type { CartItem, Product } from "@/types";

const STORAGE_KEY = "dealflow_cart";

type CartState = {
  items: CartItem[];
};

type CartDetailedItem = {
  item: CartItem;
  product: Product;
  lineTotal: number;
  lineOriginal: number;
};

type CartContextValue = {
  items: CartItem[];
  detailedItems: CartDetailedItem[];
  addItem: (productId: string, quantity?: number, selectedVariant?: string) => void;
  removeItem: (productId: string, selectedVariant?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedVariant?: string) => void;
  clear: () => void;
  totalItems: number;
  subtotal: number;
  originalTotal: number;
  savings: number;
};

type CartAction =
  | { type: "hydrate"; items: CartItem[] }
  | { type: "add"; productId: string; quantity: number; selectedVariant?: string }
  | { type: "remove"; productId: string; selectedVariant?: string }
  | { type: "update"; productId: string; quantity: number; selectedVariant?: string }
  | { type: "clear" };

const CartContext = createContext<CartContextValue | null>(null);

const isSameLine = (a: CartItem, b: CartItem) =>
  a.productId === b.productId && a.selectedVariant === b.selectedVariant;

const reducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "hydrate":
      return { items: action.items };
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
          items: state.items.map((item) =>
            isSameLine(item, existing)
              ? { ...item, quantity: item.quantity + action.quantity }
              : item,
          ),
        };
      }

      return {
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
    case "remove":
      return {
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
        items: state.items
          .map((item) =>
            item.productId === action.productId &&
            item.selectedVariant === action.selectedVariant
              ? { ...item, quantity: action.quantity }
              : item,
          )
          .filter((item) => item.quantity > 0),
      };
    case "clear":
      return { items: [] };
    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as CartItem[];
        dispatch({ type: "hydrate", items: parsed });
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const productMap = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
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

  const subtotal = useMemo(
    () => detailedItems.reduce((sum, item) => sum + item.lineTotal, 0),
    [detailedItems],
  );

  const originalTotal = useMemo(
    () => detailedItems.reduce((sum, item) => sum + item.lineOriginal, 0),
    [detailedItems],
  );

  const savings = useMemo(
    () => Math.max(originalTotal - subtotal, 0),
    [originalTotal, subtotal],
  );

  const totalItems = useMemo(
    () => state.items.reduce((sum, item) => sum + item.quantity, 0),
    [state.items],
  );

  const addItem = (productId: string, quantity = 1, selectedVariant?: string) => {
    dispatch({ type: "add", productId, quantity, selectedVariant });
    track("add_to_cart", { productId, quantity, selectedVariant });
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

  const clear = () => dispatch({ type: "clear" });

  const value: CartContextValue = {
    items: state.items,
    detailedItems,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    totalItems,
    subtotal,
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
