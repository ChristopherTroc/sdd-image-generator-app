## 1. Install Dependencies

- [x] 1.1 Install core testing packages:
  ```bash
  npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitejs/plugin-react @vitest/coverage-v8
  ```
- [x] 1.2 Verify installation by checking `package.json` for new devDependencies

## 2. Create Vitest Configuration

- [x] 2.1 Create `vitest.config.ts` at project root with:
  - [x] 2.1.1 `jsdom` test environment
  - [x] 2.1.2 Path alias resolution (`@/` → `src/`) matching `tsconfig.json`
  - [x] 2.1.3 Global setup file pointing to `src/tests/setup.ts`
  - [x] 2.1.4 Test file pattern: `src/**/*.test.{ts,tsx}`
  - [x] 2.1.5 React plugin for JSX transform support
  - [x] 2.1.6 Coverage thresholds: ≥90% for statements, branches, functions, and lines
  - [x] 2.1.7 Coverage provider set to `v8`

## 3. Create Test Setup File

- [x] 3.1 Create `src/tests/setup.ts` with:
  - [x] 3.1.1 `import "@testing-library/jest-dom/vitest"` for extended DOM matchers

## 4. Add Test Scripts to package.json

- [x] 4.1 Add scripts:
  - `"test": "vitest run"`
  - `"test:watch": "vitest"`
  - `"test:ui": "vitest --ui"`
  - `"test:coverage": "vitest run --coverage"`
- [x] 4.2 Verify scripts are added correctly

## 5. Update TypeScript Configuration

- [x] 5.1 Add Vitest type references in `tsconfig.json` by including `vitest/globals` types
- [x] 5.2 Ensure `src/tests/` is included in TypeScript scope

## 6. Update ESLint Configuration

- [x] 6.1 Configure ESLint to recognize Vitest globals (`describe`, `it`, `expect`, `vi`)
- [x] 6.2 Add test file overrides if needed (e.g., allow `eslint-disable` in test files)

## 7. Update .gitignore

- [x] 7.1 Add `coverage/` to `.gitignore` to prevent committing test coverage reports (already present)

## 8. Write Button Component Tests

- [x] 8.1 Create `src/components/Button.test.tsx` with tests for:
  - [x] 8.1.1 Renders children text
  - [x] 8.1.2 Applies primary variant classes by default
  - [x] 8.1.3 Applies secondary variant classes when specified
  - [x] 8.1.4 Calls `onClick` handler when clicked
  - [x] 8.1.5 Passes through additional HTML attributes (e.g., `disabled`, `type`)
  - [x] 8.1.6 Handles custom className merging

## 9. Write ThemeToggle Component Tests

- [x] 9.1 Create `src/components/ThemeToggle.test.tsx` with tests for:
  - [x] 9.1.1 Renders sun icon when theme is `"light"`
  - [x] 9.1.2 Renders moon icon when theme is `"dark"`
  - [x] 9.1.3 Renders monitor icon when theme is `"system"`
  - [x] 9.1.4 Shows correct aria-label for each theme state
  - [x] 9.1.5 Cycles through light → dark → system → light on click
  - [x] 9.1.6 Has correct ARIA label attribute

## 10. Write Theme Provider Tests

- [x] 10.1 Create `src/lib/theme.test.tsx` with tests for:
  - [x] 10.1.1 `useTheme` returns correct default values
  - [x] 10.1.2 `setTheme("dark")` updates both theme and resolvedTheme
  - [x] 10.1.3 `setTheme("light")` updates both theme and resolvedTheme
  - [x] 10.1.4 `setTheme("system")` resolves to system preference
  - [x] 10.1.5 Theme changes persist to localStorage
  - [x] 10.1.6 `ThemeProvider` applies/removes `dark` class on `<html>`
  - [x] 10.1.7 `useTheme` throws if used outside ThemeProvider
  - [x] 10.1.8 System preference changes are detected in "system" mode
  - [x] 10.1.9 localStorage errors are handled gracefully (private browsing)

## 11. Write Home Page Tests

- [x] 11.1 Create `src/app/page.test.tsx` with tests for:
  - [x] 11.1.1 Renders "Welcome to Next.js" heading
  - [x] 11.1.2 Renders description paragraph
  - [x] 11.1.3 Renders all three feature cards (TypeScript, Tailwind CSS, ESLint & Prettier)
  - [x] 11.1.4 Applies dark mode classes in the structure

## 12. Write Environment Config Tests

- [x] 12.1 Create `src/lib/env.test.ts` with tests for:
  - [x] 12.1.1 Parses environment variables correctly when present
  - [x] 12.1.2 Warns when using default values
  - [x] 12.1.3 Does not warn when environment variable is set

## 13. Verify Coverage Threshold

- [x] 13.1 Run `npm run test:coverage` and verify all coverage metrics meet ≥90%
- [x] 13.2 If coverage is below 90%, add missing tests to reach threshold
- [x] 13.3 Confirm the test run fails when coverage drops below 90% (intentional regression test)

## 14. Verify and Test

- [x] 14.1 Run `npm run test` and verify all tests pass (40/40 pass)
- [x] 14.2 Run `npm run test:coverage` and verify coverage reports generate with ≥90% all metrics (98.43% stmts, 96.42% branches, 100% funcs, 100% lines)
- [x] 14.3 Run `npm run lint` to verify no linting errors in test files
- [x] 14.4 Run `npm run build` to verify build still works
- [x] 14.5 Run `npm run type-check` to verify TypeScript types are correct
