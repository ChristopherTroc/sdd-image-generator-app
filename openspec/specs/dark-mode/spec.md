## ADDED Requirements

### Requirement: Dark mode theme system
The system SHALL support dark mode theme switching with light, dark, and system-preference modes using Tailwind CSS v4's class-based dark variant.

#### Scenario: Dark mode is configured via CSS
- **GIVEN** the project uses Tailwind CSS v4
- **WHEN** the application initializes
- **THEN** the CSS SHALL configure the `dark` variant using class strategy via `@variant dark (&:where(.dark, .dark *))`

#### Scenario: Base styles adapt to dark mode
- **GIVEN** dark mode is active
- **WHEN** the page renders
- **THEN** the background SHALL be a dark color (e.g., `bg-gray-950`) and the text SHALL be a light color (e.g., `text-gray-100`)

### Requirement: Theme state management
The system SHALL provide a React Context-based theme provider to manage and expose theme state across the application.

#### Scenario: ThemeProvider wraps the application
- **GIVEN** the application is rendered
- **WHEN** `ThemeProvider` is added to the root layout
- **THEN** all child components SHALL have access to theme state via `useTheme()` hook

#### Scenario: ThemeProvider exposes current theme and setter
- **GIVEN** the `ThemeProvider` is initialized
- **WHEN** any component calls `useTheme()`
- **THEN** it SHALL receive `{ theme: "light" | "dark" | "system", setTheme: (theme) => void, resolvedTheme: "light" | "dark" }`

### Requirement: System preference detection
The system SHALL detect the user's system color scheme preference using the `prefers-color-scheme` media query.

#### Scenario: System preference is detected on load
- **GIVEN** the user's OS is set to dark mode
- **WHEN** the application loads with `theme` set to `"system"`
- **THEN** the `resolvedTheme` SHALL be `"dark"` and the `dark` class SHALL be applied to the `<html>` element

#### Scenario: System preference changes while app is open
- **GIVEN** the user has theme set to `"system"`
- **WHEN** the OS color scheme changes
- **THEN** the application SHALL update to match the new system preference without page reload

### Requirement: Theme persistence
The system SHALL persist the user's theme preference in `localStorage`.

#### Scenario: Theme preference is saved
- **GIVEN** the user selects a theme
- **WHEN** the theme changes
- **THEN** the preference SHALL be saved to `localStorage` under the key `theme-preference`

#### Scenario: Theme preference is restored on reload
- **GIVEN** a saved theme preference exists in `localStorage`
- **WHEN** the page loads
- **THEN** that preference SHALL be applied before the first paint to prevent flash

### Requirement: Flash prevention
The system SHALL prevent a flash of the wrong theme during page load.

#### Scenario: Inline script applies theme before paint
- **GIVEN** the user has a saved dark mode preference
- **WHEN** the page loads
- **THEN** a synchronous inline script in the `<head>` SHALL read `localStorage` and apply the `dark` class to `<html>` BEFORE the page renders

#### Scenario: No JavaScript fallback
- **GIVEN** JavaScript is disabled
- **WHEN** the page loads
- **THEN** the system default (light) theme SHALL be shown and no errors SHALL occur

### Requirement: Theme toggle component
The system SHALL provide a visual theme toggle component that allows users to switch between light, dark, and system modes.

#### Scenario: Theme toggle renders in layout
- **GIVEN** the application is rendered
- **WHEN** the layout loads
- **THEN** a theme toggle button SHALL be visible in the layout with an icon representing the current theme

#### Scenario: Theme toggle cycles through modes
- **GIVEN** the theme toggle is visible
- **WHEN** the user clicks the toggle
- **THEN** the theme SHALL cycle through `light` → `dark` → `system` → `light`

#### Scenario: Theme toggle icon reflects current mode
- **GIVEN** the current theme is `"light"`
- **WHEN** the toggle renders
- **THEN** it SHALL show a sun icon
- **GIVEN** the current theme is `"dark"`
- **WHEN** the toggle renders
- **THEN** it SHALL show a moon icon
- **GIVEN** the current theme is `"system"`
- **WHEN** the toggle renders
- **THEN** it SHALL show a monitor/device icon

### Requirement: Dark mode styles for existing components
The system SHALL apply appropriate dark mode styles to all existing components and pages.

#### Scenario: Home page adapts to dark mode
- **GIVEN** dark mode is active
- **WHEN** the home page renders
- **THEN** background gradient, text colors, and card backgrounds SHALL use dark mode variants

#### Scenario: Button component adapts to dark mode
- **GIVEN** dark mode is active
- **WHEN** a `Button` component renders
- **THEN** its colors SHALL adapt appropriately (e.g., secondary variant uses dark background)

### Requirement: Smooth theme transitions
The system SHALL apply smooth CSS transitions when switching between themes.

#### Scenario: Theme change animates smoothly
- **GIVEN** the user switches themes
- **WHEN** the `dark` class is toggled on `<html>`
- **THEN** color changes SHALL transition smoothly over ~300ms using `transition-colors`
