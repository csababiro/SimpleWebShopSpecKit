# Research: Web Shop Frontend

**Feature**: Web Shop Frontend  
**Date**: 2025-01-27  
**Phase**: 0 - Outline & Research

## Research Topics

### 1. Next.js 16 App Router E-commerce Patterns

**Decision**: Use Next.js 16 App Router with server components by default, client components only for interactivity.

**Rationale**: 
- Next.js 16 App Router provides optimal performance with server components reducing client bundle size
- Server components can fetch data directly without client-side API calls
- Client components (`"use client"`) only needed for cart interactions, form submissions, and interactive UI
- Follows constitution principle of server components by default

**Alternatives considered**:
- Pages Router: Deprecated pattern, larger client bundles, less optimal performance
- Pure client-side React: Loses Next.js optimizations, SEO benefits, and performance improvements

**Key Patterns**:
- Server components for product listing and detail pages
- Client components for cart management (Zustand store)
- Route handlers for future API integration (not needed for MVP)
- Dynamic routes for product detail pages: `app/products/[id]/page.tsx`

### 2. Supabase Client Setup for Frontend Data Mocking

**Decision**: Use Supabase JavaScript client library with local/mocked data source for MVP, structured for easy migration to real Supabase backend.

**Rationale**:
- Supabase client provides consistent API that can work with mocked data or real backend
- Easy migration path: swap data source without changing component code
- Type-safe client with TypeScript support
- Follows layered separation: service abstraction layer

**Alternatives considered**:
- Direct JSON imports: Simple but no migration path, violates service layer principle
- Mock Service Worker (MSW): Overkill for static data, adds complexity
- Custom API layer: More work, reinventing patterns Supabase already provides

**Implementation Approach**:
- Create Supabase client instance in `lib/supabase/client.ts`
- Use Supabase query patterns but with local JSON data initially
- Structure allows swapping to real Supabase instance via environment variables
- Type definitions match Supabase table structure for future compatibility

**Key Patterns**:
```typescript
// lib/supabase/client.ts - Mock implementation
export const supabase = {
  from: (table: string) => ({
    select: () => Promise.resolve({ data: mockData, error: null })
  })
}
```

### 3. Zustand State Management for Cart

**Decision**: Continue using existing Zustand store for cart state management.

**Rationale**:
- Already implemented and working (`lib/cart-store.ts`)
- Lightweight, no boilerplate compared to Redux
- TypeScript support with type inference
- Persistence can be added via middleware (localStorage/sessionStorage)
- Follows constitution: client-side state in appropriate layer

**Alternatives considered**:
- React Context: More boilerplate, performance concerns with frequent updates
- Redux: Overkill for simple cart state, too much boilerplate
- Local state only: No persistence, state lost on navigation

**Enhancements Needed**:
- Add session persistence middleware for cart state
- Add quantity update method (currently only add/remove)
- Ensure cart state persists across page navigation

### 4. Testing Setup for Next.js 16

**Decision**: Configure Jest + React Testing Library for component and unit tests, with Next.js testing utilities.

**Rationale**:
- Jest is standard for Next.js projects
- React Testing Library aligns with testing best practices (user-centric testing)
- Next.js provides testing utilities for App Router
- Supports both server and client component testing

**Alternatives considered**:
- Vitest: Faster but less ecosystem support, requires more configuration
- Cypress: E2E only, too heavy for unit/component tests
- No testing: Violates constitution principle V (Testing & Quality Assurance)

**Configuration Needed**:
- Jest config for Next.js 16 and TypeScript
- React Testing Library setup
- Mock setup for Next.js router and Supabase client
- Test utilities for server/client component testing

**Key Patterns**:
- Unit tests for cart store logic
- Component tests for UI components
- Integration tests for user flows (browse → view → add to cart)

### 5. Responsive Design and Accessibility

**Decision**: Use Tailwind CSS with mobile-first responsive design, semantic HTML, and ARIA attributes.

**Rationale**:
- Tailwind CSS already configured in project
- Mobile-first approach ensures base experience works on all devices
- Semantic HTML and ARIA support accessibility requirements
- Follows constitution principle IV (Accessibility & User Experience)

**Key Patterns**:
- Responsive grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Semantic elements: `<nav>`, `<main>`, `<article>`, `<button>`
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus management for modals/drawers

### 6. Performance Optimization Strategies

**Decision**: Implement Next.js 16 optimizations: server components, image optimization, lazy loading, and code splitting.

**Rationale**:
- Meets success criteria: page load < 2 seconds
- Next.js Image component for optimized image loading
- Dynamic imports for client components
- Server components reduce client bundle size

**Key Patterns**:
- `next/image` for product images with lazy loading
- `next/dynamic` for cart sheet (only loads when needed)
- Server components for static content
- Minimal client JavaScript bundle

## Resolved Clarifications

All technical decisions resolved. No NEEDS CLARIFICATION markers remain.

## Next Steps

Proceed to Phase 1: Design & Contracts
- Create data-model.md with Product, Cart, CartItem entities
- Define API contracts structure (for future backend integration)
- Create quickstart.md with setup and development instructions

