## Context

The project uses Tailwind CSS v4, which supports the `dark` variant out of the box. In Tailwind v4, dark mode defaults to the `media` strategy (based on `prefers-color-scheme`), but can be switched to `class` strategy by adding `@variant dark (&:where(.dark, .dark *))` to the CSS. The `class` strategy gives us programmatic control over the theme, which is essential for a user-toggleable dark mode with persistence.

React 19 and Next.js App Router provide the foundation for a provider-based theme system using React Context.

## Goals / Non-Goals

**Goals:**
- Implement a dark mode theme system with light, dark, and system modes
- Detect and respect system `prefers-color-scheme` on initial load
- Persist user's chosen theme preference in `localStorage`
- Add a theme toggle component (e.g., sun/moon icons) in the layout
- Apply dark mode styles to all existing components (`page.tsx`, `Button.tsx`)
- Add smooth CSS transitions when switching themes
- Ensure WCAG AA contrast compliance in both themes

**Non-Goals:**
- Creating multiple custom themes (only light and dark)
- Server-side theme detection (client-only for simplicity)
- CSS variable-based theming (Tailwind dark variant is sufficient)
- Animation or transition beyond basic color transitions

## Decisions

**1. Tailwind `class` Strategy over `media` Strategy**
- **Decision**: Use Tailwind's `class`-based dark mode strategy with `@variant dark (&:where(.dark, .dark *))` in `globals.css`
- **Rationale**: The `class` strategy allows programmatic toggling and persistence, which is required for user-controlled theme switching. Users may prefer dark mode even when their system is set to light, or vice versa.
- **Alternatives Considered**: `media` strategy (no programmatic control), CSS custom properties (more complex, not needed with Tailwind v4)

**2. React Context for Theme State**
- **Decision**: Create a `ThemeProvider` using React Context to manage theme state across the application
- **Rationale**: Lightweight, no external dependencies, works seamlessly with Next.js App Router, and provides global access to theme state and toggle functions
- **Alternatives Considered**: Zustand (overkill for this), Redux (unnecessary), CSS-only (no persistence or dynamic toggle)

**3. localStorage for Persistence**
- **Decision**: Store theme preference in `localStorage` with key `theme-preference` and values `"light"`, `"dark"`, or `"system"`
- **Rationale**: Simple, synchronous read on page load prevents flash of wrong theme. `"system"` as default respects user's OS setting.
- **Alternatives Considered**: Cookies (server-side need not required), IndexedDB (overkill)

**4. Inline Script in `<head>` for Flash Prevention**
- **Decision**: Add a small inline script in the `<head>` of `layout.tsx` to read `localStorage` and apply the `dark` class before React hydrates
- **Rationale**: Prevents the "flash of wrong theme" (FART) that occurs when React hydrates and applies the correct theme after the page has already rendered
- **Alternatives Considered**: Next.js cookies + middleware (more complex), `next-themes` library (external dependency)

**5. Dark Mode Color Palette**
- **Decision**: Dark mode background `bg-gray-950` or `bg-gray-900`, text `text-gray-100` or `text-gray-200`, cards `bg-gray-800`, borders `border-gray-700`
- **Rationale**: Matches modern dark mode conventions, provides sufficient contrast, follows Tailwind's recommended dark palette

## Risks / Trade-offs

**[Flash of Wrong Theme]** → Mitigated by inline script in `<head>` that applies class before paint.

**[localStorage Unavailable]** → Gracefully fall back to system preference by defaulting to `"system"` mode; `localStorage` read is wrapped in try-catch.

**[SSR/SSG Mismatch]** → Theme context uses `"system"` as default during SSR to match server-rendered output with client hydration. The inline script adjusts before hydration.

**[Accessibility Compliance]** → Verify color contrast ratios meet WCAG AA standards in both themes using Tailwind's built-in color contrast.

## Migration Plan

**Phase 1: Theme Infrastructure**
- Add Tailwind dark variant configuration in `globals.css`
- Create `ThemeProvider` context with state management
- Implement theme persistence with `localStorage`
- Add flash-prevention inline script in `layout.tsx`

**Phase 2: Theme Toggle UI**
- Create `ThemeToggle` component with sun/moon icons
- Add toggle to the root layout
- Style toggle for both themes

**Phase 3: Apply Dark Mode Styles**
- Update `page.tsx` with dark variant classes
- Update `Button.tsx` with dark variant classes
- Update `globals.css` base styles with dark mode overrides

**Phase 4: Polish & Testing**
- Add smooth CSS transitions for theme switching
- Test system preference detection
- Test persistence across page reloads
- Verify no flash of wrong theme

## Open Questions

- Should the theme toggle be placed in a header/navbar (to be built later) or directly in the layout for now?
- Do we want a dedicated `<header>` component as part of this change or keep it minimal?
