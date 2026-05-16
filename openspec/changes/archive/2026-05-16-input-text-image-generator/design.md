## Context

The project is a Next.js 16 application with App Router, React 19, TypeScript, and Tailwind CSS v4. It already has dark mode support, Vitest testing, and a theme toggle. This change adds a text-to-image generator page using Hugging Face Inference API with a modern, polished UI.

Hugging Face provides a free Inference API with generous rate limits — you just need a free account token (`HUGGINGFACE_API_KEY`). The API returns raw image binary data that can be served directly or converted to base64.

## Goals / Non-Goals

**Goals:**
- Create a `/generate` page with a **textarea prompt** for detailed descriptions and image display
- Integrate Hugging Face Inference API for AI image generation
- Provide a **model selector** between `FLUX.1-dev` and `SD3.5-large`
- Provide a **settings panel** with controls for **guidance_scale**, **num_inference_steps**
- Display generated images with a **click-to-zoom modal** that fills the screen height
- Add image download capability from both card and zoomed view
- Apply **modern glassmorphism UI** with smooth animations and responsive design
- Add loading state with skeleton/spinner during generation
- Store generation history in-memory for the current session with thumbnail grid
- Support dark mode throughout
- Write tests with ≥90% coverage

**Non-Goals:**
- User authentication (anonymous usage for MVP)
- Image editing or inpainting (generation only)
- Persistent gallery (database — future feature)
- Multiple model selection in UI

## Decisions

**1. Hugging Face Inference API over Other Image APIs**
- **Decision**: Use Hugging Face Inference API with a free account — requires a `HUGGINGFACE_API_KEY` environment variable
- **Rationale**: Free tier with generous rate limits, no credit card required, access to state-of-the-art models like `black-forest-labs/FLUX.1-dev` or `stabilityai/stable-diffusion-3.5-large`
- **Alternatives Considered**: Pollinations.ai (free, no key — lower quality), Replicate (paid), DALL-E (paid)

**2. Configurable Model Selection**
- **Decision**: Allow users to switch between `black-forest-labs/FLUX.1-dev` (default, open weights) and `stabilityai/stable-diffusion-3.5-large` (higher quality, requires Pro subscription)
- **Rationale**: FLUX.1-dev works for all users with no subscription needed. SD3.5-large offers superior quality for Pro subscribers who have accepted the model terms. A dropdown selector lets users choose based on their subscription and quality needs.
- **Alternatives Considered**: Single fixed model (limits flexibility), auto-detection (unreliable), too many models (confusing)

**3. Official SDK over raw fetch**
- **Decision**: Use the `@huggingface/inference` npm package instead of raw `fetch` for API calls
- **Rationale**: Next.js 16 with Turbopack intercepts server-side `fetch` calls via its patched fetch implementation, which can incorrectly resolve absolute Hugging Face API URLs as relative Next.js routes — causing `Cannot POST /models/black-forest-labs/FLUX.2-dev` errors. The official `@huggingface/inference` SDK uses its own HTTP client (`undici`/`node-fetch` under the hood), bypassing Next.js's fetch interception entirely.
- **Alternatives Considered**: Raw `fetch` (causes URL resolution issues with Next.js fetch patching), `node-fetch` package (manual, more boilerplate), axios (extra dependency, no Hugging Face specific features)
- **Migration**: Install `@huggingface/inference`, then replace the raw `fetch` call with `HfInference.textToImage()` which returns a `Blob`
- **⚠️ Critical implementation detail**: Despite TypeScript type declarations showing `string`, the `textToImage()` method returns a `Blob` at runtime. The conversion pipeline must be: `Blob → arrayBuffer() → Uint8Array → base64 → data URL`. Using `TextEncoder.encode()` on the raw result will produce the literal string `"[object Blob]"` instead of the actual image bytes, resulting in a broken data URL.

**4. Flash Prevention via next/script for React 19 Compatibility**
- **Decision**: Use `next/script` with `strategy="beforeInteractive"` instead of a raw `<script>` tag with `dangerouslySetInnerHTML` for the dark mode flash prevention script in `layout.tsx`
- **Rationale**: React 19 (used by Next.js 16) throws a hydration error and a console warning when encountering `<script>` tags rendered inside React components via `dangerouslySetInnerHTML`. The script never executes on the client because React blocks it. `next/script` with `beforeInteractive` is the official Next.js way to inject inline scripts that run before hydration, fully compatible with React 19.
- **Implementation**: Replace `<script dangerouslySetInnerHTML={{ __html: '...' }} />` with:
  ```tsx
  import Script from "next/script";
  
  // In the component:
  <Script id="theme-flash-prevention" strategy="beforeInteractive">
    {`(function() {
      try {
        var theme = localStorage.getItem("theme-preference");
        if (theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
          document.documentElement.classList.add("dark");
        }
      } catch(e) {}
    })();`}
  </Script>
  ```
- **Additional fix**: Ensure `<html lang="en" suppressHydrationWarning>` is set to prevent hydration mismatch when the script adds the `dark` class before React hydrates
- **Alternatives Considered**: Raw `<script>` tag (causes hydration errors in React 19), inline template tag (Next.js doesn't support it in layout), CSS-only approach (can't read localStorage before paint)

**4. Dedicated /generate Page**
- **Decision**: Create a new route at `/generate` with the full generator experience
- **Rationale**: Keeps the home page clean; dedicated space for prompt input, image display, and history
- **Alternatives Considered**: Modal/overlay on home page (cramped), sidebar panel (limited space for image)

