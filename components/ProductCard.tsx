'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { type Product, type Category } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { StockIndicator } from "./StockIndicator";
import { AddToCartButton } from "./AddToCartButton";

type ProductCardProps = {
  product: Product;
  category?: Category | null;
};

export function ProductCard({ product, category }: ProductCardProps) {

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <Link href={`/products/${product.id}`} className="block" aria-label={`View details for ${product.name}`}>
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform hover:scale-105"
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </Link>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="line-clamp-2">{product.name}</CardTitle>
            <CardDescription className="line-clamp-2 text-sm sm:text-base">
              {product.description}
            </CardDescription>
          </div>
        </div>
        {category && (
          <div className="text-xs text-neutral-500" aria-label={`Category: ${category.name}`}>
            {category.name}
          </div>
        )}
        <StockIndicator product={product} showCount={true} />
      </CardHeader>
      <CardContent className="mt-auto">
        <div className="text-lg font-semibold" aria-label={`Price: $${product.price.toFixed(2)}`}>
          ${product.price.toFixed(2)}
        </div>
      </CardContent>
      <CardFooter>
        <AddToCartButton
          product={product}
          className="w-full"
        />
      </CardFooter>
    </Card>
  );
}

