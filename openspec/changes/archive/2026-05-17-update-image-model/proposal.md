## Why

The current image generation uses a hardcoded Hugging Face Inference API endpoint with the `black-forest-labs/FLUX.1-dev` model. To improve flexibility and speed, the endpoint should be configurable via environment variables, and the model should be updated to `black-forest-labs/FLUX.1-schnell` which offers faster generation times with comparable quality.

## What Changes

- Replace hardcoded HF Inference API URL with a configurable `HF_INFERENCE_ENDPOINT` environment variable (with a sensible default)
- Change default model from `black-forest-labs/FLUX.1-dev` to `black-forest-labs/FLUX.1-schnell`
- Add `HF_INFERENCE_ENDPOINT` to `.env.example`
- Add `HF_INFERENCE_ENDPOINT` validation to `src/lib/env.ts`
- Update the SDK initialization to use the custom endpoint when provided

## Capabilities

### New Capabilities
<!-- No new capabilities -->

### Modified Capabilities
- `image-generator`: Configurable endpoint and updated default model

## Impact

- **Code**: Modify `src/lib/huggingface.ts` (use env var for endpoint), modify `src/lib/env.ts` (add endpoint validation), update `.env.example`
- **APIs**: No API changes — endpoint is server-side only
- **Dependencies**: No changes
- **Systems**: Hugging Face Inference API endpoint now configurable via `HF_INFERENCE_ENDPOINT` env var
