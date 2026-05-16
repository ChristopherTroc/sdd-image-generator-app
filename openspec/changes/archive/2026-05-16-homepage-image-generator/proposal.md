## Why

The current home page shows generic welcome content that serves no real purpose. Moving the AI image generator to the root route (`/`) makes it the first thing users see — a more engaging and useful landing experience. This simplifies navigation by removing the duplicate "Generate" entry point.

## What Changes

- Move the `/generate` page content to be the new home page (`/`)
- Remove the old home page (`src/app/page.tsx` — the generic welcome page)
- Remove the "Generate" navigation link from the layout header
- Delete the `/generate` route (`src/app/generate/`) since it's no longer needed
- Update root layout metadata to reflect the AI image generator as the app's primary purpose

## Capabilities

### New Capabilities
<!-- No new capabilities — this is a routing/navigation change only -->

### Modified Capabilities
<!-- No capability specs change — the image-generator behavior remains identical, only its route changes -->

## Impact

- **Code**: Modify `src/app/page.tsx` (replace with generate page content), modify `src/app/layout.tsx` (remove Generate link), delete `src/app/generate/` directory
- **APIs**: No API changes
- **Dependencies**: No new dependencies
- **Systems**: Routing structure simplified — `/` now serves the image generator directly
