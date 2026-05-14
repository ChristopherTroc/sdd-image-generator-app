## Context

This project establishes the foundational structure for a modern Next.js application. The Next.js ecosystem has evolved significantly with App Router becoming the standard, TypeScript providing type safety by default, and tooling like Turbopack improving build performance. We're building a greenfield project that will serve as the baseline for multiple capabilities (code quality, styling, environment management).

## Goals / Non-Goals

**Goals:**
- Establish a production-ready Next.js 15+ project structure with TypeScript
- Configure automated code quality and formatting tools
- Implement Tailwind CSS for consistent styling
- Set up proper development environment configuration
- Create a foundation that supports team collaboration with Git hooks and workflows

**Non-Goals:**
- Building specific business features or domain logic
- Creating comprehensive test suite (will be added separately)
- Deploying to production environment
- Setting up CI/CD pipelines (beyond local hooks)
- Database schema or ORM setup

## Decisions

**1. Next.js App Router over Pages Router**
- **Decision**: Use Next.js App Router with TypeScript
- **Rationale**: App Router is the future standard with better layouts, easier data fetching, and improved performance. TypeScript catches errors early and improves maintainability.
- **Alternatives Considered**: Pages Router (legacy), other frameworks (Remix, Astro) - but Next.js is industry standard with largest ecosystem.

**2. Tailwind CSS for Styling**
- **Decision**: Integrate Tailwind CSS with PostCSS configuration
- **Rationale**: Utility-first approach scales well, reduces custom CSS, provides consistency, and integrates seamlessly with Next.js. Tree-shaking removes unused styles automatically.
- **Alternatives Considered**: CSS Modules, styled-components, vanilla CSS - Tailwind offers best balance of productivity and performance.

**3. ESLint + Prettier for Code Quality**
- **Decision**: ESLint for linting (with Next.js config), Prettier for formatting, integrated pre-commit hooks
- **Rationale**: Industry standard, catches bugs early, enforces consistent style automatically. Pre-commit hooks prevent bad code from entering repository.
- **Alternatives Considered**: Biome (good but less ecosystem support), manual code review only - current approach automates enforcement.

**4. Environment Variables with .env.local**
- **Decision**: Use Next.js .env.local, .env.development, .env.production pattern with validation
- **Rationale**: Built-in Next.js support, clear separation of environments, prevents accidental exposure of secrets.
- **Alternatives Considered**: dotenv library, environment files at root - Next.js approach is cleaner and more secure.

**5. Project Structure with src/ Directory**
- **Decision**: Organize with `src/app`, `src/components`, `src/lib`, `src/types`
- **Rationale**: Clear separation of concerns, scales well as project grows, makes imports cleaner, easier refactoring.
- **Alternatives Considered**: Flat structure - organized approach prevents path madness and improves discoverability.

## Risks / Trade-offs

**[Tailwind CSS File Size]** → Tree-shaking and production builds handle this well. Minimal impact in practice due to CSS minification.

**[ESLint Strictness]** → Initial setup may feel restrictive. Mitigate by having standard config that teams can adjust; rules can be relaxed gradually.

**[Node Version Dependency]** → Next.js 15 requires Node 18+. Mitigate by documenting in README and using `.nvmrc` file.

**[Development vs Production Differences]** → Environment-specific behavior could mask issues. Mitigate by testing in production-like environments before deployment.

## Migration Plan

**Phase 1: Initial Setup**
- Create Next.js project with create-next-app
- Install and configure Tailwind CSS
- Set up TypeScript strict mode

**Phase 2: Tooling**
- Configure ESLint with next/core-web-vitals
- Install and configure Prettier
- Create .prettierignore and .eslintignore

**Phase 3: Project Structure**
- Organize directories (src/app, src/components, src/lib)
- Create base layout and page structure
- Set up example component structure

**Phase 4: Development Environment**
- Configure environment files (.env.local, .env.development)
- Set up Husky for pre-commit hooks
- Create lint-staged configuration

**Phase 5: Documentation**
- Create README with setup instructions
- Document naming conventions and structure
- Add contribution guidelines

## Open Questions

- Should we include testing framework setup (Jest/Vitest) in this phase or separate change?
- Do we want Storybook for component documentation?
- Should we add authentication scaffolding or keep it for separate capability?