**4. In-Memory History**
- **Decision**: Store generation history in a React state array (prompt, image URL, timestamp)
- **Rationale**: Simple, no persistence needed for MVP, survives page navigation within SPA
- **Alternatives Considered**: localStorage (persists across sessions but limited size), database (overkill for MVP)

**5. Textarea over Single-Line Input**
- **Decision**: Use a `<textarea>` element instead of `<input type="text">` for the prompt
- **Rationale**: Allows users to write longer, more detailed prompts that produce better images. Models benefit significantly from detailed descriptions. The textarea auto-resizes or shows a fixed number of rows with scroll.
- **Alternatives Considered**: `<input>` (too limiting for detailed prompts), rich text editor (overkill for plain text prompts)

**6. Zoom Modal for Image Viewing**
- **Decision**: Implement a click-to-zoom modal that displays the image at full height (max 90vh) with a backdrop overlay and close button
- **Rationale**: Provides a focused viewing experience for generated images. The modal centers the image, allows closing via X button or clicking outside, and includes a download button for convenience.
- **Alternatives Considered**: Inline expansion (takes too much space), new page (breaks flow), lightbox library (extra dependency)

**7. Modern Glassmorphism UI**
- **Decision**: Apply a polished modern UI with glassmorphism effects (backdrop blur, semi-transparent backgrounds), smooth transitions, subtle shadows, and responsive spacing
- **Rationale**: Creates a premium, engaging user experience that feels contemporary. Glassmorphism works well with the AI/creative nature of the feature.
- **Elements**: Input area with glass effect, result card with subtle shadow and border, loading skeleton with shimmer animation, zoom modal with dark backdrop blur
- **Alternatives Considered**: Minimalist flat design (too basic for a creative tool), neubrutalism (doesn't fit app aesthetic)

**8. Settings Panel for Generation Parameters**
- **Decision**: Add a collapsible settings panel below the prompt textarea with controls for model selection, guidance_scale, and num_inference_steps
- **Rationale**: Gives users control over image generation quality. Note: `width` and `height` are intentionally excluded because the Hugging Face Inference API's text-to-image endpoint does not support resolution overrides; models always generate at their native resolution. `num_inference_steps` is a supported parameter that controls generation quality (more steps = higher quality but slower).
- **UI Elements**:
  - **Model selector**: Dropdown with `black-forest-labs/FLUX.1-dev` (default) and `stabilityai/stable-diffusion-3.5-large`
  - **Guidance Scale**: Range slider with numeric display (1-20, default 7.5)
  - **Inference Steps**: Range slider or select (10-50, default 30 — more steps = higher quality)
- **Data flow**: Settings sent to the API route as part of the POST body alongside the prompt
- **Alternatives Considered**: Fixed parameters (no user control), always-visible panel (too cluttered), separate settings page (breaks flow)

## Risks / Trade-offs

**[React 19 Script Restrictions]** → React 19 blocks `<script>` tags rendered inside components and throws hydration errors. **Mitigation**: Use `next/script` with `strategy="beforeInteractive"` which is the officially supported approach for Next.js 16.

**[Next.js fetch interception]** → Next.js 16 with Turbopack patches the global `fetch` function for caching/deduping. This can cause absolute external URLs to be incorrectly resolved as relative routes on the Next.js server. **Mitigation**: Use the official `@huggingface/inference` SDK which handles HTTP communication via its own client, bypassing Next.js's fetch patching.

**[Hugging Face Rate Limits]** → Free tier has rate limits (~30 req/min). Mitigate by showing clear error messages and a retry button.

**[API Key Management]** → Requires users to set `HUGGINGFACE_API_KEY`. Mitigate by documenting setup in `.env.example` and showing a clear error if missing.

**[Model Availability]** → Some models may queue during high demand. Mitigate by allowing model selection so users can switch to a faster alternative model.

**[New Dependency]** → Adding `@huggingface/inference` (~50KB) increases bundle size slightly. Acceptable trade-off for reliability and type safety.

## Migration Plan

**Phase 0: Install Dependency**
- Install `@huggingface/inference` npm package

**Phase 1: Image Generation Module**
- Create `src/lib/huggingface.ts` with `HfInference.textToImage()` integration supporting multiple models (FLUX.1-dev, SD3.5-large) and parameters (guidance_scale, num_inference_steps)
- Update `POST /api/generate-image` API route to accept model, guidance_scale, width, height in the request body

**Phase 2: Generator UI (Modern)**
- Create `ImageGenerator` component with **textarea** prompt, generate button, and image display
- Add **collapsible settings panel** with model selector dropdown, guidance_scale slider, width/height selectors
- Apply **glassmorphism** styling to input area, settings panel, and result card
- Add loading state with shimmer skeleton animation
- Add **click-to-zoom modal** with close-on-outside-click and X button, full-height image, download button
- Add image download functionality from both card and modal
- Add error state with retry button
- Support dark mode

**Phase 3: Generation History**
- Create `GenerationHistory` component showing past generations as a thumbnail grid
- Add ability to re-use previous prompts
- Add to the `/generate` page

**Phase 4: Testing & Polish**
- Write tests for components and API route
- Test loading, error, and success states
- Test modal open/close behavior
- Verify build, lint, and type-check pass

## Open Questions

- Should we add aspect ratio / size options for the generated images?
- Which Hugging Face models should be available? (`black-forest-labs/FLUX.1-dev` + `stabilityai/stable-diffusion-3.5-large`)
