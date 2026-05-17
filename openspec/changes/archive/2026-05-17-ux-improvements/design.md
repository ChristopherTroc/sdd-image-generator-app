## Context

The application currently has an AI image generator on the home page with a PromptAssistant, settings panel, generation history (in-memory), and zoom modal. Three UX pain points have been identified: the PromptAssistant panel can be overlapped by the generated image, users must click "Generate" manually after selecting a suggestion, and the generation history is lost on page reload.

## Goals / Non-Goals

**Goals:**
- Fix PromptAssistant panel z-index so it's always visible above the result image
- Auto-trigger generation when a suggestion is clicked (no extra click)
- Make history items clickable — clicking a thumbnail shows that generation
- Persist history in `sessionStorage` across page navigations
- Maintain ≥90% test coverage

**Non-Goals:**
- Changing the image generation API or model behavior
- Adding new UI components (modifications to existing only)
- Persistent history across browser sessions (use sessionStorage, not localStorage)

## Decisions

**1. Z-index fix for panel overlap**
- **Decision**: Move the PromptAssistant panel out of normal document flow stacking by using a `fixed` full-screen wrapper with high z-index (`z-50`) when the panel is open on desktop. On mobile it already uses `fixed` positioning. The panel content itself SHALL have `z-50` relative to its container.
- **Rationale**: Adding `z-50` alone to the `absolute` panel doesn't work because the panel is inside a `relative` container that shares a stacking context with the result image card. Both are siblings in the same stacking context, so the `z-index` on the panel has no effect over elements outside its container. By using a `fixed` wrapper that covers the entire viewport (like the mobile approach), the panel breaks out of its container's stacking context.
- **Implementation**: On desktop, when the panel is open, render a transparent `fixed inset-0 z-40` wrapper (same as the outside-click overlay) and make the panel `fixed` (not `absolute`) with `z-50`. This ensures it renders above all page content including the result image card.

**2. Auto-generate via direct prompt override**
- **Decision**: Instead of chaining `setPrompt` + `handleGenerate` (which breaks due to async React state updates), modify `handleGenerate` to accept an optional `overridePrompt` parameter. When `onAutoGenerate(suggestion)` is called, it passes the suggestion directly to `handleGenerate(suggestion)` which uses it immediately instead of reading stale `prompt` state.
- **Rationale**: React's `setState` is asynchronous. When `onSelectSuggestion(suggestion)` calls `setPrompt(suggestion)`, the `prompt` state hasn't updated yet by the time `handleGenerate` reads it. This causes the wrong prompt (empty or previous value) to be sent to the API. By passing the suggestion directly as a parameter, we bypass the stale closure issue entirely.
- **Implementation**:
  ```typescript
  // In ImageGenerator:
  const handleGenerate = useCallback(async (overridePrompt?: string) => {
    const effectivePrompt = overridePrompt || prompt;
    if (!effectivePrompt.trim()) return;
    // ... use effectivePrompt instead of prompt ...
  }, [prompt, ...]);
  
  // Pass to PromptAssistant:
  <PromptAssistant 
    onSelectSuggestion={setPrompt} 
    onAutoGenerate={(s) => handleGenerate(s)} 
  />
  
  // In PromptAssistant:
  const handleSuggestionClick = useCallback((suggestion: string) => {
    onSelectSuggestion(suggestion);
    onAutoGenerate(suggestion); // passes the text directly
    setIsOpen(false);
  }, [onSelectSuggestion, onAutoGenerate]);
  ```

**3. Clickable history with current result replacement**
- **Decision**: Store a `selectedGeneration` state in the page component. Clicking a history item sets this state, which overrides the current result display. Clearing it (new generation) reverts to normal behavior.
- **Rationale**: Simple state management without modifying the ImageGenerator's internal result state. The page component can decide what to display.
- **Alternatives Considered**: Modifying ImageGenerator's internal state (too coupled), using a callback prop (selectedGeneration is simpler)

**4. sessionStorage for history persistence**
- **Decision**: Use `sessionStorage` with try/catch to persist and restore generation history. Fall back to in-memory if unavailable.
- **Rationale**: sessionStorage survives page refreshes but not tab closes — the right balance for a session-based feature. try/catch handles private browsing and storage quota errors.
- **Implementation**: On mount, read from `sessionStorage` key `generation-history`. On each history change, write back to `sessionStorage`. Wrap both in try/catch.

## Risks / Trade-offs

**[sessionStorage Quota]** → If the user generates many high-resolution images (base64), storage may fill up. **Mitigation**: Store only prompt, id, and thumbnail URL — not full base64 data. Wrap writes in try/catch.

**[Panel Z-index]** → Absolute-positioned panel inside a relative container can't overlay sibling elements in a different stacking context. **Mitigation**: Use `fixed` positioning with `z-50` to break out of the container's stacking context.

**[Auto-generate Stale Closure]** → React `setState` is async — calling `setPrompt` followed by `handleGenerate` reads the old prompt value. **Mitigation**: Pass the suggestion text directly as a parameter to `handleGenerate(overridePrompt)`, bypassing state entirely.

## Migration Plan

1. Fix PromptAssistant z-index — use `fixed` positioning on desktop panel (not `absolute`) with `z-50` + transparent overlay
2. Update `handleGenerate` in ImageGenerator to accept `overridePrompt` parameter
3. Pass `onAutoGenerate={(s) => handleGenerate(s)}` from ImageGenerator to PromptAssistant
4. Wire up clickable history in page.tsx with `forceResult` prop
5. Implement sessionStorage persistence for generation history
6. Write/update tests

## Open Questions

- Should the auto-generate feature have a small delay (e.g., 300ms) to show the prompt being populated before generation starts?
