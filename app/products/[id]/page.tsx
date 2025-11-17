import { ProductDetail } from "@/components/ProductDetail";
import { ErrorState } from "@/components/ErrorState";
import { CategoryService } from "@/lib/services/category-service";
import { ProductService } from "@/lib/services/product-service";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type ProductDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  // Fetch product and category
  let product = null;
  let category = null;
  let error: Error | null = null;

  try {
    product = await ProductService.getProductById(id);

    // If product not found, return 404
    if (!product) {
      notFound();
    }

    // Fetch category if product has one
    if (product.category) {
      category = await CategoryService.getCategoryById(product.category);
    }
  } catch (err) {
    error = err instanceof Error ? err : new Error("Failed to load product");
    console.error("Error loading product:", err);
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          title="Failed to load product"
          message="We couldn't load the product details. Please try again later."
        />
        <div className="mt-6">
          <Link href="/">
            <Button variant="outline">← Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  // This should not happen due to notFound() above, but TypeScript needs it
  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            ← Back to Products
          </Button>
        </Link>
      </div>
      <ProductDetail product={product} category={category} />
    </div>
  );
}

// Generate static params for known products (optional, for better performance)
export async function generateStaticParams() {
  try {
    const products = await ProductService.getAllProducts();
    return products.map((product) => ({
      id: product.id,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

