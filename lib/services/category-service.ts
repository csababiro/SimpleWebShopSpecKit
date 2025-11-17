import { getAllCategories } from "@/lib/supabase/client";
import type { Category } from "@/types/product";

/**
 * Service layer for category operations
 * Provides abstraction over data fetching for categories
 */
export class CategoryService {
  /**
   * Get all categories
   * @returns Promise resolving to array of categories
   */
  static async getAllCategories(): Promise<Category[]> {
    try {
      return await getAllCategories();
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new Error("Failed to fetch categories");
    }
  }

  /**
   * Get category by ID
   * @param id Category ID
   * @returns Promise resolving to category or null if not found
   */
  static async getCategoryById(id: string): Promise<Category | null> {
    try {
      const categories = await getAllCategories();
      return categories.find((cat) => cat.id === id) || null;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw new Error(`Failed to fetch category ${id}`);
    }
  }
}

