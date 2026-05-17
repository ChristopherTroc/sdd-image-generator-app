## Why

The current image generator has UX friction points that reduce the user experience: the prompt assistant panel gets overlapped by the generated image, users must manually click "Generate" after selecting a suggestion, and the generation history isn't interactive. These improvements streamline the workflow and make history persistent across page reloads.

## What Changes

- Fix **Prompt Assistant panel overlap**: ensure the suggestion panel renders above the generated image result so all suggestions are fully visible
- **Auto-generate on suggestion click**: when a user clicks a prompt suggestion from the assistant, automatically trigger image generation without requiring an extra click on "Generate"
- **Clickable generation history**: clicking a history item replaces the current result image and prompt with the selected one
- **Persistent history via sessionStorage**: store generation history in `sessionStorage` instead of in-memory state, so it persists across page navigations but clears when the tab is closed

## Capabilities

### New Capabilities
<!-- No new capabilities — this is a UX improvement to existing capabilities -->

### Modified Capabilities
- `prompt-assistant`: Auto-generate on suggestion click (new requirement)
- `image-generator`: Fix panel overlap, clickable history, sessionStorage persistence (new requirements)

## Impact

- **Code**: Modify `src/components/PromptAssistant.tsx` (accept `onAutoGenerate` callback), modify `src/components/ImageGenerator.tsx` (fix z-index, clickable history, sessionStorage), modify `src/app/page.tsx` (sessionStorage initialization)
- **APIs**: No API changes
- **Dependencies**: No new dependencies
- **Systems**: Generation history now persists in `sessionStorage` (cleared on tab close)
