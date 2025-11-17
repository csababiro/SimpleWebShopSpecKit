<!--
Sync Impact Report:
Version: 0.0.0 → 1.0.0 (Initial version - MAJOR bump for first release)
Modified Principles: None (initial creation)
Added Sections: All sections (initial creation)
Removed Sections: None
Templates requiring updates:
  ✅ plan-template.md - Constitution Check section references constitution
  ✅ spec-template.md - No direct constitution references, but aligns with principles
  ✅ tasks-template.md - Task organization aligns with principles
  ⚠ pending - No command files found in .specify/templates/commands/ (none to update)
Follow-up TODOs: None
-->

# Simple Web Shop Constitution

## Core Principles

### I. Component-First Architecture
All UI functionality MUST be implemented as reusable, composable React components. Components MUST be small, focused, and follow single responsibility principle. Server components are the default in Next.js App Router; use `"use client"` only when client-side interactivity is required. Components MUST be co-located with their tests when tests exist. All components MUST use TypeScript interfaces for props with no `any` types except when absolutely necessary (with documented justification).

**Rationale**: Component-based architecture enables reusability, maintainability, and testability. Server components by default optimize performance and reduce client bundle size.

### II. Type Safety (NON-NEGOTIABLE)
All code MUST be written in TypeScript with strict type checking enabled. All function parameters, return values, component props, and data structures MUST have explicit types. Avoid `any` types; use `unknown` for truly dynamic data with proper type guards. All API contracts, data models, and state structures MUST be defined in TypeScript type definitions. Type definitions MUST be centralized in `types/` directory or co-located with their usage.

**Rationale**: Type safety prevents runtime errors, improves developer experience, enables better IDE support, and serves as living documentation.

### III. Layered Separation
Frontend code MUST never directly access backend/server modules. All communication between layers MUST go through well-defined API endpoints or service abstractions. Controllers/route handlers MUST be thin orchestrators that validate input, call services, and return responses. Business logic MUST reside in service/application layers, not in UI components or route handlers. Data access MUST be isolated in repository/infrastructure layers. No layer skipping: Controllers → Services → Repositories only.

**Rationale**: Clear separation of concerns enables maintainability, testability, and allows independent evolution of layers. Prevents tight coupling and architectural violations.

### IV. Accessibility & User Experience
All interactive elements MUST support keyboard navigation and have visible focus indicators. Semantic HTML elements MUST be used over generic divs/spans. WAI-ARIA attributes MUST be used when semantics are insufficient. All form fields MUST have associated labels. Dynamic content (modals, popovers) MUST manage focus properly (trap focus, return focus on close). Error states, loading states, and empty states MUST be implemented for all data-dependent UI. Components MUST be tested for accessibility violations.

**Rationale**: Accessible applications are usable by all users, comply with legal requirements, and provide better user experience. Error/loading states prevent user confusion and improve perceived performance.

### V. Testing & Quality Assurance
Unit tests MUST be written for pure logic (utilities, hooks, business logic). Component tests MUST verify rendering, props, and output states. Integration tests MUST cover user interaction flows. Tests MUST cover happy paths, error scenarios, loading states, and edge cases. Tests MUST be co-located with their source files or organized in parallel test directories. All tests MUST be deterministic and not depend on external state or timing.

**Rationale**: Comprehensive testing ensures reliability, prevents regressions, and enables confident refactoring. Test coverage provides safety net for future changes.

## Development Workflow

All feature development MUST follow the multi-agent workflow system defined in `scratchpad/`. Features MUST be planned using `/speckit.plan`, specified using `/speckit.spec`, and broken down into tasks using `/speckit.tasks`. Implementation MUST follow the task breakdown with clear dependencies. All changes MUST comply with this constitution and be validated against acceptance criteria before completion.

**Rationale**: Structured workflow ensures consistency, traceability, and quality. Multi-agent system coordinates planning, execution, verification, and documentation.

## Performance & Optimization

Server components MUST be used by default to minimize client bundle size. Client components MUST be lazy-loaded using `next/dynamic` or React `Suspense` when appropriate. Heavy computations MUST be moved out of render functions into `useMemo`, `useEffect`, or external modules. Large lists MUST use virtualization. API routes MUST implement proper caching strategies per Next.js 15+ conventions. All data fetching MUST handle errors, loading, and empty states gracefully.

**Rationale**: Performance directly impacts user experience and business metrics. Next.js 15+ conventions optimize for modern web performance patterns.

## Governance

This constitution supersedes all other development practices and guidelines. All pull requests and code reviews MUST verify compliance with these principles. Amendments to this constitution require:
1. Documentation of the proposed change and rationale
2. Impact analysis on existing codebase and templates
3. Update to version number following semantic versioning:
   - **MAJOR**: Backward incompatible principle removals or redefinitions
   - **MINOR**: New principles or materially expanded guidance
   - **PATCH**: Clarifications, wording improvements, typo fixes
4. Propagation of changes to dependent templates and documentation
5. Update to `LAST_AMENDED_DATE` in this file

Complexity that violates principles MUST be justified in the Complexity Tracking section of implementation plans. Use `.cursor/rules/` for runtime development guidance and framework-specific best practices.

**Version**: 1.0.0 | **Ratified**: 2025-01-27 | **Last Amended**: 2025-01-27
