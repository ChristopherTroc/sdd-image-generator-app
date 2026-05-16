## Context

The application has a dedicated `/generate` page that hosts the AI image generator (`ImageGenerator` + `GenerationHistory` components). The home page (`/`) shows a generic welcome page with feature cards (TypeScript, Tailwind, ESLint). There's also a "Generate" link in the layout header that duplicates navigation to the generator. This creates an unnecessary extra click for the app's primary feature.

## Goals / Non-Goals

**Goals:**
- Replace the home page content with the AI image generator
- Remove the old welcome page (feature cards, etc.)
- Remove the "Generate" nav link from the layout header — keep only ThemeToggle
- Delete the `/generate` route and its directory
- Update page metadata/title to reflect the new home page purpose

**Non-Goals:**
- Changing the ImageGenerator, GenerationHistory, or any other component
- Modifying the API route or image generation logic
- Adding new features to the image generator

## Decisions

**1. Direct content replacement over component extraction**
- **Decision**: Copy the current `src/app/generate/page.tsx` content into `src/app/page.tsx`, then delete the old `/generate` route
- **Rationale**: The generate page is self-contained with its own `"use client"` directive, state, and composition of ImageGenerator + GenerationHistory. Moving it directly avoids re-architecting. No shared layout logic needs extraction since the layout only provides the header and ThemeProvider.
- **Alternatives Considered**: Creating a shared layout wrapper (overkill for one route), keeping `/generate` and redirecting (unnecessary indirection)

**2. Remove Generate link from header**
- **Decision**: Delete the `<a href="/generate">` element from `layout.tsx`, keeping only the `<ThemeToggle />` component
- **Rationale**: With the generator being the home page, the link becomes a self-referential no-op. The header should only contain the theme toggle for a clean minimal UI.
- **Alternatives Considered**: Replacing the link text to "Home" (unnecessary since clicking the logo/brand isn't implemented), keeping it as a no-op (confusing for users)

**3. Update metadata**
- **Decision**: Change the page title from "Next.js SDD App" to "AI Image Generator" and update the description
- **Rationale**: The app's primary purpose is now the image generator; the metadata should reflect that for SEO and browser tab clarity

## Risks / Trade-offs

**[Lost route]** → The `/generate` route will no longer exist. If users have bookmarked it, they'll get a 404. **Mitigation**: Acceptable for an MVP; the home page is the new location.

**[Test file migration]** → The `src/app/generate/page.test.tsx` tests are specific to the generate page. They'll need to be moved/recreated for the new home page location. **Mitigation**: Move the test file alongside the page content.

## Migration Plan

1. Copy `src/app/generate/page.tsx` content into `src/app/page.tsx`
2. Update `src/app/layout.tsx` — remove Generate link, update metadata
3. Move `src/app/generate/page.test.tsx` to `src/app/page.test.tsx`
4. Delete `src/app/generate/` directory
5. Run tests and verify build

## Open Questions

- Should the theme toggle remain in the same position (top-right) or be repositioned?
