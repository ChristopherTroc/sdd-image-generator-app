## 1. Configure Tailwind Dark Variant

- [x] 1.1 Add `@variant dark (&:where(.dark, .dark *))` to `src/app/globals.css` to enable class-based dark mode
- [x] 1.2 Add base dark mode styles with transition on body element

## 2. Create Theme Context and Provider

- [x] 2.1 Create `src/lib/theme.tsx` with:
  - [x] 2.1.1 `Theme` type (`"light" | "dark" | "system"`)
  - [x] 2.1.2 `ThemeProviderProps` interface
  - [x] 2.1.3 `ThemeProvider` component using React Context
  - [x] 2.1.4 `useTheme()` hook for consuming components
  - [x] 2.1.5 System preference detection via `matchMedia("(prefers-color-scheme: dark)")`
  - [x] 2.1.6 `localStorage` persistence with key `theme-preference`
  - [x] 2.1.7 Listener for system preference changes when in `"system"` mode
  - [x] 2.1.8 `resolvedTheme` value that always returns `"light"` or `"dark"`

## 3. Add Flash Prevention Script

- [x] 3.1 Add an inline `<script>` in `src/app/layout.tsx` `<head>` that:
  - [x] 3.1.1 Reads `localStorage.getItem("theme-preference")`
  - [x] 3.1.2 Applies `"dark"` class to `<html>` if preference is `"dark"` or if it's `"system"` and `matchMedia` prefers dark
  - [x] 3.1.3 Wraps `localStorage` access in try-catch for private browsing compatibility

## 4. Create Theme Toggle Component

- [x] 4.1 Create `src/components/ThemeToggle.tsx` with:
  - [x] 4.1.1 A button that cycles through light → dark → system → light
  - [x] 4.1.2 Inline SVG icons: sun (light), moon (dark), monitor (system)
  - [x] 4.1.3 Proper ARIA labels: "Switch to dark mode", "Switch to light mode", etc.
  - [x] 4.1.4 Dark mode styles for the toggle button itself
  - [x] 4.1.5 Smooth hover/focus styles

## 5. Integrate Theme Provider and Toggle in Layout

- [x] 5.1 Wrap `body` children with `<ThemeProvider>` in `src/app/layout.tsx`
- [x] 5.2 Add `<ThemeToggle />` component to the layout
- [x] 5.3 Add the flash-prevention inline script to `<head>`

## 6. Apply Dark Mode Styles to Home Page

- [x] 6.1 Update `src/app/page.tsx`:
  - [x] 6.1.1 Main background gradient: add `dark:from-gray-900 dark:to-gray-950`
  - [x] 6.1.2 Headings: add `dark:text-gray-100`
  - [x] 6.1.3 Body text: add `dark:text-gray-400`
  - [x] 6.1.4 Card backgrounds: add `dark:bg-gray-800`
  - [x] 6.1.5 Card headings: add `dark:text-gray-100`
  - [x] 6.1.6 Card text: add `dark:text-gray-400`

## 7. Apply Dark Mode Styles to Button Component

- [x] 7.1 Update `src/components/Button.tsx`:
  - [x] 7.1.1 Primary variant: add `dark:bg-blue-500 dark:hover:bg-blue-600`
  - [x] 7.1.2 Secondary variant: add `dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600`

## 8. Verify and Test

- [x] 8.1 Run `npm run dev` and verify theme toggle works
- [x] 8.2 Toggle to dark mode and verify all elements are styled correctly
- [x] 8.3 Toggle to system mode and change OS preference
- [x] 8.4 Reload the page and verify preference persists and no flash occurs
- [x] 8.5 Test in private/incognito mode (localStorage restrictions)
- [x] 8.6 Test with JavaScript disabled (graceful fallback to light mode)
- [x] 8.7 Run `npm run build` to verify no build errors
- [x] 8.8 Run `npm run lint` to verify no linting errors
