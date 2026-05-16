## 0. Install Dependency

- [x] 0.1 Install `@huggingface/inference` npm package

## 1. Image Generation Module (Hugging Face)

- [x] 1.1 Rewrite `src/lib/huggingface.ts` — use `HfInference` from `@huggingface/inference` SDK to call `textToImage()` with configurable model and parameters (guidance_scale, num_inference_steps). **CRITICAL**: `textToImage()` returns a `Blob` at runtime (despite TS types). Must convert via `blob.arrayBuffer()` → `Uint8Array` → `btoa()` → data URL.
- [x] 1.2 Rewrite `src/lib/huggingface.test.ts` — 7 tests (valid prompt returns data URL, correct SDK params, empty prompt throws, whitespace throws, missing key throws, API error, SDK returns Blob-like binary string)

## 2. Image Generation API Route

- [x] 2.1 Rewrite `src/app/api/generate-image/route.ts` — validates prompt, accepts optional model/guidance_scale params, calls Hugging Face SDK, converts Blob to base64, returns with ID

## 3. Environment Configuration

- [x] 3.1 Add `HUGGINGFACE_API_KEY` to `.env.example`
- [x] 3.2 Add `HUGGINGFACE_API_KEY` validation to `src/lib/env.ts`
- [x] 3.3 Document how to get a free Hugging Face API key

## 4. Create ImageGenerator Component (Modern UI)

- [x] 4.1 Create `src/components/ImageGenerator.tsx` with:
  - [x] 4.1.1 "use client" directive
  - [x] 4.1.2 **Textarea** prompt input with placeholder (supports multi-line, scrollable for long descriptions)
  - [x] 4.1.3 "Generate" button with glassmorphism styling
  - [x] 4.1.4 Loading state with shimmer skeleton animation
  - [x] 4.1.5 Success state with image inside glassmorphism card + download button
  - [x] 4.1.6 **Click-to-zoom modal**: full-height image (max 90vh), close via X button or clicking outside backdrop, download button inside modal
  - [x] 4.1.7 Error state with "Try Again" button
  - [x] 4.1.8 **Glassmorphism UI**: backdrop blur, semi-transparent backgrounds, subtle shadows, smooth transitions
  - [x] 4.1.9 Dark mode support for all glassmorphism styles
  - [x] 4.1.10 `onGeneration` callback prop
  - [x] 4.1.11 Custom event listener for history prompt selection
  - [x] 4.1.12 **Settings panel**: collapsible with model selector dropdown (FLUX.1-dev / SD3.5-large)
  - [x] 4.1.13 **Guidance scale**: range slider (1-20, default 7.5) with numeric display
  - [x] 4.1.14 **Inference Steps**: range slider (10-50, default 30) — controls generation quality (more steps = higher quality)
  - [x] 4.1.15 Settings sent as part of POST body alongside prompt (model, guidance_scale, num_inference_steps)
  - [x] 4.1.16 Settings panel dark mode support

## 5. Create GenerationHistory Component

- [x] 5.1 Create `src/components/GenerationHistory.tsx` with:
  - [x] 5.1.1 "use client" directive
  - [x] 5.1.2 Props for generations and onSelectPrompt
  - [x] 5.1.3 Thumbnail grid with prompt labels
  - [x] 5.1.4 Click handler to re-use prompts
  - [x] 5.1.5 Empty state message
  - [x] 5.1.6 Dark mode support

## 6. Create Generate Page

- [x] 6.1 Create `src/app/generate/page.tsx` composing `ImageGenerator` + `GenerationHistory`

## 7. Add Navigation Link

- [x] 7.1 Add "Generate" link in `layout.tsx` header next to theme toggle

## 7b. Fix Flash Prevention for React 19 Compatibility

- [x] 7b.1 Replace raw `<script>` tag in `layout.tsx` with `next/script` component using `strategy="beforeInteractive"`
- [x] 7b.2 Import `Script` from `next/script` and use `<Script id="theme-flash-prevention" strategy="beforeInteractive">` pattern
- [x] 7b.3 Verify `<html>` element has `suppressHydrationWarning` attribute to prevent hydration mismatch
- [x] 7b.4 Run `npm run dev` and confirm no script-related console warnings or hydration errors in development mode

## 8. Write Tests

- [x] 8.1 Write tests for `src/lib/huggingface.ts` (see section 1.2 for detailed test list)
- [x] 8.2 Write tests for `src/components/ImageGenerator.tsx`:
  - [x] 8.2.1 Renders textarea prompt input
  - [x] 8.2.2 Textarea supports multi-line input
  - [x] 8.2.3 Generate button disabled while loading
  - [x] 8.2.4 Loading state shows shimmer skeleton
  - [x] 8.2.5 Success state shows image with download button
  - [x] 8.2.6 Glassmorphism styles applied to card
  - [x] 8.2.7 Clicking image opens zoom modal
  - [x] 8.2.8 Zoom modal closes on X button click
  - [x] 8.2.9 Zoom modal closes on backdrop click
  - [x] 8.2.10 Zoom modal shows download button
  - [x] 8.2.11 Error state shows "Try Again" button
  - [x] 8.2.12 Enter key triggers generation
  - [x] 8.2.13 Custom callback is called on generation
  - [x] 8.2.14 Dark mode support
  - [x] 8.2.15 Escape key closes modal
  - [x] 8.2.16 Renders settings panel collapsed by default
  - [x] 8.2.17 Model selector switches between FLUX.1-dev and SD3.5-large
  - [x] 8.2.18 Guidance scale slider adjusts value
  - [x] 8.2.19 Inference steps slider adjusts quality value
  - [x] 8.2.20 Settings included in POST request body (model, guidance_scale, num_inference_steps)
- [x] 8.3 Write 4 tests for `src/components/GenerationHistory.tsx` (empty state, renders items, images, click handler)
- [x] 8.4 Write tests for `src/app/api/generate-image/route.ts` (missing/empty prompt, success with defaults, custom model, custom parameters, API key error, API error)
- [x] 8.5 Write 4 tests for `src/app/generate/page.tsx` (title, input, empty history, generation+history)

## 9. Verify and Test

- [x] 9.1 Install `@huggingface/inference` and run `npm run dev` to verify image generation works end-to-end
- [x] 9.2 Run `npm run test` and verify all tests pass
- [x] 9.3 Run `npm run test:coverage` and verify ≥90% coverage
- [x] 9.4 Run `npm run build` and verify no build errors
- [x] 9.5 Run `npm run lint` and verify no linting errors
- [x] 9.6 Run `npm run type-check` and verify no type errors
