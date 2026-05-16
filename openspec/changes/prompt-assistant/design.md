## Context

The application already has an AI image generator on the home page with a textarea prompt, settings panel (model selector, guidance_scale, num_inference_steps), and generation history. Users write prompts manually. Adding an LLM-powered prompt assistant will help users create more detailed, creative prompts — improving the quality of generated images.

The project uses `@huggingface/inference` SDK with a valid `HUGGINGFACE_API_KEY` for image generation. The same SDK supports text-generation models, so no new dependencies are needed.

## Goals / Non-Goals

**Goals:**
- Create a `PromptAssistant` component with a floating button and suggestion panel
- Integrate the button next to the prompt textarea in `ImageGenerator`
- Use Hugging Face text-generation LLM to generate 3-5 creative prompt suggestions from a keyword
- Clicking a suggestion populates the textarea
- Add loading, error, empty, and dark mode states
- Create `POST /api/generate-prompts` API route
- Write tests with ≥90% coverage

**Non-Goals:**
- Editing/generating images (only prompt text suggestions)
- Multiple LLM model selection in the UI
- Persistent suggestion history
- Supporting non-Hugging Face LLM providers

## Decisions

**1. Floating button approach over always-visible panel**
- **Decision**: Use a floating button (magic wand icon) next to the textarea that opens a suggestion panel on click
- **Rationale**: Keeps the UI clean and unobtrusive — the assistant is available when needed but doesn't clutter the main interface
- **Alternatives Considered**: Always-visible panel (too much clutter), separate page (breaks flow)

**2. Reuse @huggingface/inference SDK for text generation**
- **Decision**: Use the existing `@huggingface/inference` SDK with `HfInference.textGeneration()` instead of raw fetch
- **Rationale**: Already installed, already configured with `HUGGINGFACE_API_KEY`, and avoids Next.js fetch interception issues (same reason as the image generator)
- **Alternatives Considered**: Raw fetch to HF API (Next.js fetch interception), separate LLM SDK (unnecessary dependency)

**3. DeepSeek V4 Flash via OpenAI SDK**
- **Decision**: Use `deepseek-ai/DeepSeek-V4-Flash:novita` via the OpenAI SDK (`openai` npm package) with `baseURL: "https://router.huggingface.co/v1"` instead of `@huggingface/inference` SDK
- **Rationale**: The Mistral model (`Mistral-7B-Instruct-v0.3`) is not available on the Hugging Face Inference API (returns "Invalid username or password" for all providers). DeepSeek V4 Flash is a faster, more capable model that supports chat completions via the OpenAI-compatible endpoint. The `openai` SDK is a standard, well-maintained library that works with any OpenAI-compatible API.
- **Implementation**: Use `OpenAI` client from `openai` package, configured with `baseURL` pointing to HF router and `apiKey` from `HUGGINGFACE_API_KEY` env variable. No separate HF token needed.
- **Alternatives Considered**: `@huggingface/inference` SDK (Mistral model not available), direct fetch to HF router (more boilerplate), `HuggingFaceH4/zephyr-7b-beta` (also not available)

