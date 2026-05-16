## ADDED Requirements

### Requirement: Environment variable configuration
The system SHALL load environment variables from .env.local (development) and .env.production files with validation on application start.

#### Scenario: Environment variables are loaded
- **WHEN** the application starts
- **THEN** environment variables are loaded from the appropriate .env file based on NODE_ENV

### Requirement: Public vs private environment variables
The system SHALL distinguish between public (NEXT_PUBLIC_*) and private environment variables, ensuring only public variables are exposed to the browser.

#### Scenario: Public variables are accessible in browser
- **WHEN** client-side code attempts to access NEXT_PUBLIC_API_URL
- **THEN** the variable is available and populated from environment

### Requirement: Type-safe environment access
The system SHALL provide TypeScript types for environment variables to catch missing or invalid environment vars at compile time.

#### Scenario: Environment variables have type safety
- **WHEN** accessing environment variables
- **THEN** TypeScript provides intellisense and type checking for available variables
