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
- `availability` (string, optional): Availability status (e.g., "in_stock", "out_of_stock", "pre_order")

**Validation Rules**:
- `id` must be non-empty string
- `name` must be non-empty string, max 200 characters
- `description` must be non-empty string, max 2000 characters
- `price` must be non-negative number, max 2 decimal places
- `imageUrl` must be valid URL format
- `availability` must be one of predefined values if provided

**State Transitions**: None (static data for MVP)

**Relationships**:
- One Product can be in many CartItems (one-to-many)
- Product is referenced by CartItem via `productId`

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
- Product ID must exist in product catalog

**State Transitions**:
- Created: When product added to cart (quantity = 1)
- Updated: When quantity changed
- Removed: When item removed from cart

**Relationships**:
- CartItem belongs to one Cart (many-to-one)
- CartItem references one Product (many-to-one via `product.id`)

## Data Flow

### Product Data Flow
1. Products loaded from `data/products.json` (MVP) or Supabase (future)
2. Products displayed in catalog (server component)
3. Product detail fetched by ID for detail page
4. Product referenced in cart items

### Cart Data Flow
1. Cart state managed by Zustand store (`lib/cart-store.ts`)
2. Cart persisted to sessionStorage/localStorage
3. Cart items reference Product objects
4. Cart totals calculated from items (quantity × price)

## Type Definitions

```typescript
// types/product.ts (existing)
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
};

// types/cart.ts (to be created)
export type CartItem = {
  product: Product;
  quantity: number;
};

export type Cart = {
  items: CartItem[];
};
```

## Future Extensions

For backend integration:
- User authentication and cart persistence
- Order entity and order history
- Product categories and filtering
- Inventory management
- Product reviews and ratings

