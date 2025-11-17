"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { isOutOfStock } from "@/lib/utils/product-utils";
import type { Product } from "@/types/product";
import { useState } from "react";

type AddToCartButtonProps = {
  product: Product;
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  onSuccess?: () => void;
};

export function AddToCartButton({
  product,
  variant = "default",
  size = "default",
  className,
  onSuccess,
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  const outOfStock = isOutOfStock(product);

  const handleAddToCart = async () => {
    if (outOfStock) return;
    
    setError(null);
    setIsAdding(true);
    
    // Small delay to show loading state
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    const result = addItem(product);
    
    setIsAdding(false);
    
    if (result.success) {
      if (onSuccess) {
        onSuccess();
      }
    } else {
      setError(result.error || "Failed to add item to cart");
      // Clear error after 3 seconds
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleAddToCart}
        disabled={outOfStock || isAdding}
      >
        {isAdding ? "Adding..." : outOfStock ? "Out of Stock" : "Add to Cart"}
      </Button>
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

