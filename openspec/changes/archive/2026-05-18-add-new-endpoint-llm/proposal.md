## Why

Currently, the application generates images using a single Hugging Face private inference endpoint configured for the `black-forest-labs/FLUX.1-schnell` model. A new dedicated inference endpoint has been provisioned for `stable-diffusion-xl-base-1-0-hnm`, which should be made available as an alternative model option.

The original architecture was designed around the Hugging Face Inference API (general endpoint), then migrated to private endpoints with a single model. Now that we have multiple private endpoints, the implementation needs to be refactored to support multiple models, each with its own endpoint URL, while sharing the same Hugging Face API token.

## What Changes

- Add `HF_STABLE_DIFFUSION_ENDPOINT` environment variable for the new `stable-diffusion-xl-base-1-0-hnm` private endpoint
- Rename `HF_INFERENCE_ENDPOINT` to `HF_FLUX_ENDPOINT` for clarity (both are private endpoints for different models)
- Refactor `src/lib/huggingface.ts` to support multiple model configurations with their respective endpoint URLs
- Update environment variable validation in `src/lib/env.ts` with the new variable names
- Add the `stable-diffusion-xl-base-1-0-hnm` model to the settings UI model selector (re-enabling the dropdown)
- Update `.env.example` with the new environment variables
- Set `stable-diffusion-xl-base-1-0-hnm` as the default model (instead of FLUX.1-schnell)

## Capabilities

### New Capabilities
- `image-generator`: Support for `stable-diffusion-xl-base-1-0-hnm` model via dedicated endpoint

### Modified Capabilities
- `image-generator`: Model selector in settings re-enabled with two model options
- `image-generator`: Refactored to use per-model endpoint configuration instead of a single shared endpoint

## Impact

- **Code**: Modify `src/lib/huggingface.ts` (model-to-endpoint mapping), modify `src/lib/env.ts` (env var schema), modify `src/components/ImageGenerator.tsx` (re-enable model selector with two options), update `.env.example`
- **APIs**: No API contract changes — the API route accepts `model` parameter which already supports different models
- **Dependencies**: No changes
- **Systems**: Two environment variables (`HF_FLUX_ENDPOINT`, `HF_STABLE_DIFFUSION_ENDPOINT`) replace the previous single `HF_INFERENCE_ENDPOINT`
