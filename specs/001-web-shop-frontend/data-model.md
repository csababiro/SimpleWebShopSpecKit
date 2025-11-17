# Data Model: Web Shop Frontend

**Feature**: Web Shop Frontend  
**Date**: 2025-01-27  
**Phase**: 1 - Design & Contracts

## Entities

### Product

Represents an item available for purchase in the shop.

**Attributes**:
- `id` (string, required, unique): Unique product identifier
- `name` (string, required): Product name/title
- `description` (string, required): Full product description
- `price` (number, required, >= 0): Product price in currency units
- `imageUrl` (string, required): URL to product image
- `category` (string, required): Product category identifier (references Category.id)
- `stock` (number, required, >= 0): Number of items available in stock
- `availability` (string, optional, computed): Availability status derived from stock (e.g., "in_stock", "out_of_stock", "low_stock")

**Validation Rules**:
- `id` must be non-empty string
- `name` must be non-empty string, max 200 characters
- `description` must be non-empty string, max 2000 characters
- `price` must be non-negative number, max 2 decimal places
- `imageUrl` must be valid URL format
- `category` must be non-empty string, must reference existing Category.id
- `stock` must be non-negative integer (0 or positive)
- `availability` is computed: "out_of_stock" if stock = 0, "low_stock" if stock < 5, "in_stock" otherwise

**State Transitions**: 
- Stock decreases when items added to cart (validated client-side for MVP)
- Stock can be updated when product data refreshed

**Relationships**:
- One Product belongs to one Category (many-to-one via `category`)
- One Product can be in many CartItems (one-to-many)
- Product is referenced by CartItem via `productId`

### Category

Represents a product category for organizing and filtering products.

**Attributes**:
- `id` (string, required, unique): Unique category identifier
- `name` (string, required): Category name/title
- `description` (string, optional): Category description

**Validation Rules**:
- `id` must be non-empty string
- `name` must be non-empty string, max 100 characters
- `description` must be string, max 2000 characters if provided

**State Transitions**: None (static data for MVP)

**Relationships**:
- One Category can have many Products (one-to-many)

### Cart

Represents a user's shopping cart containing selected products.

**Attributes**:
- `items` (CartItem[], required): Array of cart items
- `createdAt` (timestamp, optional): Cart creation timestamp (for future use)
- `updatedAt` (timestamp, optional): Last update timestamp (for future use)

**Validation Rules**:
- `items` must be an array (can be empty)
- Each item in `items` must be a valid CartItem

**State Transitions**:
- Empty → Has Items: When first product added
- Has Items → Empty: When all items removed
- Has Items → Has Items: When items added, removed, or quantities updated

**Relationships**:
- Cart contains many CartItems (one-to-many)
- Cart is stored client-side (Zustand store) for MVP

### CartItem

Represents a single product in the shopping cart with quantity.

**Attributes**:
- `product` (Product, required): Reference to product being purchased
- `quantity` (number, required, >= 1): Quantity of product in cart

**Validation Rules**:
- `product` must be a valid Product object
- `quantity` must be positive integer, max 999 (reasonable limit)
- `quantity` must not exceed product stock count
- Product ID must exist in product catalog
- Cannot add item if product stock is zero

**State Transitions**:
- Created: When product added to cart (quantity = 1, validated against stock)
- Updated: When quantity changed (validated against available stock)
- Removed: When item removed from cart

**Relationships**:
- CartItem belongs to one Cart (many-to-one)
- CartItem references one Product (many-to-one via `product.id`)

## Data Flow

### Product Data Flow
1. Products and categories loaded from `data/products.json` and `data/categories.json` (MVP) or Supabase (future)
2. Products displayed in catalog (server component) with category and stock information
3. Products can be filtered by category
4. Product detail fetched by ID for detail page (includes category and stock)
5. Product referenced in cart items (stock validated when adding/updating)

### Cart Data Flow
1. Cart state managed by Zustand store (`lib/cart-store.ts`)
2. Cart persisted to sessionStorage/localStorage
3. Cart items reference Product objects
4. Stock validation performed when adding/updating cart items
5. Cart totals calculated from items (quantity × price)
6. Cart displays warnings for items that become out of stock

## Type Definitions

```typescript
// types/product.ts (to be updated)
export type Category = {
  id: string;
  name: string;
  description?: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string; // Category ID
  stock: number; // Number of items available
  availability?: "in_stock" | "low_stock" | "out_of_stock"; // Computed from stock
};

// types/cart.ts (to be created)
export type CartItem = {
  product: Product;
  quantity: number; // Validated against product.stock
};

export type Cart = {
  items: CartItem[];
};
```

## Future Extensions

For backend integration:
- User authentication and cart persistence
- Order entity and order history
- Real-time stock updates and inventory management
- Product reviews and ratings
- Category hierarchy (parent/child categories)
- Stock alerts and notifications
- Multi-warehouse inventory tracking

