import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Product } from "@/types/product";

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (product: Product) => { success: boolean; error?: string };
  updateQuantity: (productId: string, quantity: number) => { success: boolean; error?: string };
  removeItem: (productId: string) => void;
  getCartCount: () => number;
  getCartTotal: () => number;
  clearCart: () => void;
};

// Helper function to validate stock
function validateStock(product: Product, requestedQuantity: number, currentCartQuantity: number = 0): { valid: boolean; error?: string } {
  if (product.stock <= 0) {
    return { valid: false, error: "Product is out of stock" };
  }
  
  const totalRequested = currentCartQuantity + requestedQuantity;
  if (totalRequested > product.stock) {
    return { valid: false, error: `Only ${product.stock} items available in stock` };
  }
  
  return { valid: true };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const state = get();
        const existing = state.items.find(
          (item) => item.product.id === product.id
        );
        
        const currentQuantity = existing ? existing.quantity : 0;
        const validation = validateStock(product, 1, currentQuantity);
        
        if (!validation.valid) {
          return { success: false, error: validation.error };
        }
        
        if (existing) {
          set((state) => ({
            items: state.items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          }));
        } else {
          set((state) => ({
            items: [...state.items, { product, quantity: 1 }]
          }));
        }
        
        return { success: true };
      },
      updateQuantity: (productId, quantity) => {
        if (quantity < 0) {
          return { success: false, error: "Quantity cannot be negative" };
        }
        
        if (quantity === 0) {
          get().removeItem(productId);
          return { success: true };
        }
        
        const state = get();
        const existing = state.items.find(
          (item) => item.product.id === productId
        );
        
        if (!existing) {
          return { success: false, error: "Item not found in cart" };
        }
        
        const validation = validateStock(existing.product, quantity, 0);
        
        if (!validation.valid) {
          return { success: false, error: validation.error };
        }
        
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          )
        }));
        
        return { success: true };
      },
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
        ),
      clearCart: () => set({ items: [] })
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ items: state.items })
    }
  )
);

