## Why

Adding dark mode support improves user experience by respecting system preferences and reducing eye strain in low-light environments. Dark mode is now an expected feature in modern web applications, and implementing it early in the project lifecycle avoids costly retrofitting later. This enhances accessibility and gives users control over their viewing experience.

## What Changes

- Implement a dark mode theme system using Tailwind CSS v4 dark variant support
- Add a theme toggle component (light / dark / system) to the application
- Integrate system preference detection via `prefers-color-scheme` media query
- Persist user theme preference in `localStorage`
- Apply dark mode styles to all existing components and pages
- Add a smooth transition when switching themes
- Ensure proper color contrast in both light and dark themes for accessibility

## Capabilities

### New Capabilities
- `dark-mode`: Full dark mode support with theme toggle, system preference detection, and persistence

### Modified Capabilities
<!-- No existing capabilities being modified -->

## Impact

- **Code**: Updates to `layout.tsx`, `globals.css`, `page.tsx`, and `Button.tsx`; new theme provider context and toggle component
- **APIs**: No API changes
- **Dependencies**: No new external dependencies — leverages Tailwind CSS v4 built-in dark variant and React Context
- **Systems**: Theme preference stored in `localStorage`, respects system `prefers-color-scheme` media query
