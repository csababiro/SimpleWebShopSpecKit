import { getAllProducts, getProductById, getProductsByCategory } from "@/lib/supabase/client";
import type { Product } from "@/types/product";

/**
 * Service layer for product operations
 * Provides abstraction over data fetching for products
 */
export class ProductService {
  /**
   * Get all products
   * @returns Promise resolving to array of products
   */
  static async getAllProducts(): Promise<Product[]> {
    try {
      return await getAllProducts();
    } catch (error) {
      console.error("Error fetching all products:", error);
      throw new Error("Failed to fetch products");
    }
  }

  /**
   * Get product by ID
   * @param id Product ID
   * @returns Promise resolving to product or null if not found
   */
  static async getProductById(id: string): Promise<Product | null> {
    try {
      return await getProductById(id);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw new Error(`Failed to fetch product ${id}`);
    }
  }

  /**
   * Get products by category
   * @param categoryId Category ID
   * @returns Promise resolving to array of products in the category
   */
  static async getProductsByCategory(categoryId: string): Promise<Product[]> {
    try {
      return await getProductsByCategory(categoryId);
    } catch (error) {
      console.error(`Error fetching products for category ${categoryId}:`, error);
      throw new Error(`Failed to fetch products for category ${categoryId}`);
    }
  }

  /**
   * Search products by name (case-insensitive)
   * @param query Search query
   * @returns Promise resolving to array of matching products
   */
  static async searchProducts(query: string): Promise<Product[]> {
    try {
      const allProducts = await getAllProducts();
      const lowerQuery = query.toLowerCase();
      return allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerQuery) ||
          product.description.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error(`Error searching products with query "${query}":`, error);
      throw new Error("Failed to search products");
    }
  }
}

