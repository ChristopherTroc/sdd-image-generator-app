## 1. Server-Side: Return 202 on 503

- [x] 1.1 Update `src/app/api/generate-image/route.ts` — catch 503 error from `generateImage()`, return `202 Accepted` with `{ status: "retrying", message: "The image generation service is starting up. This may take up to a minute. Please wait..." }`
- [x] 1.2 Update route test — add tests for 503 → 202 response

## 2. Client-Side: Retry Logic in ImageGenerator

- [x] 2.1 Add retry state to ImageGenerator: `isRetrying`, `retryMessage`, `retryCount`, `retryTimerRef`
- [x] 2.2 Implement retry handler: on receiving 202 response, set `isRetrying=true`, show info message, start retry timer
- [x] 2.3 Implement retry schedule: first retry after 60s, subsequent every 30s (max 5 attempts)
- [x] 2.4 Handle success during retry: clear retry state, show generated image
- [x] 2.5 Handle max retries exceeded: clear retry state, show error with "Try Again" button
- [x] 2.6 Cancel pending retry on: new generation trigger, component unmount

## 3. UI: Informational Message

- [x] 3.1 Add info banner UI in ImageGenerator that shows when `isRetrying` is true
- [x] 3.2 Style the info banner with appropriate colors (blue/indigo info style) and a subtle loading indicator
- [x] 3.3 Ensure the Generate button stays disabled with loading spinner during retry

## 4. Update Specs & Verify

- [ ] 4.1 Update `openspec/specs/image-generator/spec.md` — sync retry requirements to main spec
- [x] 4.2 Run `npm run test` and verify all tests pass
- [x] 4.3 Run `npm run build` and verify no build errors
