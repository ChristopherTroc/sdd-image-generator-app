## Why

Adding a dedicated testing framework ensures code reliability, prevents regressions, and establishes quality gates early in development. Vitest is the natural choice for a Vite-powered Next.js project — it shares configuration with the build toolchain, runs tests extremely fast with native TypeScript support, and provides a compatible API with Jest for easy adoption. Without tests, there's no safety net for refactoring or adding new features.

This project targets a **minimum 90% test coverage threshold** across all metrics (statements, branches, functions, lines) to enforce a high quality bar from the start.

## What Changes

- Install Vitest with `@testing-library/react` and `@testing-library/jest-dom` for component testing
- Create a Vitest configuration file (`vitest.config.ts`) integrated with the project's TypeScript and path aliases
- Configure Vitest with a **≥90% coverage threshold** that fails the build if unmet
- Add test scripts to `package.json`: `test`, `test:watch`, `test:ui`, and `test:coverage`
- Create a test setup file with `@testing-library/jest-dom` matchers
- Write **comprehensive tests** for all existing source files to meet the ≥90% target: `Button.tsx`, `ThemeToggle.tsx`, `theme.tsx`, `page.tsx`, `layout.tsx`, and `lib/env.ts`
- Configure ESLint integration for test files
- Update `.gitignore` for coverage output
- Add testing documentation to `CONTRIBUTING.md`

## Capabilities

### New Capabilities
- `vitest`: Testing infrastructure with Vitest, React Testing Library, and comprehensive test coverage for all source files (≥90% threshold)

### Modified Capabilities
<!-- No existing capabilities being modified -->

## Impact

- **Code**: New `vitest.config.ts` with coverage thresholds, `src/tests/` directory with comprehensive test suite, test setup file
- **APIs**: No API changes
- **Dependencies**: New devDependencies: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`, `@vitejs/plugin-react`, `@vitest/coverage-v8`
- **Systems**: Test runner integrated with `npm test`; coverage reports generated to `coverage/` directory; builds will fail if coverage drops below 90%
