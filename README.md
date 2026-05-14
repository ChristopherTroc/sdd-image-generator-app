# Next.js SDD App

A modern, production-ready Next.js application built with TypeScript, Tailwind CSS, and industry best practices.

## Quick Start

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Setup

1. **Use the correct Node.js version:**
   ```bash
   nvm use
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- **`npm run dev`** - Start the development server with hot reload
- **`npm run build`** - Create a production-optimized build
- **`npm run start`** - Run the production build locally
- **`npm run lint`** - Run ESLint to check code quality
- **`npm run format`** - Format code with Prettier
- **`npm run type-check`** - Run TypeScript type checking

## Project Structure

```
src/
├── app/                    # Next.js app directory with routes
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   └── Button.tsx         # Example styled button component
├── lib/                   # Utility functions and helpers
│   └── env.ts            # Environment variable definitions
└── types/                 # TypeScript type definitions
```

## Technology Stack

### Core
- **Next.js 15+** - React framework with server-side rendering, static generation, and API routes
- **React 19** - Modern UI library
- **TypeScript** - Type-safe JavaScript with strict mode enabled

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS transformation tool with Autoprefixer

### Development Tools
- **ESLint** - Code linting with Next.js recommended rules
- **Prettier** - Code formatter for consistent style
- **Husky** - Git hooks for pre-commit checks
- **lint-staged** - Run linters on staged files only

## Code Quality

### ESLint

ESLint is configured with `next/core-web-vitals` rules to catch common issues early. Run the linter:

```bash
npm run lint
```

### Prettier

Prettier ensures consistent code formatting. Configure preferences in `.prettierrc.json`. Format files:

```bash
npm run format
```

### Pre-commit Hooks

Husky automatically runs ESLint and Prettier on staged files before each commit. This prevents formatting issues and common bugs from entering the repository.

### Type Checking

TypeScript with strict mode enabled provides compile-time type safety:

```bash
npm run type-check
```

## Environment Variables

Environment variables are managed with `.env` files:

- **`.env.local`** - Local development variables (gitignored)
- **`.env.development`** - Development-specific configuration
- **`.env.production.example`** - Template for production variables

Public variables must be prefixed with `NEXT_PUBLIC_`. Access environment variables with type safety using `src/lib/env.ts`.

### Example

```typescript
import { env } from "@/lib/env";

// Type-safe access to environment variables
const apiUrl = env.NEXT_PUBLIC_API_URL;
```

## TypeScript Path Aliases

Import paths are configured for cleaner imports:

```typescript
// Instead of: import Button from '../../../components/Button'
import { Button } from "@/components/Button";
```

Configure additional paths in `tsconfig.json` under `compilerOptions.paths`.

## Styling with Tailwind CSS

Tailwind CSS is configured for utility-first development. Use Tailwind classes directly in JSX:

```typescript
export function Card() {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold">Card Title</h2>
      <p className="text-gray-600">Card content</p>
    </div>
  );
}
```

See [Tailwind Documentation](https://tailwindcss.com/docs) for available utilities.

## Development Workflow

1. **Create a new component:**
   ```bash
   # Create component file in src/components/
   # Use TypeScript for type safety
   ```

2. **Run linting and formatting:**
   ```bash
   npm run lint
   npm run format
   ```

3. **Type-check before committing:**
   ```bash
   npm run type-check
   ```

4. **Commit code:**
   ```bash
   # Husky will automatically run pre-commit checks
   git add .
   git commit -m "feat: add new feature"
   ```

## Build for Production

```bash
npm run build
npm run start
```

The production build optimizes performance and generates static pages where possible.

## Troubleshooting

### Port 3000 Already in Use

Use a different port:

```bash
npm run dev -- -p 3001
```

### TypeScript Errors

Ensure strict mode is enforced in `tsconfig.json` and all values are properly typed.

### ESLint Errors

Run `npm run lint` to see all issues, then `npm run format` to auto-fix what's possible. Review remaining errors and fix manually.

### Environment Variables Not Loading

Verify `.env.local` exists in the project root and contains required `NEXT_PUBLIC_*` variables.

## Further Reading

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [ESLint Documentation](https://eslint.org/docs/)

## License

ISC
