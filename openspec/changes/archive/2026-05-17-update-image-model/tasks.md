## 1. Environment Configuration

- [x] 1.1 Add `HF_INFERENCE_ENDPOINT` to `serverOptionalSchema` in `src/lib/env.ts` with `getServerOptionalEnv()`
- [x] 1.2 Add `HF_INFERENCE_ENDPOINT` to `.env.example` with documentation comment

## 2. Replace SDK with Raw Fetch

- [x] 2.1 Rewrite `src/lib/huggingface.ts` — replace `HfInference.textToImage()` with direct `fetch()` POST request
- [x] 2.2 Handle multiple response formats: plain base64 JSON string, `{ data: [{ b64_json }] }`, and binary blob
- [x] 2.3 Read `HF_INFERENCE_ENDPOINT` directly from `process.env` (not through `getServerOptionalEnv()`) to distinguish "not set" from "set to default"

## 3. Remove Unused SDK Dependency

- [x] 3.1 Remove `@huggingface/inference` from `package.json` dependencies since it's no longer used

## 4. Update Model to FLUX.1-schnell

- [x] 4.1 Change default model constant from `black-forest-labs/FLUX.1-dev` to `black-forest-labs/FLUX.1-schnell` in `src/lib/huggingface.ts`
- [x] 4.2 Update `src/components/ImageGenerator.tsx` — change `MODELS` array to use `FLUX.1-schnell` as first/default option
- [x] 4.3 Update `src/app/api/generate-image/route.ts` — change fallback model string to `FLUX.1-schnell`

## 5. Disable Model Selector (Remove SD3.5-large)

- [x] 5.1 Remove `stabilityai/stable-diffusion-3.5-large` from `MODELS` array in `ImageGenerator.tsx`
- [x] 5.2 Add `disabled` attribute to `<select>` element with visual styling (opacity, cursor-not-allowed)
- [x] 5.3 Update `ImageGenerator.test.tsx` — replace "two options" test with "disabled with single model" test
- [x] 5.4 Update `README.md` — model selector references to single fixed model

## 6. Update Tests

- [x] 6.1 Rewrite `src/lib/huggingface.test.ts` — mock `globalThis.fetch` instead of `@huggingface/inference` SDK
- [x] 6.2 Add tests for: custom endpoint, plain base64 JSON response, unexpected JSON response
- [x] 6.3 Update `src/components/ImageGenerator.test.tsx` — change model assertions to `FLUX.1-schnell`

## 7. Update Specs & Design Docs

- [x] 7.1 Update `openspec/specs/image-generator/spec.md` — reflect raw fetch approach and FLUX.1-schnell model
- [x] 7.2 Update `openspec/changes/update-image-model/specs/image-generator/spec.md` — detail response handling
- [x] 7.3 Update `openspec/changes/update-image-model/design.md` — document raw fetch decision and endpoint URL resolution

## 8. Verify

- [x] 8.1 Run `npm run test` and verify all tests pass
- [x] 8.2 Run `npm run build` and verify no build errors
