## 1. Environment Configuration

- [x] 1.1 Rename `HF_INFERENCE_ENDPOINT` to `HF_FLUX_ENDPOINT` and add `HF_STABLE_DIFFUSION_ENDPOINT` to `serverOptionalSchema` in `src/lib/env.ts`
- [x] 1.2 Update `.env.example` — replace `HF_INFERENCE_ENDPOINT` with `HF_FLUX_ENDPOINT` and add `HF_STABLE_DIFFUSION_ENDPOINT` with documentation comments

## 2. Refactor Hugging Face Module

- [x] 2.1 Create `MODEL_ENDPOINTS` mapping in `src/lib/huggingface.ts` that associates each model ID with its corresponding endpoint env var
- [x] 2.2 Update `generateImage()` to resolve the endpoint URL from the model-to-endpoint mapping instead of reading a single env var
- [x] 2.3 Implement fallback to standard HF API URL (`https://api-inference.huggingface.co/models/{model}`) when a model's endpoint env var is not set
- [x] 2.4 Keep `HF_API_BASE` constant (still needed for fallback URL construction)

## 3. Update ImageGenerator Component

- [x] 3.1 Add `stable-diffusion-xl-base-1-0-hnm` to the `MODELS` array with label "Stable Diffusion XL Base"
- [x] 3.2 Re-enable the model selector `<select>` — remove `disabled` attribute and related styling (`opacity-75`, `cursor-not-allowed`)
- [x] 3.3 Set `stable-diffusion-xl-base-1-0-hnm` as the default model (SD first in MODELS array, changed DEFAULT_MODEL in huggingface.ts)
- [x] 3.4 Restore proper `model` state management — use `useState` with `setModel` that can be updated by user selection
- [x] 3.5 Add `onChange` handler to the model selector so state updates when user selects a different model

## 4. Update Tests

- [x] 4.1 Update `src/lib/env.test.ts` — rename env var references from `HF_INFERENCE_ENDPOINT` to `HF_FLUX_ENDPOINT` and add tests for `HF_STABLE_DIFFUSION_ENDPOINT`
- [x] 4.2 Update `src/lib/huggingface.test.ts` — update mocks to use new env var names, add tests for per-model endpoint resolution
- [x] 4.3 Update `src/components/ImageGenerator.test.tsx` — update tests for re-enabled selector with two model options and SD as default

## 5. Update Specs & Design Docs

- [x] 5.1 Update `openspec/specs/image-generator/spec.md` — document per-model endpoint support and two model options in selector
- [x] 5.2 Create `openspec/changes/2026-05-18-add-new-endpoint-llm/specs/image-generator/spec.md` — detail the new model endpoint architecture

## 6. Verify

- [x] 6.1 Run `npm run test` and verify all tests pass (148/148 ✓)
- [x] 6.2 Run `npm run build` and verify no build errors
