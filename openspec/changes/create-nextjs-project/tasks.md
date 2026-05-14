## 1. Project Initialization

- [ ] 1.1 Run `npx create-next-app@latest . --typescript --tailwind --eslint` with recommended defaults
- [ ] 1.2 Verify Next.js and React dependencies are version 15+
- [ ] 1.3 Verify TypeScript is configured with strict mode
- [ ] 1.4 Create `src/` directory structure with `app/`, `components/`, `lib/`, and `types/` subdirectories
- [ ] 1.5 Move app directory contents from root to `src/app/`
- [ ] 1.6 Update `tsconfig.json` baseUrl and paths to reflect src directory structure

## 2. Code Quality Setup

- [ ] 2.1 Install Prettier: `npm install --save-dev prettier`
- [ ] 2.2 Create `.prettierrc.json` with 2-space indentation, trailing commas, and semicolons
- [ ] 2.3 Create `.prettierignore` excluding node_modules, .next, and build directories
- [ ] 2.4 Update ESLint configuration to extend `next/core-web-vitals`
- [ ] 2.5 Install Husky: `npx husky-init && npm install`
- [ ] 2.6 Install lint-staged: `npm install --save-dev lint-staged`
- [ ] 2.7 Create `.husky/pre-commit` hook to run lint-staged
- [ ] 2.8 Create `.lintstagedrc.json` to run ESLint and Prettier on staged files
- [ ] 2.9 Create `.nvmrc` file specifying Node 18.17 or later

## 3. Styling Configuration

- [ ] 3.1 Verify Tailwind CSS configuration in `tailwind.config.ts` with src content paths
- [ ] 3.2 Verify PostCSS configuration in `postcss.config.js`
- [ ] 3.3 Create `src/globals.css` with Tailwind directives (@tailwind, @layer)
- [ ] 3.4 Import globals.css in root layout
- [ ] 3.5 Create example styled component to demonstrate Tailwind usage
- [ ] 3.6 Test Tailwind tree-shaking by checking unused styles don't appear in build

## 4. Environment Configuration

- [ ] 4.1 Create `.env.local` template with example variables
- [ ] 4.2 Create `.env.development` for development-specific configuration
- [ ] 4.3 Create `.env.production.example` for production environment reference
- [ ] 4.4 Add `.env*.local` to `.gitignore` to prevent committing secrets
- [ ] 4.5 Create `src/lib/env.ts` with environment variable type definitions
- [ ] 4.6 Add environment variable validation to startup (optional but recommended)

## 5. Development Tools & Scripts

- [ ] 5.1 Verify `package.json` has scripts: dev, build, start, lint, format, type-check
- [ ] 5.2 Test `npm run dev` starts development server on localhost:3000
- [ ] 5.3 Test `npm run build` completes without errors
- [ ] 5.4 Test `npm run lint` runs ESLint checks
- [ ] 5.5 Test `npm run format` runs Prettier
- [ ] 5.6 Test `npm run type-check` runs TypeScript type checking

## 6. Documentation & Git Setup

- [ ] 6.1 Create comprehensive `README.md` with project overview
- [ ] 6.2 Add setup instructions in README (nvm use, npm install, npm run dev)
- [ ] 6.3 Document project structure and naming conventions
- [ ] 6.4 Create `.gitignore` with Next.js specific patterns
- [ ] 6.5 Initialize Git repository with initial commit
- [ ] 6.6 Create CONTRIBUTING.md with development guidelines
- [ ] 6.7 Add TypeScript path aliases documentation

## 7. Verification & Testing

- [ ] 7.1 Run full lint and type-check on codebase
- [ ] 7.2 Build project and verify output size is reasonable
- [ ] 7.3 Start dev server and verify homepage renders correctly
- [ ] 7.4 Test pre-commit hook by making intentional lint violation
- [ ] 7.5 Verify environment variables load correctly in dev and build
- [ ] 7.6 Test that ESLint catches a sample error
