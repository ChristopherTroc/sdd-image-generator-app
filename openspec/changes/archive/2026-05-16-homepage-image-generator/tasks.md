## 1. Move Generate Page to Home Page

- [x] 1.1 Copy content from `src/app/generate/page.tsx` into `src/app/page.tsx` (replacing the old welcome page)
- [x] 1.2 Update root layout metadata in `src/app/layout.tsx` — change title to "AI Image Generator" and update description
- [x] 1.3 Remove the "Generate" navigation link (`<a href="/generate">`) from the layout header — keep only `<ThemeToggle />`
- [x] 1.4 Move `src/app/generate/page.test.tsx` to `src/app/page.test.tsx` and update imports

## 2. Clean Up Old Route

- [x] 2.1 Delete `src/app/generate/` directory (old page, tests, and any other files)

## 3. Verify

- [x] 3.1 Run `npm run test` and verify all tests pass
- [x] 3.2 Run `npm run test:coverage` and verify ≥90% coverage
- [x] 3.3 Run `npm run build` and verify no build errors
- [x] 3.4 Run `npm run lint` and verify no linting errors
- [x] 3.5 Run `npm run type-check` and verify no type errors
