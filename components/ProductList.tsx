import { ProductCard } from "@/components/ProductCard";
import type { Category } from "@/types/product";
import type { Product } from "@/types/product";

type ProductListProps = {
  products: Product[];
  categoryMap?: Map<string, Category>;
};

export function ProductList({ products, categoryMap }: ProductListProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          category={categoryMap?.get(product.category) || null}
        />
      ))}
    </div>
  );
}

