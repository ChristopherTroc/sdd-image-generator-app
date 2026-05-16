## Context

The project is a Next.js 16 application with TypeScript, Tailwind CSS v4, and ESLint. It uses `tsconfig.json` with path aliases (`@/` maps to `src/`). There is currently no testing setup. Vitest integrates seamlessly with the existing Vite-based toolchain (Next.js uses Turbopack, but Vitest can still be configured independently with `vitest.config.ts`).

Vitest v3 is the latest stable major version compatible with Vite 6+. For Next.js component testing, `@testing-library/react` paired with `jsdom` provides a lightweight DOM environment without a browser.

## Goals / Non-Goals

**Goals:**
- Install and configure Vitest as the test runner
- Integrate React Testing Library for component tests
- Set up `jsdom` as the test environment
- Configure TypeScript path alias resolution in tests (`@/` → `src/`)
- Create a test setup file with `@testing-library/jest-dom` matchers
- **Achieve ≥90% test coverage** across statements, branches, functions, and lines
- Configure Vitest coverage thresholds to **fail the build** if coverage drops below 90%
- Write comprehensive tests for all existing source files:
  - `Button.tsx` (variants, events, attributes, edge cases)
  - `ThemeToggle.tsx` (theme cycling, icons, ARIA labels)
  - `theme.tsx` (provider, useTheme, localStorage, system preference)
  - `page.tsx` (renders all sections, cards, dark mode classes)
  - `layout.tsx` (metadata, structure)
  - `lib/env.ts` (environment variable logic)
- Add `npm run test` / `test:watch` / `test:coverage` / `test:ui` scripts
- Add ESLint configuration for test files

**Non-Goals:**
- End-to-end testing (Playwright/Cypress — future change)
- Integration testing with API routes
- Snapshot testing (prefer behavioral assertions)
- Testing third-party library internals

## Decisions

**1. Vitest over Jest**
- **Decision**: Use Vitest as the test runner
- **Rationale**: Native TypeScript support, faster execution (ESM-native), same API as Jest, integrates with existing Vite ecosystem. No need for `ts-jest` or Babel transforms.
- **Alternatives Considered**: Jest (slower, requires `ts-jest` + Babel config), Playwright Component Tests (browser-based, heavier for unit tests)

**2. React Testing Library over Enzyme**
- **Decision**: Use `@testing-library/react` for component testing
- **Rationale**: Modern, encouraged by React team, tests behavior over implementation. Works well with Vitest.
- **Alternatives Considered**: Enzyme (legacy, unmaintained), Cypress Component Test (overkill for unit tests)

**3. jsdom as Test Environment**
- **Decision**: Use `jsdom` environment for component tests
- **Rationale**: Lightweight DOM simulation, standard for React component testing with Vitest, no browser required.
- **Alternatives Considered**: `happy-dom` (faster but less compatible), `edge-runtime` (not suitable for DOM tests)

**4. Separate vitest.config.ts over merging with next.config**
- **Decision**: Create a standalone `vitest.config.ts` with explicit path alias resolution
- **Rationale**: Clean separation of concerns, independent configuration, easy to modify without touching Next.js config.
- **Alternatives Considered**: Inline config in `package.json`, merging with `next.config.ts` (not possible)

**5. Test File Location**
- **Decision**: Co-locate `*.test.tsx` files next to components (e.g., `Button.test.tsx` beside `Button.tsx`) with shared test utilities in `src/tests/`
- **Rationale**: Co-location keeps tests close to source for discoverability; shared setup in `src/tests/` avoids duplication.
- **Alternatives Considered**: Centralized `__tests__/` directory (less discoverable), `tests/` at root (far from source)

**6. 90% Coverage Threshold Enforced in CI**
- **Decision**: Configure Vitest's `coverage.threshold` to require ≥90% for statements, branches, functions, and lines, and fail the test run if unmet
- **Rationale**: Enforces a high quality bar automatically. Prevents coverage regressions as the codebase grows. Developers get immediate feedback when new code lacks tests.
- **Alternatives Considered**: No threshold (coverage can degrade silently), 80% threshold (too permissive), 100% (unrealistic for UI components with edge cases)

## Risks / Trade-offs

**[Next.js Specific Features]** → Components using `next/navigation`, `next/image`, or other Next.js APIs may need additional mocking. Mitigate by abstracting Next.js dependencies in components or using Vitest mocking.

**[jsdom Limitations]** → `jsdom` doesn't implement all browser APIs (e.g., `window.matchMedia`, `IntersectionObserver`). Mitigate by adding polyfills in the setup file as needed.

**[Test Maintenance]** → Tests that are too tightly coupled to implementation details break easily. Mitigate by following Testing Library best practices (test behavior, not implementation).

## Migration Plan

**Phase 1: Dependencies & Configuration**
- Install Vitest, React Testing Library, jsdom, and related packages
- Create `vitest.config.ts` with path aliases and `jsdom` environment
- Create `src/tests/setup.ts` with `@testing-library/jest-dom` import
- Add `@types/react-dom` if needed

**Phase 2: Scripts & Integration**
- Add test scripts to `package.json`
- Update `tsconfig.json` to include Vitest types
- Update `.gitignore` to exclude `coverage/`
- Configure ESLint for test files (`jest/recommended` or appropriate)

**Phase 3: Comprehensive Tests (Target ≥90% Coverage)**
- Write tests for `Button.tsx` (variants, events, attributes, edge cases)
- Write tests for `ThemeToggle.tsx` (theme cycling, icon rendering, ARIA labels)
- Write tests for `theme.tsx` (provider, useTheme hook, localStorage interaction, system preference detection, edge cases)
- Write tests for `page.tsx` (all sections render, card content, dark mode class presence)
- Write tests for `lib/env.ts` (environment variable parsing, validation, error handling)
- Verify total coverage meets ≥90% threshold across all metrics

**Phase 4: Coverage Gate & Documentation**
- Configure Vitest coverage thresholds (90% on all metrics)
- Verify `npm run test:coverage` fails if threshold is unmet
- Add testing section to `CONTRIBUTING.md`
- Document coverage expectations and how to check coverage locally

## Open Questions

- Should we add `@testing-library/user-event` for more realistic user interactions, or keep it minimal with `fireEvent`?
- Do we want to set up GitHub Actions CI to run tests on pull requests in this change or a separate one?
