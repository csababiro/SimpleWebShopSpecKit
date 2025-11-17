// Mock Supabase client for MVP
// This will be replaced with real Supabase client when backend is integrated

import products from "@/data/products.json";
import categories from "@/data/categories.json";
import type { Product } from "@/types/product";
import type { Category } from "@/types/product";

// Mock Supabase client interface
export const supabase = {
  from: (table: string) => {
    if (table === "products") {
      return {
        select: () => {
          return Promise.resolve({
            data: products as Product[],
            error: null,
          });
        },
      };
    }
    if (table === "categories") {
      return {
        select: () => {
          return Promise.resolve({
            data: categories as Category[],
            error: null,
          });
        },
      };
    }
    return {
      select: () => Promise.resolve({ data: [], error: null }),
    };
  },
};

// Helper function to get product by ID
export async function getProductById(id: string): Promise<Product | null> {
  const product = (products as Product[]).find((p) => p.id === id);
  return product || null;
}

// Helper function to get products by category
export async function getProductsByCategory(
  categoryId: string
): Promise<Product[]> {
  return (products as Product[]).filter((p) => p.category === categoryId);
}

// Helper function to get all categories
export async function getAllCategories(): Promise<Category[]> {
  return categories as Category[];
}

// Helper function to get all products
export async function getAllProducts(): Promise<Product[]> {
  return products as Product[];
}