**4. Mobile-First Responsive Panel**
- **Decision**: Use two different positioning strategies depending on viewport — on mobile (< 640px) the panel SHALL render as a **fixed centered overlay without backdrop** (no gray area); on desktop (>= 640px) it SHALL remain a **dropdown anchored to the floating button**. Both views SHALL include a **close button (X)** in the top-right corner of the panel header.
- **Rationale**: Using `absolute bottom-full` (dropdown above the button) fails on mobile because the floating button sits near the bottom of the textarea card — the panel goes upward and gets overlapped by the textarea or cut off by the viewport. A fixed overlay on mobile ensures the panel is always fully visible, centered, and above all other elements regardless of scroll position or layout. The backdrop (`bg-black/30`) was removed because it created an unwanted gray area on the sides. Instead, the panel floats without any backdrop. The X close button is needed on both views — on desktop the toggle button alone is not obvious enough as a close mechanism.
- **Implementation**:
  - On mobile (`< 640px`):
    - Panel renders as `fixed inset-0 flex items-center justify-center` with **no backdrop** (no `bg-black/*` element)
    - The floating image-generator card remains visible beneath but the panel covers it
    - Panel card SHALL include a **close button (X)** in the top-right corner of the card header
    - Clicking the X button SHALL close the panel
    - Panel background SHALL be **fully opaque** (`bg-white` dark:`bg-gray-900`) to prevent text behind from being visible through the panel
  - On desktop (`>= 640px`):
    - Panel renders as `absolute bottom-full right-0 mb-2 w-80` as a dropdown
    - Panel card SHALL include a **close button (X)** in the top-right corner of the card header (same as mobile)
    - Clicking the X button SHALL close the panel
    - Clicking the toggle button SHALL also close the panel
    - **Clicking outside the panel** SHALL close the panel — implemented via a `document` click listener that checks if the click target is outside the panel's DOM element (using `useRef` + `useEffect` with `addEventListener`). This approach avoids z-index conflicts between an overlay and the panel content. The listener SHALL NOT fire on clicks inside the panel or on the toggle button.
    - Panel background SHALL be **fully opaque** (`bg-white` dark:`bg-gray-900`) to prevent text behind from being visible through the panel
    - Panel content SHALL maintain normal pointer events (no `pointer-events-none` needed) since the outside-click detection is event-based, not overlay-based
  - In both cases: `overflow-y-auto` for long suggestion lists

**5. ImageGenerator Bottom Bar Layout**
- **Decision**: Restructure the bottom bar of the textarea card to have three groups: settings text on the left, a grouped row of [Assistant wand icon + Generate button] on the right, with ~5px gap between the assistant and generate buttons
- **Rationale**: The current layout has the PromptAssistant floating button on the far left and settings text next to it, which feels unbalanced. Grouping the assistant wand with the generate button makes it clear they work together (assistant helps write the prompt, generate creates the image). The settings button on the right corner keeps it accessible but separate from the primary action flow.
- **Implementation**:
  - The bottom row uses `flex items-center justify-between`
  - **Left side**: Settings toggle button (text + gear icon, same as before)
  - **Right side**: `flex items-center gap-1.5` containing:
    - PromptAssistant button (magic wand icon)
    - Generate button (gradient primary CTA)
  - The assistant button SHALL use a **magic wand icon** with the exact SVG path for a wand: a star at the tip and a tapered handle (e.g., `M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z`)
  - Gap between assistant and generate: `gap-1.5` (~6px in Tailwind)

## Risks / Trade-offs

**[Panel Transparency]** → Glassmorphism effect (`bg-white/90`) can make text behind the panel readable through it. **Mitigation**: Use fully opaque backgrounds (`bg-white` dark:`bg-gray-900`) for the panel card to ensure readability regardless of what's behind.

**[Rate Limits]** → Text generation adds API calls to the same HF rate limit as image generation. **Mitigation**: Keep suggestions cacheable (future improvement); user controls when to generate.

**[Cold Start Latency]** → LLM models may take time to load on HF servers. **Mitigation**: Show clear loading state with spinner.

## Migration Plan

0. Install `openai` npm package
1. Create `src/lib/llm.ts` — wraps OpenAI SDK with baseURL pointing to HF router, uses DeepSeek model
2. Create `src/app/api/generate-prompts/route.ts` — validates keyword, calls LLM, parses suggestions
3. Create `src/components/PromptAssistant.tsx` — floating button, suggestion panel, loading/error states
4. Integrate PromptAssistant into `src/components/ImageGenerator.tsx` — add button near textarea
5. Write tests (llm module, API route, PromptAssistant component)
6. Verify build, lint, type-check, test coverage

## Open Questions

- Should we add a model selector for the LLM in the future?
- What prompt template works best for chatCompletion? (e.g., system: "You are a creative prompt writer", user: "Generate 5 image prompts about {keyword}")
