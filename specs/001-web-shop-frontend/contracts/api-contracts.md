# API Contracts: Web Shop Frontend

**Feature**: Web Shop Frontend  
**Date**: 2025-01-27  
**Phase**: 1 - Design & Contracts

## Overview

These contracts define the API structure for future backend integration. For MVP, data is mocked using Supabase client patterns, but these contracts ensure smooth migration to real backend.

## Base URL

```
Production: https://api.example.com/v1
Development: http://localhost:3000/api
```

## Authentication

For MVP: No authentication required (frontend-only)

For future: Bearer token authentication
```
Authorization: Bearer <token>
```

## Endpoints

### GET /products

Retrieve list of all products.

**Request**:
```
GET /products
Query Parameters:
  - limit (optional, number): Maximum number of products to return (default: 100)
  - offset (optional, number): Number of products to skip (default: 0)
  - category (optional, string): Filter by category ID
  - inStock (optional, boolean): Filter by stock availability (true = only in stock, false = all)
```

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": "product-1",
      "name": "Canvas Backpack",
      "description": "Durable canvas backpack...",
      "price": 79,
      "imageUrl": "https://...",
      "category": "category-1",
      "stock": 15,
      "availability": "in_stock"
    }
  ],
  "count": 10,
  "total": 10
}
```

**Error Responses**:
- 500 Internal Server Error: Server error

### GET /products/:id

Retrieve single product by ID.

**Request**:
```
GET /products/product-1
```

**Response** (200 OK):
```json
{
  "id": "product-1",
  "name": "Canvas Backpack",
  "description": "Durable canvas backpack...",
  "price": 79,
  "imageUrl": "https://...",
  "category": "category-1",
  "stock": 15,
  "availability": "in_stock"
}
```

**Error Responses**:
- 404 Not Found: Product not found
- 500 Internal Server Error: Server error

### GET /categories

Retrieve list of all product categories.

**Request**:
```
GET /categories
```

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": "category-1",
      "name": "Electronics",
      "description": "Electronic devices and accessories"
    }
  ]
}
```

### POST /cart/items (Future)

Add item to cart (requires authentication in future). Validates stock availability.

**Request**:
```json
{
  "productId": "product-1",
  "quantity": 1
}
```

**Response** (201 Created):
```json
{
  "id": "cart-item-1",
  "productId": "product-1",
  "quantity": 1,
  "createdAt": "2025-01-27T10:00:00Z"
}
```

**Error Responses**:
- 400 Bad Request: Quantity exceeds available stock
- 404 Not Found: Product not found
- 409 Conflict: Product out of stock

### GET /cart (Future)

Get current user's cart (requires authentication).

**Response** (200 OK):
```json
{
  "items": [
    {
      "id": "cart-item-1",
      "product": {
        "id": "product-1",
        "name": "Canvas Backpack",
        "price": 79,
        "imageUrl": "https://..."
      },
      "quantity": 2
    }
  ],
  "total": 158
}
```

## Data Contracts

### Product Contract

```typescript
interface CategoryResponse {
  id: string;
  name: string;
  description?: string;
}

interface ProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string; // Category ID
  stock: number; // Number of items available
  availability?: "in_stock" | "low_stock" | "out_of_stock"; // Computed from stock
}
```

### Cart Item Contract

```typescript@
interface CartItemResponse {
  id: string;
  productId: string;
  product: ProductResponse;
  quantity: number;
  createdAt: string;
}
```

### Cart Contract

```typescript
interface CartResponse {
  items: CartItemResponse[];
  total: number;
}
```

## MVP Implementation Notes

For MVP (frontend-only):
- Products loaded from `data/products.json`
- Cart managed client-side via Zustand store
- No API calls required
- Supabase client structure mimics these contracts for easy migration

## Future Enhancements

- Product search and filtering
- Product categories
- User authentication
- Cart persistence
- Order creation
- Payment processing
- Inventory management

