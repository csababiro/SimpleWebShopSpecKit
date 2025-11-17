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
import { type Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="relative w-full" style={{ aspectRatio: "4 / 3" }}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto text-lg font-semibold">
        ${product.price.toFixed(2)}
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => addItem(product)}>
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}

