import type { Product } from "@/types/product";

/**
 * Compute product availability status from stock count
 * @param stock Stock count
 * @returns Availability status: "out_of_stock" | "low_stock" | "in_stock"
 */
export function computeAvailability(stock: number): "in_stock" | "low_stock" | "out_of_stock" {
  if (stock <= 0) {
    return "out_of_stock";
  }
  if (stock < 5) {
    return "low_stock";
  }
  return "in_stock";
}

/**
 * Get availability status for a product
 * @param product Product object
 * @returns Availability status
 */
export function getProductAvailability(
  product: Product
): "in_stock" | "low_stock" | "out_of_stock" {
  return computeAvailability(product.stock);
}

/**
 * Check if product is in stock
 * @param product Product object
 * @returns true if product has stock > 0
 */
export function isInStock(product: Product): boolean {
  return product.stock > 0;
}

/**
 * Check if product is low stock
 * @param product Product object
 * @returns true if product has stock > 0 and < 5
 */
export function isLowStock(product: Product): boolean {
  return product.stock > 0 && product.stock < 5;
}

/**
 * Check if product is out of stock
 * @param product Product object
 * @returns true if product has stock <= 0
 */
export function isOutOfStock(product: Product): boolean {
  return product.stock <= 0;
}

/**
 * Get availability label for display
 * @param product Product object
 * @returns Human-readable availability label
 */
export function getAvailabilityLabel(product: Product): string {
  const availability = getProductAvailability(product);
  switch (availability) {
    case "out_of_stock":
      return "Out of Stock";
    case "low_stock":
      return "Low Stock";
    case "in_stock":
      return "In Stock";
  }
}

