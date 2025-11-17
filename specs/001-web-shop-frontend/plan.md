# Implementation Plan: Web Shop Frontend

**Branch**: `001-web-shop-frontend` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-web-shop-frontend/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a frontend-only web shop using Next.js 16 App Router that allows users to browse products with category filtering, view product details with stock information, and manage a shopping cart with stock validation. Products include categories and stock counts. Users can filter by category and see stock availability. Cart validates stock when adding/updating items. Product data will be mocked using Supabase client libraries for future backend integration. The implementation follows component-first architecture with TypeScript strict typing, server components by default, and client components only for interactive features.

## Technical Context

**Language/Version**: TypeScript 5.x  
**Primary Dependencies**: Next.js 16.0.3, React 19.2.0, Zustand 5.0.8, Tailwind CSS 4, Supabase Client (for data mocking)  
**Storage**: Client-side session storage (localStorage/sessionStorage) for cart persistence; Supabase client for product data (mocked)  
**Testing**: Jest + React Testing Library (to be configured), Playwright (for E2E, optional)  
**Target Platform**: Web browsers (modern browsers supporting ES2020+)  
**Project Type**: Web application (frontend-only)  
**Performance Goals**: Page load < 2 seconds, cart updates < 500ms, support 100+ products without performance degradation  
**Constraints**: Frontend-only implementation, no backend API required, must work offline for cart operations, responsive design (320px - 1920px)  
**Scale/Scope**: MVP with 3 user stories (browse products with categories, view details with stock, cart management with stock validation), ~10-20 products across multiple categories initially, single-page application with routing

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Design Check (Phase 0)

### I. Component-First Architecture
✅ **PASS**: Implementation will use React components following single responsibility. Server components for product listing, client components for cart interactions.

### II. Type Safety (NON-NEGOTIABLE)
✅ **PASS**: All code will use TypeScript with strict mode. Product types already defined in `types/product.ts`.

### III. Layered Separation
✅ **PASS**: Frontend-only implementation. Data fetching will use service layer abstraction (Supabase client) that can be swapped for real API later.

### IV. Accessibility & User Experience
✅ **PASS**: All components will use semantic HTML, ARIA attributes where needed, keyboard navigation, and proper focus management. Loading, error, and empty states will be implemented.

### V. Testing & Quality Assurance
⚠️ **PARTIAL**: Testing framework needs to be configured. Unit tests for cart logic, component tests for UI, integration tests for user flows will be implemented.

**Gate Status**: ✅ **PASS** - All constitution principles can be met with planned implementation.

### Post-Design Check (Phase 1)

After Phase 1 design completion:

### I. Component-First Architecture
✅ **PASS**: Design specifies server components for ProductCard, ProductList, ProductDetail. Client components only for CartSheet, CartItem, AddToCartButton. All components follow single responsibility.

### II. Type Safety (NON-NEGOTIABLE)
✅ **PASS**: Data model defines TypeScript types for Product, CartItem, Cart. All entities have explicit type definitions. Types centralized in `types/` directory.

### III. Layered Separation
✅ **PASS**: Service layer abstraction via Supabase client in `lib/supabase/client.ts`. Components use service layer, not direct data access. Clear separation: UI → Services → Data.

### IV. Accessibility & User Experience
✅ **PASS**: Design includes EmptyState, LoadingState, ErrorState components. Responsive design specified (320px-1920px). Semantic HTML and ARIA attributes required in component specifications.

### V. Testing & Quality Assurance
✅ **PASS**: Testing strategy defined in research.md. Jest + React Testing Library configuration planned. Test structure defined: unit tests for cart store, component tests for UI, integration tests for user flows.

**Gate Status**: ✅ **PASS** - All constitution principles validated and confirmed in design phase.

## Project Structure

### Documentation (this feature)

```text
specs/001-web-shop-frontend/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/
├── page.tsx                    # Home page (product catalog)
├── products/
│   └── [id]/
│       └── page.tsx            # Product detail page
├── layout.tsx                  # Root layout
└── globals.css                 # Global styles

components/
├── ProductCard.tsx             # Product card component (server)
├── ProductList.tsx             # Product grid/list container (server)
├── ProductDetail.tsx           # Product detail view (server)
├── CategoryFilter.tsx          # Category filter component (client)
├── StockIndicator.tsx          # Stock availability indicator (server)
├── CartSheet.tsx               # Cart sidebar/drawer (client)
├── CartItem.tsx                # Individual cart item (client)
├── AddToCartButton.tsx         # Add to cart button (client, validates stock)
├── EmptyState.tsx              # Empty state component (server)
├── LoadingState.tsx            # Loading spinner/skeleton (server)
├── ErrorState.tsx              # Error message component (server)
└── ui/                         # shadcn/ui components
    ├── button.tsx
    ├── card.tsx
    ├── sheet.tsx
    └── badge.tsx

lib/
├── cart-store.ts               # Zustand cart store (existing)
├── utils.ts                    # Utility functions
└── supabase/
    └── client.ts               # Supabase client setup (mocked)

types/
├── product.ts                  # Product and Category type definitions (to be updated)
└── cart.ts                     # Cart type definitions (to be created)

data/
├── products.json               # Mock product data (to be updated with category and stock)
└── categories.json             # Mock category data (to be created)

__tests__/                      # Test files (to be created)
├── components/
├── lib/
└── integration/
```

**Structure Decision**: Using Next.js 16 App Router structure with `app/` directory. Components organized by feature/domain. Server components by default, client components marked with `"use client"`. Existing structure already has some components and cart store - will extend and enhance.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations - all constitution principles can be met with standard Next.js patterns.
