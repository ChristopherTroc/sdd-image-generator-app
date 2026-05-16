## ADDED Requirements

### Requirement: Vitest configuration
The system SHALL configure Vitest as the project's test runner with a dedicated configuration file.

#### Scenario: Vitest config exists
- **GIVEN** Vitest is installed
- **WHEN** the project is initialized
- **THEN** a `vitest.config.ts` file SHALL exist with `jsdom` environment and path alias resolution for `@/` → `src/`

#### Scenario: Test files are discovered
- **GIVEN** Vitest is configured
- **WHEN** `npm run test` is executed
- **THEN** Vitest SHALL discover and run all `*.test.ts` and `*.test.tsx` files in the `src/` directory

### Requirement: Test scripts in package.json
The system SHALL provide npm scripts for running tests in various modes.

#### Scenario: Test scripts are defined
- **GIVEN** the project is set up
- **WHEN** checking `package.json` scripts
- **THEN** the following scripts SHALL be defined:
  - `test`: Runs Vitest once
  - `test:watch`: Runs Vitest in watch mode
  - `test:ui`: Opens Vitest UI dashboard
  - `test:coverage`: Runs Vitest with coverage reporting

### Requirement: Test setup file
The system SHALL provide a centralized test setup file with common matchers and mocks.

#### Scenario: Setup file is configured
- **GIVEN** Vitest is configured
- **WHEN** tests are executed
- **THEN** a setup file at `src/tests/setup.ts` SHALL be loaded, importing `@testing-library/jest-dom` for extended DOM matchers

### Requirement: TypeScript path aliases in tests
The system SHALL support TypeScript path aliases (`@/`) in test files.

#### Scenario: Path aliases resolve in tests
- **GIVEN** a test file uses `@/components/Button`
- **WHEN** the test executes
- **THEN** the import SHALL resolve to `src/components/Button.tsx` without errors

### Requirement: Button component tests
The system SHALL provide example tests for the `Button` component covering rendering and behavior.

#### Scenario: Button renders with different variants
- **GIVEN** the `Button` component
- **WHEN** rendered with `variant="primary"`
- **THEN** it SHALL display the children text and have the primary styling classes
- **WHEN** rendered with `variant="secondary"`
- **THEN** it SHALL display the children text and have the secondary styling classes

#### Scenario: Button responds to click events
- **GIVEN** a `Button` component with an `onClick` handler
- **WHEN** the button is clicked
- **THEN** the `onClick` handler SHALL be called once

#### Scenario: Button passes through HTML attributes
- **GIVEN** a `Button` component with `disabled` prop
- **WHEN** rendered
- **THEN** the button element SHALL have the `disabled` attribute

### Requirement: Home page comprehensive test
The system SHALL provide comprehensive tests for the home page covering all rendered sections.

#### Scenario: Home page renders all sections
- **GIVEN** the `Home` component
- **WHEN** rendered
- **THEN** it SHALL display the "Welcome to Next.js" heading, description text, and all three feature cards (TypeScript, Tailwind CSS, ESLint & Prettier)

### Requirement: ThemeToggle component tests
The system SHALL provide comprehensive tests for the `ThemeToggle` component.

#### Scenario: ThemeToggle cycles through modes
- **GIVEN** a `ThemeToggle` component
- **WHEN** rendered with theme set to `"light"`
- **THEN** it SHALL show a sun icon and have aria-label "Switch to dark mode"
- **WHEN** clicked once
- **THEN** it SHALL cycle to `"dark"` theme with moon icon
- **WHEN** clicked again
- **THEN** it SHALL cycle to `"system"` theme with monitor icon

### Requirement: Theme provider tests
The system SHALL provide comprehensive tests for the theme context and provider.

#### Scenario: ThemeProvider wraps children
- **GIVEN** a `ThemeProvider` wrapping a child component
- **WHEN** the child calls `useTheme()`
- **THEN** it SHALL receive `{ theme, resolvedTheme, setTheme }` with correct default values

#### Scenario: setTheme persists to localStorage
- **GIVEN** a `ThemeProvider` with a consumer
- **WHEN** `setTheme("dark")` is called
- **THEN** `localStorage` SHALL contain `theme-preference: "dark"` and the `dark` class SHALL be applied to the document

### Requirement: Environment config tests
The system SHALL provide tests for the environment configuration module.

#### Scenario: Environment variables are validated
- **GIVEN** the `env.ts` module
- **WHEN** environment variables are correctly set
- **THEN** the module SHALL return the parsed values without errors
- **WHEN** required environment variables are missing
- **THEN** the module SHALL throw an appropriate error

### Requirement: ESLint test file configuration
The system SHALL configure ESLint to properly handle test files.

#### Scenario: Test files have appropriate lint rules
- **GIVEN** the ESLint configuration
- **WHEN** linting a test file
- **THEN** test-specific globals (`describe`, `it`, `expect`, `vi`) SHALL be recognized without errors

### Requirement: Coverage threshold enforcement
The system SHALL enforce a minimum 90% test coverage threshold that fails the build if unmet.

#### Scenario: Coverage thresholds are configured
- **GIVEN** Vitest is configured
- **WHEN** `npm run test:coverage` is executed
- **THEN** the coverage thresholds SHALL be set to ≥90% for statements, branches, functions, and lines

#### Scenario: Coverage below threshold fails the run
- **GIVEN** coverage thresholds are configured at 90%
- **WHEN** coverage drops below 90% in any metric
- **THEN** the test run SHALL exit with a non-zero code and report which thresholds were not met

### Requirement: Coverage output ignored
The system SHALL exclude coverage output from version control.

#### Scenario: Coverage directory is gitignored
- **GIVEN** the `.gitignore` file
- **WHEN** checking gitignore patterns
- **THEN** the `coverage/` directory SHALL be listed to prevent committing test coverage reports
