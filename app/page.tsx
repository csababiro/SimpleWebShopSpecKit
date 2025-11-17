import { ProductCard } from "@/components/ProductCard";
import products from "@/data/products.json";
import type { Product } from "@/types/product";

const productList = products as Product[];

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="space-y-3 text-center md:text-left">
        <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
          New arrivals
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Discover products curated for everyday living
        </h1>
        <p className="text-neutral-600">
          Thoughtfully selected essentials to elevate your daily routines.
        </p>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {productList.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </div>
  );
}
