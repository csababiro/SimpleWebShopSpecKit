import { Badge } from "@/components/ui/badge";
import { getProductAvailability, getAvailabilityLabel, isLowStock } from "@/lib/utils/product-utils";
import type { Product } from "@/types/product";
import { AlertTriangle } from "lucide-react";

type StockIndicatorProps = {
  product: Product;
  showCount?: boolean;
};

export function StockIndicator({ product, showCount = true }: StockIndicatorProps) {
  const availability = getProductAvailability(product);
  const label = getAvailabilityLabel(product);
  const lowStock = isLowStock(product);

  const variantMap = {
    in_stock: "default",
    low_stock: "secondary",
    out_of_stock: "outline",
  } as const;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant={variantMap[availability]} className="flex items-center gap-1">
        {lowStock && <AlertTriangle className="h-3 w-3" aria-hidden="true" />}
        {label}
      </Badge>
      {showCount && (
        <span className="text-sm text-neutral-600" aria-label={`Stock count: ${product.stock}`}>
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </span>
      )}
    </div>
  );
}

