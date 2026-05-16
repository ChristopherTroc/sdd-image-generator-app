## 0. Install Dependencies

- [x] 0.1 Install `openai` npm package

## 1. LLM Integration Module

- [x] 1.1 Create `src/lib/llm.ts` with a `generatePromptSuggestions(keyword: string)` function using OpenAI SDK configured with `baseURL: "https://router.huggingface.co/v1"`, model `deepseek-ai/DeepSeek-V4-Flash:novita`, and `apiKey` from `HUGGINGFACE_API_KEY` env variable
- [x] 1.2 Rewrite `src/lib/llm.test.ts` — mock OpenAI SDK, test valid keyword, empty, params, error handling

## 2. Prompt Generation API Route

- [x] 2.1 Create `src/app/api/generate-prompts/route.ts` — validates keyword, calls LLM, parses response into string array, returns `{ suggestions, keyword }`
- [x] 2.2 Create `src/app/api/generate-prompts/route.test.ts` — 5 tests (missing keyword, empty, success, API error, keyword passthrough)

## 3. PromptAssistant Component

- [x] 3.1 Create `src/components/PromptAssistant.tsx` with:
  - [x] 3.1.1 Floating button (magic wand icon) near textarea
  - [x] 3.1.2 Suggestion panel with two layout modes based on viewport
  - [x] 3.1.3 Loading state with spinner
  - [x] 3.1.4 Error state with "Try Again" button
  - [x] 3.1.5 Empty state asking user to type a keyword
  - [x] 3.1.6 "Regenerate" button to fetch new suggestions
  - [x] 3.1.7 Suggestion items as clickable chips that populate the textarea
  - [x] 3.1.8 Dark mode support
  - [x] 3.1.9 **Responsive panel**: on mobile (< 640px) renders as a fixed centered overlay without backdrop; on desktop (>= 640px) renders as a dropdown anchored to the button
  - [x] 3.1.10 **Close button (X)**: visible X button in panel card header on BOTH mobile and desktop views
  - [x] 3.1.11 **No backdrop on mobile**: no `bg-black/*` overlay — panel floats without gray area on sides
  - [x] 3.1.12 **Vertical scrolling**: `overflow-y-auto` on panel content
  - [x] 3.1.13 **Click outside to close (desktop)**: use `useRef` + `document` click listener — no overlay needed. Check if click target is outside panel ref before closing
  - [x] 3.1.14 **Magic wand icon**: replace download-looking icon with a proper magic wand SVG (star tip + tapered handle)
  - [x] 3.1.15 **Opaque panel background**: change from `bg-white/90` to `bg-white` / `dark:bg-gray-900` to prevent text behind from showing through
- [x] 3.2 Create `src/components/PromptAssistant.test.tsx` — 11 tests (toggle, panel, loading, suggestions, click, error, regenerate, dark mode)

## 4. Integration with ImageGenerator

- [x] 4.1 Add `PromptAssistant` floating button to `src/components/ImageGenerator.tsx` next to the textarea
- [x] 4.2 Wire up suggestion click to populate the textarea state
- [x] 4.3 **Group assistant + generate**: reposition PromptAssistant button to the immediate left of the Generate button (~5px gap)
- [x] 4.4 **Move settings to right**: reposition the Settings toggle button to the right side of the bottom bar

## 5. Verify

- [x] 5.1 Run `npm run test` and verify all tests pass
- [x] 5.2 Run `npm run test:coverage` and verify ≥90% coverage
- [x] 5.3 Run `npm run build` and verify no build errors
- [x] 5.4 Run `npm run lint` and verify no linting errors
- [x] 5.5 Run `npm run type-check` and verify no type errors
