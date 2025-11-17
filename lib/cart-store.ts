import { create } from "zustand";

import type { Product } from "@/types/product";

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  getCartCount: () => number;
  getCartTotal: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (product) =>
    set((state) => {
      const existing = state.items.find(
        (item) => item.product.id === product.id
      );
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }

      return {
        items: [...state.items, { product, quantity: 1 }]
      };
    }),
  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId)
    })),
  getCartCount: () =>
    get().items.reduce((total, item) => total + item.quantity, 0),
  getCartTotal: () =>
    get().items.reduce(
      (total, item) => total + item.quantity * item.product.price,
      0
    )
}));

