# Quickstart: Web Shop Frontend

**Feature**: Web Shop Frontend  
**Date**: 2025-01-27  
**Phase**: 1 - Design & Contracts

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git (for version control)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Install Additional Dependencies (if needed)

For Supabase client (for future backend integration):
```bash
npm install @supabase/supabase-js
```

For testing (if not already configured):
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
```

### 3. Environment Variables

Create `.env.local` file (optional for MVP):
```env
# Future: Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

For MVP, these are not required as data is loaded from `data/products.json`.

### 4. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
  ├── page.tsx              # Home page (product catalog)
  ├── products/[id]/
  │   └── page.tsx          # Product detail page
  └── layout.tsx            # Root layout

components/
  ├── ProductCard.tsx       # Product card (server component)
  ├── ProductList.tsx       # Product grid (server component)
  ├── ProductDetail.tsx     # Product detail view (server component)
  ├── CartSheet.tsx         # Cart drawer (client component)
  └── ui/                   # shadcn/ui components

lib/
  ├── cart-store.ts         # Zustand cart store
  └── supabase/
      └── client.ts         # Supabase client (mocked for MVP)

types/
  └── product.ts            # TypeScript type definitions

data/
  └── products.json         # Mock product data
```

## Development Workflow

### Adding a New Product

Edit `data/products.json`:
```json
{
  "id": "product-new",
  "name": "New Product",
  "description": "Product description",
  "price": 99,
  "imageUrl": "https://example.com/image.jpg"
}
```

### Modifying Cart Behavior

Edit `lib/cart-store.ts` to update cart logic:
- Add new methods (e.g., `updateQuantity`)
- Modify existing methods
- Add persistence middleware

### Creating New Components

1. **Server Component** (default):
```typescript
// components/MyComponent.tsx
export default function MyComponent() {
  return <div>Content</div>;
}
```

2. **Client Component** (for interactivity):
```typescript
// components/MyComponent.tsx
"use client";

import { useState } from "react";

export default function MyComponent() {
  const [state, setState] = useState();
  return <div>Interactive content</div>;
}
```

## Testing

### Run Tests

```bash
npm test
# or
yarn test
```

### Test Structure

```
__tests__/
  ├── components/          # Component tests
  ├── lib/                 # Unit tests (cart store, utilities)
  └── integration/         # Integration tests (user flows)
```

### Example Test

```typescript
// __tests__/lib/cart-store.test.ts
import { useCartStore } from "@/lib/cart-store";

describe("Cart Store", () => {
  it("should add item to cart", () => {
    const { addItem, items } = useCartStore.getState();
    const product = { id: "1", name: "Test", price: 10, ... };
    addItem(product);
    expect(items).toHaveLength(1);
  });
});
```

## Building for Production

```bash
npm run build
npm start
```

## Key Features

### Product Catalog
- Browse all products on homepage
- Responsive grid layout
- Server-side rendering for performance

### Product Details
- Dynamic route: `/products/[id]`
- Full product information
- Add to cart functionality

### Shopping Cart
- Client-side state management (Zustand)
- Session persistence
- Real-time updates
- Cart drawer/sheet UI

## Troubleshooting

### Products not loading
- Check `data/products.json` exists and is valid JSON
- Verify file path in import statements

### Cart not persisting
- Check browser localStorage/sessionStorage is enabled
- Verify Zustand persistence middleware is configured

### Build errors
- Run `npm run lint` to check for TypeScript errors
- Ensure all types are properly defined in `types/` directory

## Next Steps

1. Implement product catalog page
2. Create product detail page
3. Enhance cart functionality
4. Add loading and error states
5. Implement responsive design
6. Add accessibility features
7. Write tests

## Resources

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev)
- [Zustand Documentation](https://zustand-demo.pmnd.rs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

