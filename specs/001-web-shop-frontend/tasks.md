# Tasks: Web Shop Frontend

**Input**: Design documents from `/specs/001-web-shop-frontend/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - not explicitly requested in feature specification, so no test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: Next.js 16 App Router structure with `app/`, `components/`, `lib/`, `types/`, `data/` at repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 [P] Update Product type definition with category and stock fields in types/product.ts
- [ ] T002 [P] Create Category type definition in types/product.ts
- [ ] T003 [P] Create Cart type definitions in types/cart.ts
- [ ] T004 [P] Create categories.json mock data file in data/categories.json
- [ ] T005 [P] Update products.json with category and stock fields in data/products.json
- [ ] T006 [P] Create Supabase client mock implementation in lib/supabase/client.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T007 Create product service layer for fetching products in lib/services/product-service.ts
- [ ] T008 Create category service layer for fetching categories in lib/services/category-service.ts
- [ ] T009 Create utility function to compute product availability from stock in lib/utils/product-utils.ts
- [ ] T010 Create EmptyState component in components/EmptyState.tsx
- [ ] T011 Create LoadingState component in components/LoadingState.tsx
- [ ] T012 Create ErrorState component in components/ErrorState.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Browse Products (Priority: P1) 🎯 MVP

**Goal**: Users can view a catalog of products with category filtering and stock information displayed

**Independent Test**: Can be fully tested by displaying a list of products from mock data and verifying all products render correctly with their information visible, including categories and stock counts. Category filtering can be tested by selecting different categories.

### Implementation for User Story 1

- [ ] T013 [P] [US1] Create StockIndicator component in components/StockIndicator.tsx
- [ ] T014 [P] [US1] Create CategoryFilter component in components/CategoryFilter.tsx
- [ ] T015 [US1] Update ProductCard component to display category and stock in components/ProductCard.tsx
- [ ] T016 [US1] Create ProductList component for product grid layout in components/ProductList.tsx
- [ ] T017 [US1] Update homepage to use ProductList and CategoryFilter in app/page.tsx
- [ ] T018 [US1] Implement category filtering logic in app/page.tsx
- [ ] T019 [US1] Add empty state handling for no products in app/page.tsx
- [ ] T020 [US1] Add loading state handling for product data fetching in app/page.tsx
- [ ] T021 [US1] Add error state handling for product data fetching failures in app/page.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently - users can browse products, see categories and stock, and filter by category

---

## Phase 4: User Story 2 - View Product Details (Priority: P1)

**Goal**: Users can click on a product to view detailed information including category, stock count, and availability status

**Independent Test**: Can be fully tested by clicking a product and verifying the detail page displays all product information correctly, including category and stock count. Out of stock products should show disabled Add to Cart button.

### Implementation for User Story 2

- [ ] T022 [US2] Create product detail page route in app/products/[id]/page.tsx
- [ ] T023 [US2] Create ProductDetail component in components/ProductDetail.tsx
- [ ] T024 [US2] Implement product fetching by ID in app/products/[id]/page.tsx
- [ ] T025 [US2] Display product category with link to category filter in components/ProductDetail.tsx
- [ ] T026 [US2] Display stock count and availability status in components/ProductDetail.tsx
- [ ] T027 [US2] Add not found handling for invalid product IDs in app/products/[id]/page.tsx
- [ ] T028 [US2] Add loading state for product detail page in app/products/[id]/page.tsx
- [ ] T029 [US2] Add error state for product detail page failures in app/products/[id]/page.tsx
- [ ] T030 [US2] Update ProductCard to link to product detail page in components/ProductCard.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - users can browse products and view detailed product information

---

## Phase 5: User Story 3 - Shopping Cart Management (Priority: P2)

**Goal**: Users can add products to cart, view cart contents, update quantities, and remove items with stock validation

**Independent Test**: Can be fully tested by adding items to cart, viewing cart contents, modifying quantities, and removing items without requiring backend integration. Stock validation can be tested by attempting to add more items than available.

### Implementation for User Story 3

- [ ] T031 [US3] Update cart store to validate stock when adding items in lib/cart-store.ts
- [ ] T032 [US3] Add updateQuantity method to cart store in lib/cart-store.ts
- [ ] T033 [US3] Add stock validation to updateQuantity method in lib/cart-store.ts
- [ ] T034 [US3] Add cart persistence to localStorage in lib/cart-store.ts
- [ ] T035 [US3] Create AddToCartButton component with stock validation in components/AddToCartButton.tsx
- [ ] T036 [US3] Update CartItem component to display stock warnings in components/CartItem.tsx
- [ ] T037 [US3] Update CartItem component to allow quantity updates in components/CartItem.tsx
- [ ] T038 [US3] Add stock validation to quantity updates in CartItem in components/CartItem.tsx
- [ ] T039 [US3] Update CartSheet to show stock warnings for out of stock items in components/CartSheet.tsx
- [ ] T040 [US3] Add empty cart state to CartSheet in components/CartSheet.tsx
- [ ] T041 [US3] Integrate AddToCartButton into ProductDetail component in components/ProductDetail.tsx
- [ ] T042 [US3] Disable AddToCartButton for products with zero stock in components/AddToCartButton.tsx
- [ ] T043 [US3] Display error message when attempting to exceed stock limit in components/AddToCartButton.tsx

**Checkpoint**: At this point, all user stories should work independently - users can browse products, view details, and manage cart with stock validation

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T044 [P] Add responsive design improvements for mobile devices across all components
- [ ] T045 [P] Add accessibility improvements (ARIA labels, keyboard navigation) across all components
- [ ] T046 [P] Add visual indicators for low stock (< 5 items) in components/StockIndicator.tsx
- [ ] T047 [P] Optimize product images loading with Next.js Image component in components/ProductCard.tsx
- [ ] T048 [P] Optimize product images loading with Next.js Image component in components/ProductDetail.tsx
- [ ] T049 Add category navigation breadcrumbs in components/ProductDetail.tsx
- [ ] T050 Add "View products in this category" link in components/ProductDetail.tsx
- [ ] T051 Update Header component to show cart count badge in components/Header.tsx
- [ ] T052 Add cart icon button to Header component in components/Header.tsx
- [ ] T053 Run quickstart.md validation checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Uses ProductCard from US1 but can be implemented independently
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Uses ProductDetail from US2 but can be implemented independently

### Within Each User Story

- Types and data files before components
- Service layer before components
- Base components before composite components
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks (T001-T006) marked [P] can run in parallel
- All Foundational tasks (T007-T012) can run in parallel
- Once Foundational phase completes, User Stories 1 and 2 can start in parallel (both P1)
- Tasks within User Story 1 marked [P] can run in parallel (T013, T014)
- Tasks within User Story 3 marked [P] can run in parallel (T044-T048)
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all parallel tasks for User Story 1 together:
Task: "Create StockIndicator component in components/StockIndicator.tsx"
Task: "Create CategoryFilter component in components/CategoryFilter.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add Polish → Final improvements
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Browse Products)
   - Developer B: User Story 2 (Product Details)
3. After US1 and US2 complete:
   - Developer A: User Story 3 (Cart Management)
   - Developer B: Polish tasks
4. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Stock validation is critical - ensure cart never allows adding more than available stock
- Category filtering should work seamlessly with product browsing
- All components must be responsive and accessible

