'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useCartStore } from "@/lib/cart-store";
import { isOutOfStock } from "@/lib/utils/product-utils";
import { type Product, type Category } from "@/types/product";
import Link from "next/link";
import { StockIndicator } from "./StockIndicator";

type ProductCardProps = {
  product: Product;
  category?: Category | null;
};

export function ProductCard({ product, category }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const outOfStock = isOutOfStock(product);

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative w-full" style={{ aspectRatio: "4 / 3" }}>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      </Link>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle>{product.name}</CardTitle>
            <CardDescription>{product.description}</CardDescription>
          </div>
        </div>
        {category && (
          <div className="text-xs text-neutral-500">
            {category.name}
          </div>
        )}
        <StockIndicator product={product} showCount={true} />
      </CardHeader>
      <CardContent className="mt-auto text-lg font-semibold">
        ${product.price.toFixed(2)}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={() => addItem(product)}
          disabled={outOfStock}
        >
          {outOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}

