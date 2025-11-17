"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/lib/cart-store";
import { isOutOfStock, isLowStock } from "@/lib/utils/product-utils";
import type { CartItem as CartItemType } from "@/lib/cart-store";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

type CartItemProps = {
  item: CartItemType;
};

export function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const outOfStock = isOutOfStock(item.product);
  const lowStock = isLowStock(item.product);
  const availableStock = item.product.stock;
  const exceedsStock = item.quantity > availableStock;

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 0) return;
    
    setError(null);
    setIsUpdating(true);
    
    // Small delay to show loading state
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    const result = updateQuantity(item.product.id, newQuantity);
    
    setIsUpdating(false);
    
    if (!result.success) {
      setError(result.error || "Failed to update quantity");
      // Clear error after 3 seconds
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleIncrement = () => {
    handleQuantityChange(item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      handleQuantityChange(item.quantity - 1);
    } else {
      removeItem(item.product.id);
    }
  };

  return (
    <li className="flex flex-col gap-3 rounded-lg border border-neutral-200 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start gap-2">
            <p className="font-semibold">{item.product.name}</p>
            {outOfStock && (
              <Badge variant="outline" className="text-xs">
                Out of Stock
              </Badge>
            )}
            {lowStock && !outOfStock && (
              <Badge variant="secondary" className="text-xs">
                Low Stock
              </Badge>
            )}
            {exceedsStock && (
              <Badge variant="outline" className="text-xs text-red-600 border-red-300">
                Exceeds Stock
              </Badge>
            )}
          </div>
          <p className="text-sm text-neutral-500 mt-1">
            ${item.product.price.toFixed(2)} each
          </p>
          {availableStock > 0 && (
            <p className="text-xs text-neutral-400 mt-1">
              {availableStock} available in stock
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeItem(item.product.id)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          aria-label={`Remove ${item.product.name} from cart`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDecrement}
            disabled={isUpdating}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center font-medium" aria-label={`Quantity: ${item.quantity}`}>
            {item.quantity}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleIncrement}
            disabled={isUpdating || outOfStock || item.quantity >= availableStock}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <p className="font-semibold">
          ${(item.quantity * item.product.price).toFixed(2)}
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </li>
  );
}

