"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCartStore } from "@/lib/cart-store";
import { isOutOfStock } from "@/lib/utils/product-utils";
import type { Category, Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { StockIndicator } from "./StockIndicator";

type ProductDetailProps = {
  product: Product;
  category: Category | null;
};

export function ProductDetail({ product, category }: ProductDetailProps) {
  const addItem = useCartStore((state) => state.addItem);
  const outOfStock = isOutOfStock(product);

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Product Information */}
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {product.name}
          </h1>
          {category && (
            <div className="mt-2">
              <Link
                href={`/?category=${category.id}`}
                className="text-sm text-neutral-500 hover:text-neutral-900 hover:underline"
              >
                {category.name}
              </Link>
            </div>
          )}
        </div>

        <div className="text-3xl font-semibold">
          ${product.price.toFixed(2)}
        </div>

        <StockIndicator product={product} showCount={true} />

        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base">
              {product.description}
            </CardDescription>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            size="lg"
            className="flex-1"
            onClick={() => addItem(product)}
            disabled={outOfStock}
          >
            {outOfStock ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>

        {category && (
          <div className="pt-4 border-t">
            <Link
              href={`/?category=${category.id}`}
              className="text-sm text-neutral-600 hover:text-neutral-900 hover:underline"
            >
              ← View more products in {category.name}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

