import { Badge } from "@/components/ui/badge";
import { getProductAvailability, getAvailabilityLabel } from "@/lib/utils/product-utils";
import type { Product } from "@/types/product";

type StockIndicatorProps = {
  product: Product;
  showCount?: boolean;
};

export function StockIndicator({ product, showCount = true }: StockIndicatorProps) {
  const availability = getProductAvailability(product);
  const label = getAvailabilityLabel(product);

  const variantMap = {
    in_stock: "default",
    low_stock: "secondary",
    out_of_stock: "outline",
  } as const;

  return (
    <div className="flex items-center gap-2">
      <Badge variant={variantMap[availability]}>
        {label}
      </Badge>
      {showCount && (
        <span className="text-sm text-neutral-600">
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </span>
      )}
    </div>
  );
}

