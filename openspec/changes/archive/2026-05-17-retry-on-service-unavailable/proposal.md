## Why

The AI image generation service (Hugging Face Inference Endpoint) spins down after 15 minutes of inactivity. When a user triggers image generation while the service is cold, the API returns a 503 "Service Unavailable" error, which currently displays a generic error message and stops. The user must manually retry, which is a poor UX. The service typically takes ~30-60 seconds to start up.

## What Changes

- Add auto-retry logic when the image generation API returns a 503 status code
- On 503, display an informational message: "The image generation service is starting up. This may take up to a minute. Please wait..."
- Keep the loading state active while retrying (don't show error state)
- First retry after 60 seconds, then retry every 30 seconds until successful or a max of 5 retries
- On success, clear the info message and display the generated image normally
- On max retries exceeded, show the error state with option to retry manually

## Capabilities

### New Capabilities
- `image-generator`: Service unavailable retry with user feedback

### Modified Capabilities
<!-- No existing spec-level changes — this is additive behavior to the existing image generation capability -->

## Impact

- **Code**: Modify `src/lib/huggingface.ts` (add retry loop with delays), modify route handler or client component for informational message
- **APIs**: No API changes — retry is client-side or server-side logic
- **Dependencies**: No new dependencies
- **Systems**: Image generation now handles cold-start gracefully with auto-retry
