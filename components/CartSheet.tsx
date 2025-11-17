'use client';

import { ShoppingCart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { useCartStore } from "@/lib/cart-store";
import { CartItem } from "./CartItem";
import { EmptyState } from "./EmptyState";
import { isOutOfStock } from "@/lib/utils/product-utils";

export function CartSheet() {
  const items = useCartStore((state) => state.items);
  const cartCount = useCartStore((state) => state.getCartCount());
  const cartTotal = useCartStore((state) => state.getCartTotal());

  const hasOutOfStockItems = items.some((item) => isOutOfStock(item.product));

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="relative inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-neutral-50"
        >
          <ShoppingCart className="h-5 w-5" aria-hidden />
          <span className="hidden sm:inline">Cart</span>
          <Badge className="absolute -right-2 -top-1" aria-label="Items in cart">
            {cartCount}
          </Badge>
          <span className="sr-only">Open cart</span>
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
          <p className="text-sm text-neutral-500">
            {cartCount === 0
              ? "You have no items yet."
              : `You have ${cartCount} item${cartCount > 1 ? "s" : ""} in your cart.`}
          </p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <EmptyState
              title="Your cart is empty"
              description="Browse products and add them to your cart to get started."
            />
          ) : (
            <>
              {hasOutOfStockItems && (
                <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Some items in your cart are out of stock. Please remove them before checkout.
                  </p>
                </div>
              )}
              <ul className="space-y-4">
                {items.map((item) => (
                  <CartItem key={item.product.id} item={item} />
                ))}
              </ul>
            </>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="border-t pt-4">
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between text-base font-semibold">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <Button className="w-full" disabled={hasOutOfStockItems}>
                Checkout
              </Button>
              {hasOutOfStockItems && (
                <p className="text-xs text-center text-neutral-500">
                  Please remove out of stock items to proceed
                </p>
              )}
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

