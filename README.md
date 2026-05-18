# AI Image Generator

A modern AI-powered image generation application built with Next.js 16, React 19, and Tailwind CSS v4. Generate stunning images from text descriptions using Hugging Face Inference API, with configurable models, settings, and an intelligent prompt assistant.

The application is deployed on **Vercel** and available at:
[https://sdd-image-generator-app.vercel.app/](https://sdd-image-generator-app.vercel.app/)

## Development Methodology

This project follows **Spec-Driven Development (SDD)** using the [**OpenSpec**](https://openspec.dev/) framework. Every feature goes through a structured lifecycle:

1. **Proposal** — Define why and what needs to change
2. **Specs** — Write detailed behavioral requirements with GIVEN/WHEN/THEN scenarios
3. **Design** — Document technical decisions, architecture, and trade-offs
4. **Tasks** — Break down implementation into trackable checklist items
5. **Implementation** — Apply changes via `/opsx:apply`
6. **Archive** — Sync specs to main directory and archive completed changes

All change artifacts are stored under `openspec/changes/archive/` with synced specifications in `openspec/specs/`.

> **Cost & Time**: The development of this project was assisted by **DeepSeek V4 Flash** (via GitHub Copilot), with approximately **$15 USD aprox** in total AI consumption. The human effort was approximately **1 day (~8 hours aprox)** of work.

## Features

### 🎨 AI Image Generation
- Generate images from detailed text descriptions
- **Models**: Choose between `Stable Diffusion XL Base` (default) and `FLUX.1-schnell` — each with its own dedicated endpoint via `HF_STABLE_DIFFUSION_ENDPOINT` and `HF_FLUX_ENDPOINT` env vars
- **Adjustable settings**: Control model selection, guidance scale, and inference steps for fine-tuned results
- **Generation history**: Browse and re-use previous prompts via a thumbnail grid
- **Click-to-zoom modal**: View generated images in full-screen with download capability
- **Glassmorphism UI**: Modern, polished interface with dark mode support

### ✨ Prompt Assistant
- Built-in AI assistant that suggests creative, detailed image prompts
- Uses **DeepSeek V4 Flash** via Hugging Face router (OpenAI-compatible API)
- Enter a keyword and get 3-5 artistic prompt variations
- Click a suggestion to populate the textarea instantly
- Mobile-responsive: overlay on mobile, dropdown on desktop

### 🌙 Dark Mode
- Light / Dark / System theme modes
- Persists preference in localStorage
- Flash-prevention script before React hydration

## Quick Start

### Prerequisites

- Node.js 18.17 or later (use `nvm use` to select the correct version)
- A Hugging Face account with an API token ([get one here](https://huggingface.co/settings/tokens))

### Setup

1. **Clone and install dependencies:**
   ```bash
   nvm use
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your Hugging Face token:
   ```env
   HUGGINGFACE_API_KEY=hf_your_token_here
   ```

3. **Accept model terms (one-time):**
   - [FLUX.1-schnell](https://huggingface.co/black-forest-labs/FLUX.1-schnell) — fast inference model
   - [Stable Diffusion XL Base](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0) — high-quality model (default)

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) — the image generator is the home page.

## Usage

1. **Write a prompt** in the textarea describing the image you want
2. **Adjust settings** (optional): model (Stable Diffusion XL Base by default), guidance scale, inference steps
3. Click **Generate** and wait for the AI to create your image
4. **Click the image** to open the zoom modal (full-screen view)
5. **Download** the image from the card or the modal
6. **Use the Prompt Assistant** (magic wand icon) to get creative prompt suggestions

## Available Scripts

- **`npm run dev`** — Start the development server with Turbopack hot reload
- **`npm run build`** — Create a production-optimized build
- **`npm run start`** — Run the production build locally
- **`npm run test`** — Run Vitest test suite
- **`npm run test:watch`** — Run tests in watch mode
- **`npm run test:ui`** — Open Vitest UI dashboard
- **`npm run test:coverage`** — Run tests with coverage report (≥90% required)
- **`npm run lint`** — Run ESLint to check code quality
- **`npm run format`** — Format code with Prettier
- **`npm run type-check`** — Run TypeScript type checking

## Project Structure

```
src/
├── app/                       # Next.js App Router
│   ├── layout.tsx            # Root layout with ThemeProvider, ThemeToggle
│   ├── page.tsx              # Home page (AI Image Generator)
│   ├── globals.css           # Global styles + Tailwind config
│   ├── page.test.tsx         # Home page tests
│   └── api/
│       ├── generate-image/   # POST /api/generate-image (Hugging Face image gen)
│       └── generate-prompts/ # POST /api/generate-prompts (DeepSeek prompt gen)
├── components/               # Reusable React components
│   ├── ImageGenerator.tsx    # Main image generation component with settings
│   ├── PromptAssistant.tsx   # AI prompt suggestion assistant
│   ├── GenerationHistory.tsx # Thumbnail grid of past generations
│   ├── ThemeToggle.tsx       # Light/dark/system mode toggle
│   ├── Button.tsx            # Reusable styled button
│   └── *.test.tsx            # Component tests
├── hooks/                    # Custom React hooks
│   ├── useImageGeneration.ts # Generation logic with 503 retry & timer management
│   └── useImageGeneration.test.ts
├── lib/                      # Utility functions and helpers
│   ├── huggingface.ts        # Hugging Face Inference API for image generation
│   ├── llm.ts                # LLM client (DeepSeek via OpenAI SDK) for prompts
│   ├── env.ts                # Type-safe environment variable access
│   ├── theme.tsx             # Theme context provider
│   └── *.test.ts             # Utility tests
├── types/                    # TypeScript type definitions
└── tests/
    └── setup.ts              # Vitest test setup with jest-dom matchers
```

## Technology Stack

### Core
- **Next.js 16** — React framework with App Router, Turbopack, and API routes
- **React 19** — Modern UI library with server components
- **TypeScript** — Type-safe JavaScript with strict mode enabled

### Styling
- **Tailwind CSS v4** — Utility-first CSS with dark variant support
- **CSS custom utilities** — Shimmer animation, glassmorphism effects

### AI Integration
- **Hugging Face Inference API** — Text-to-image generation (Stable Diffusion XL Base + FLUX.1-schnell)
- **DeepSeek V4 Flash** — LLM-powered prompt suggestions via OpenAI SDK

### Testing
- **Vitest** — Fast unit test runner with Vite integration
- **React Testing Library** — Component testing with user-event simulation
- **Testing Library Jest DOM** — Extended DOM matchers for assertions

### Development Tools
- **ESLint** — Code linting with Next.js recommended rules
- **Prettier** — Code formatter for consistent style
- **Husky** — Git hooks for pre-commit checks
- **lint-staged** — Run linters on staged files only

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `HUGGINGFACE_API_KEY` | Yes | — | Hugging Face API token for inference |
| `HF_FLUX_ENDPOINT` | No | — | Custom endpoint for FLUX.1-schnell private inference instance |
| `HF_STABLE_DIFFUSION_ENDPOINT` | No | — | Custom endpoint for Stable Diffusion XL Base private inference instance |
| `NEXT_PUBLIC_API_URL` | No | `http://localhost:3000/api` | API base URL for client requests |

Copy `.env.example` to `.env.local` and fill in the required values.

## Code Quality

### ESLint

ESLint is configured with `next/core-web-vitals` rules:
```bash
npm run lint
```

### Prettier

```bash
npm run format
```

### Pre-commit Hooks

Husky automatically runs ESLint and Prettier on staged files before each commit.

### Type Checking

```bash
npm run type-check
```

### Test Coverage

Tests enforce ≥90% coverage for statements, branches, functions, and lines:
```bash
npm run test:coverage
```

## Development Methodology

This project follows **Spec-Driven Development (SDD)** using the **OpenSpec** framework. Every feature goes through a structured lifecycle:

1. **Proposal** — Define why and what needs to change
2. **Specs** — Write detailed behavioral requirements with GIVEN/WHEN/THEN scenarios
3. **Design** — Document technical decisions, architecture, and trade-offs
4. **Tasks** — Break down implementation into trackable checklist items
5. **Implementation** — Apply changes via `/opsx:apply`
6. **Archive** — Sync specs to main directory and archive completed changes

All change artifacts are stored under `openspec/changes/archive/` with synced specifications in `openspec/specs/`.

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
