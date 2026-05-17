## Context

The image generation API endpoint (`POST /api/generate-image`) calls `generateImage()` in `src/lib/huggingface.ts`, which makes a `fetch()` request to the Hugging Face Inference Endpoint. When the endpoint is cold (inactive for 15+ minutes), it returns HTTP 503. Currently, this bubbles up as a generic error to the user. The endpoint typically takes 30-60 seconds to become ready.

## Goals / Non-Goals

**Goals:**
- Auto-retry on 503 responses from the Hugging Face endpoint, with user feedback
- First retry after 60 seconds, then every 30 seconds (max 5 retries)
- Show an informational message while retrying: "The image generation service is starting up. This may take up to a minute. Please wait..."
- Keep the loading/retrying state active (don't show error until max retries exceeded)
- On success, clear the info message and display the image normally

**Non-Goals:**
- Modifying the core `generateImage()` library function signature
- Retrying non-503 errors (these are genuine failures)
- Persistent retry across page navigations
- Configurable retry intervals (hardcoded for now)

## Decisions

**1. Client-side retry loop over server-side long-running request**
- **Decision**: Implement retry logic in the `ImageGenerator` component (client-side) rather than the API route handler
- **Rationale**: Vercel Hobby plan has a 10s function timeout. A server-side retry with 60s delays would be terminated. By retrying client-side, we have unlimited time. The flow: client POST → server detects 503 → returns `202 Accepted` with `{ status: "retrying" }` → client shows info message → client waits → client retries POST.
- **Implementation**: Add a `retryCount` state and `retryTimer` ref to ImageGenerator. On receiving a 202 retrying response, start the retry timer. On each retry, increment count. On success, show result. On max retries (5), show error.

**2. Server returns 202 for retry detection**
- **Decision**: The API route handler catches 503 errors from `generateImage()` and returns `202 Accepted` with `{ status: "retrying", message: "..." }` instead of a 500 error
- **Rationale**: Clean separation — the route detects the 503, the client handles the UX. No new endpoint needed.

**3. Retry schedule: 60s initial delay, then 30s intervals**
- **Decision**: First retry after 60 seconds (typical cold-start time), subsequent retries every 30 seconds, up to 5 total attempts
- **Rationale**: Based on observed cold-start behavior of Hugging Face Inference Endpoints
- **Implementation**: Client-side `setTimeout` chain: `[60_000, 30_000, 30_000, 30_000, 30_000]`

**4. Informational message in loading state**
- **Decision**: Add a `retrying` boolean state and `retryMessage` string to ImageGenerator. When retrying, render an info banner below the textarea/button but keep the button disabled with loading spinner.
- **Rationale**: The user should know the system is working but needs to wait, rather than seeing a frozen loading state.

## Risks / Trade-offs

**[Page navigation during retry]** → If the user navigates away during a retry, the `setTimeout` will fire on an unmounted component. **Mitigation**: Use a ref to track mounted state and clear timers in the cleanup function.

**[Multiple rapid generations]** → If the user triggers a new generation while retrying. **Mitigation**: Starting a new generation cancels any pending retry (clear `retryTimer` ref, reset `retryCount`).

**[Max retries exceeded]** → After 5 retries (~3.5 minutes total), the service might still be cold. **Mitigation**: Show a clear error message with the "Try Again" button for manual retry.

## Migration Plan

1. Update `src/app/api/generate-image/route.ts` — detect 503 error from `generateImage()`, return `202` with `{ status: "retrying" }` instead of `500`
2. Update `src/components/ImageGenerator.tsx` — add retry state (retryCount, isRetrying, retryMessage), handle 202 response, implement retry timer logic
3. Update tests for retry behavior
4. Verify with manual testing (stop/start the endpoint)
