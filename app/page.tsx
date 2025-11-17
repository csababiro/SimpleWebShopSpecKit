import { CategoryFilter } from "@/components/CategoryFilter";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { LoadingState } from "@/components/LoadingState";
import { ProductList } from "@/components/ProductList";
import { CategoryService } from "@/lib/services/category-service";
import { ProductService } from "@/lib/services/product-service";
import type { Category } from "@/types/product";
import type { Product } from "@/types/product";
import { Suspense } from "react";

type HomePageProps = {
  searchParams: Promise<{
    category?: string;
  }>;
};

export default async function Home({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  const selectedCategoryId = resolvedSearchParams.category || null;

  // Fetch data
  let products: Product[] = [];
  let categories: Category[] = [];
  let error: Error | null = null;

  try {
    [products, categories] = await Promise.all([
      selectedCategoryId
        ? ProductService.getProductsByCategory(selectedCategoryId)
        : ProductService.getAllProducts(),
      CategoryService.getAllCategories(),
    ]);
  } catch (err) {
    error = err instanceof Error ? err : new Error("Failed to load data");
    console.error("Error loading page data:", err);
  }

  // Error state
  if (error) {
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
        <ErrorState
          title="Failed to load products"
          message="We couldn't load the products. Please try again later."
        />
      </div>
    );
  }

  // Loading state (shouldn't happen in server components, but good to have)
  if (products.length === 0 && categories.length === 0) {
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
        <LoadingState message="Loading products..." />
      </div>
    );
  }

  // Create category map for ProductCard
  const categoryMap = new Map(categories.map((cat) => [cat.id, cat]));

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

      <section className="space-y-6">
        <Suspense fallback={<div className="h-10" />}>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategoryId}
          />
        </Suspense>

        {products.length === 0 ? (
          <EmptyState
            title="No products found"
            description={
              selectedCategoryId
                ? "No products available in this category. Try selecting a different category."
                : "No products are currently available."
            }
          />
        ) : (
          <ProductList products={products} categoryMap={categoryMap} />
        )}
      </section>
    </div>
  );
}
