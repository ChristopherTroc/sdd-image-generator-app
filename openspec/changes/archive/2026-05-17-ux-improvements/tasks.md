## 1. Fix PromptAssistant Panel Overlap

- [x] 1.1 Fix PromptAssistant panel z-index by using `fixed` positioning (not `absolute`) on desktop + transparent `fixed inset-0` overlay with `z-50`
- [x] 1.2 Verify the panel is fully visible above the result image card on both mobile and desktop

## 2. Auto-Generate on Suggestion Click

- [x] 2.1 Add `overridePrompt?: string` parameter to `handleGenerate` in ImageGenerator — use it instead of stale `prompt` state when provided
- [x] 2.2 Update `PromptAssistantProps.onAutoGenerate` signature to pass suggestion text through to `handleGenerate`
- [x] 2.3 Update `PromptAssistant.test.tsx` — test that auto-generate uses the correct suggestion text
- [x] 2.4 Update `ImageGenerator.test.tsx` — test that `handleGenerate(overridePrompt)` uses the override value

## 3. Clickable Generation History

- [x] 3.1 Add `selectedGeneration` state to `src/app/page.tsx`
- [x] 3.2 Replace the main result display with `selectedGeneration` when set
- [x] 3.3 Add `onSelectHistory` callback to `GenerationHistory` component
- [x] 3.4 Clear `selectedGeneration` when a new generation completes
- [x] 3.5 Update tests for clickable history behavior

## 4. sessionStorage History Persistence

- [x] 4.1 Save generation history to `sessionStorage` key `generation-history` on each change
- [x] 4.2 Restore history from `sessionStorage` on page load
- [x] 4.3 Wrap all `sessionStorage` operations in try/catch for private browsing fallback
- [x] 4.4 Update tests for sessionStorage persistence

## 5. Verify

- [x] 5.1 Run `npm run test` and verify all tests pass
- [x] 5.2 Run `npm run test:coverage` and verify ≥90% coverage
- [x] 5.3 Run `npm run build` and verify no build errors
- [x] 5.4 Run `npm run lint` and verify no linting errors
- [x] 5.5 Run `npm run type-check` and verify no type errors
