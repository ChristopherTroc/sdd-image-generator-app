## Context

The `src/lib/huggingface.ts` module currently creates a `HfInference` instance with the default Hugging Face Inference API endpoint (`https://api-inference.huggingface.co`). The model used is `black-forest-labs/FLUX.1-dev`. We need to make the endpoint configurable and switch to a faster model.

During implementation we discovered that the `@huggingface/inference` SDK's `textToImage` method has a `getResponse()` handler that fails with custom endpoints returning raw binary image data or base64 JSON strings. The SDK expects specific JSON formats (`data[0].b64_json` or `output[0]`) and falls through to an error for valid responses. We therefore replaced the SDK with raw `fetch()` calls for full control over response handling.

## Goals / Non-Goals

**Goals:**
- Make HF Inference API endpoint configurable via `HF_INFERENCE_ENDPOINT` env var
- Change default model to `black-forest-labs/FLUX.1-schnell`
- Add env var to `.env.example` and validation in `env.ts`
- Replace `@huggingface/inference` SDK with raw `fetch()` for reliable custom endpoint support
- Update the model selector in settings UI to list `FLUX.1-schnell` (instead of `FLUX.1-dev`) as the default option
- Maintain backward compatibility (standard HF API URL works when no custom endpoint is set)

**Non-Goals:**
- Adding new models beyond the two existing ones
- Modifying the prompt generation or any other feature

## Decisions

**1. Raw `fetch()` over `@huggingface/inference` SDK**
- **Decision**: Replace the `HfInference.textToImage()` SDK call with a direct `fetch()` POST request
- **Rationale**: The SDK's `HFInferenceTextToImageTask.getResponse()` method throws "expected a Blob" when custom endpoints return raw binary image data or plain base64 JSON strings. By using raw `fetch()` we gain full control over response parsing:
  - Base64 string in JSON body → `data:image/png;base64,{string}`
  - `{ data: [{ b64_json: "..." }] }` → `data:image/jpeg;base64,{b64_json}`
  - Binary blob → `data:image/png;base64,{blob}`
- **Implementation**: Make POST request with `Authorization: Bearer {apiKey}` header and `{ inputs: prompt, parameters?: {...} }` body

**2. FLUX.1-schnell over FLUX.1-dev**
- **Decision**: Change the default model constant from `black-forest-labs/FLUX.1-dev` to `black-forest-labs/FLUX.1-schnell`, and update the settings UI model selector accordingly
- **Rationale**: FLUX.1-schnell is optimized for faster inference while maintaining good quality, improving the user experience with shorter wait times
- **Alternatives Considered**: Keeping FLUX.1-dev (slower but slightly higher quality, no longer offered in settings), SD3.5-large (requires Pro subscription)

**3. Endpoint URL resolution**
- **Decision**: Read `HF_INFERENCE_ENDPOINT` directly from `process.env` (not through `getServerOptionalEnv()`)
- **Rationale**: When `HF_INFERENCE_ENDPOINT` is not set, we need to construct the standard API URL as `https://api-inference.huggingface.co/models/{model}`. The `getServerOptionalEnv()` function returns the default base URL (`https://api-inference.huggingface.co`) which would be truthy, causing the custom endpoint branch to always be taken. By reading `process.env.HF_INFERENCE_ENDPOINT` directly, we properly distinguish between "no endpoint set" and "endpoint set to a value".

**4. Single fixed model (FLUX.1-schnell) over model selector**
- **Decision**: Remove `stabilityai/stable-diffusion-3.5-large` from the settings UI model selector, make the dropdown disabled, and keep only `black-forest-labs/FLUX.1-schnell`
- **Rationale**: The dedicated inference endpoint is configured specifically for FLUX.1-schnell. Offering a model selector with alternative models that cannot actually be routed through the custom endpoint would be misleading. Simplifying the UI also reduces complexity.
- **Implementation**: Keep `MODELS` array with a single entry, add `disabled` attribute to `<select>` with `opacity-75 cursor-not-allowed` styling

## Risks / Trade-offs

**[Invalid Endpoint URL]** → If the user sets an invalid endpoint, image generation will fail with connection errors. **Mitigation**: Validate URL format in the env module.

**[Model Quality Change]** → FLUX.1-schnell may produce slightly lower quality than FLUX.1-dev. **Mitigation**: The custom endpoint is configured for FLUX.1-schnell which offers fast inference with good quality.

**[Removed SDK dependency]** → The `@huggingface/inference` SDK is no longer used by the image generator. **Mitigation**: Removed from `package.json` dependencies.

## Migration Plan

1. Update `src/lib/env.ts` — add `serverOptionalSchema` with `HF_INFERENCE_ENDPOINT` and `getServerOptionalEnv()` function
2. Update `.env.example` — add `HF_INFERENCE_ENDPOINT` with comment
3. Rewrite `src/lib/huggingface.ts` — replace SDK with raw `fetch()`, read endpoint from `process.env.HF_INFERENCE_ENDPOINT`, change model to `FLUX.1-schnell`
4. Rewrite `src/lib/huggingface.test.ts` — mock `globalThis.fetch` instead of `@huggingface/inference`
5. Update `src/components/ImageGenerator.tsx` — change `MODELS[0]` to `FLUX.1-schnell`
6. Update `src/components/ImageGenerator.test.tsx` — update model assertions
7. Update `src/app/api/generate-image/route.ts` — change fallback model string
8. Verify build, lint, test, type-check
