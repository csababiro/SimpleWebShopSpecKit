"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Category, Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { StockIndicator } from "./StockIndicator";
import { AddToCartButton } from "./AddToCartButton";

type ProductDetailProps = {
  product: Product;
  category: Category | null;
};

export function ProductDetail({ product, category }: ProductDetailProps) {

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
        {/* Breadcrumbs */}
        {category && (
          <nav aria-label="Breadcrumb" className="text-sm">
            <ol className="flex items-center gap-2 text-neutral-500">
              <li>
                <Link href="/" className="hover:text-neutral-900 hover:underline">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href={`/?category=${category.id}`}
                  className="hover:text-neutral-900 hover:underline"
                >
                  {category.name}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-neutral-900" aria-current="page">
                {product.name}
              </li>
            </ol>
          </nav>
        )}

        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {product.name}
          </h1>
          {category && (
            <div className="mt-2">
              <Link
                href={`/?category=${category.id}`}
                className="text-sm text-neutral-500 hover:text-neutral-900 hover:underline focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 rounded"
                aria-label={`View all products in ${category.name} category`}
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
          <AddToCartButton
            product={product}
            size="lg"
            className="flex-1"
          />
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

