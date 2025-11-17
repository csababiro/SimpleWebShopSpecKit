"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import type { Category } from "@/types/product";

type CategoryFilterProps = {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange?: (categoryId: string | null) => void;
};

export function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryChange = (categoryId: string | null) => {
    if (onCategoryChange) {
      onCategoryChange(categoryId);
      return;
    }

    // Default behavior: update URL
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId) {
      params.set("category", categoryId);
    } else {
      params.delete("category");
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter products by category">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        onClick={() => handleCategoryChange(null)}
        className="text-sm"
        aria-pressed={selectedCategory === null}
        aria-label="Show all products"
      >
        All Products
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          onClick={() => handleCategoryChange(category.id)}
          className="text-sm"
          aria-pressed={selectedCategory === category.id}
          aria-label={`Filter by ${category.name} category`}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
}
