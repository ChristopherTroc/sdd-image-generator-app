## Context

The `src/lib/huggingface.ts` module currently supports a single custom endpoint via the `HF_INFERENCE_ENDPOINT` environment variable. When set, all image generation requests go to that endpoint regardless of the model selected. The model selector in the UI is disabled with only one option (`black-forest-labs/FLUX.1-schnell`).

A second Hugging Face private inference endpoint has been provisioned for `stable-diffusion-xl-base-1-0-hnm`. To support both models, we need to:
- Refactor from a single shared endpoint to per-model endpoint configuration
- Re-enable the model selector so users can choose between models
- Rename the old env var for clarity since we now have multiple model-specific endpoints

## Goals / Non-Goals

**Goals:**
- Replace `HF_INFERENCE_ENDPOINT` with `HF_FLUX_ENDPOINT` for the FLUX model
- Add `HF_STABLE_DIFFUSION_ENDPOINT` for the `stable-diffusion-xl-base-1-0-hnm` model
- Create a model-to-endpoint mapping in `huggingface.ts` so each model resolves to its own endpoint URL
- Re-enable the model selector dropdown in the settings UI with both model options
- Restore the `model` state in `ImageGenerator.tsx` so users can switch models
- Update `env.ts` schema with the new variable names
- Set `stable-diffusion-xl-base-1-0-hnm` as the default model (instead of FLUX.1-schnell)
- Pass the selected model through the API route to `generateImage()`

**Non-Goals:**
- Changing the API route contract or response format
- Adding more than two models
- Modifying prompt generation, history, or other features
- Changing how the Hugging Face API key is managed

## Decisions

**1. Per-model endpoint mapping over single shared endpoint**
- **Decision**: Create a `MODEL_ENDPOINTS` record in `huggingface.ts` that maps each model ID to the environment variable name containing its endpoint URL. The `generateImage` function reads the appropriate env var based on the model parameter.
- **Rationale**: Each private endpoint is provisioned for a specific model. They are independent — the FLUX endpoint cannot serve SD requests and vice versa. A mapping keeps the relationship explicit and scalable.
- **Implementation**:
  ```typescript
  const MODEL_ENDPOINTS: Record<string, string> = {
    "black-forest-labs/FLUX.1-schnell": process.env.HF_FLUX_ENDPOINT ?? "",
    "stable-diffusion-xl-base-1-0-hnm": process.env.HF_STABLE_DIFFUSION_ENDPOINT ?? "",
  };
  ```
  If a model's env var is not set, the system falls back to the standard Hugging Face Inference API URL (`https://api-inference.huggingface.co/models/{model}`).

**2. Rename `HF_INFERENCE_ENDPOINT` to `HF_FLUX_ENDPOINT`**
- **Decision**: Rename the environment variable for clarity, since it is now specific to the FLUX model.
- **Rationale**: With multiple model-specific endpoints, a generic name like `HF_INFERENCE_ENDPOINT` is ambiguous. `HF_FLUX_ENDPOINT` and `HF_STABLE_DIFFUSION_ENDPOINT` make the purpose clear.
- **Migration**: Update `.env.example`, `serverOptionalSchema` in `env.ts`, and all references in `huggingface.ts`.

**3. Re-enable model selector with two options**
- **Decision**: Restore the model selector dropdown as an interactive control with both `black-forest-labs/FLUX.1-schnell` and `stable-diffusion-xl-base-1-0-hnm` options.
- **Rationale**: Users should be able to choose which model to use for generation. Both models now have their own endpoints configured.
- **Implementation**: Remove `disabled` from the `<select>` element, remove opacity/cursor styling, add the new model to `MODELS` array, and use proper state management for `model`.

**4. Default model: stable-diffusion-xl-base-1-0-hnm**
- **Decision**: Set `stable-diffusion-xl-base-1-0-hnm` as the default/initial model.
- **Rationale**: The Stable Diffusion XL Base model is the preferred default for this application. Users can switch to FLUX.1-schnell if they prefer faster inference.

## Risks / Trade-offs

**[Missing endpoint env var]** → If a user selects a model whose endpoint env var is not set, the system falls back to `https://api-inference.huggingface.co/models/{model}` which requires the HF Inference API to support the model. **Mitigation**: The standard API URL is used as fallback, which works for publicly available models.

**[Backward compatibility]** → Renaming `HF_INFERENCE_ENDPOINT` to `HF_FLUX_ENDPOINT` breaks existing deployments. **Mitigation**: Document the migration in `.env.example`. Users who update their code will need to rename the env var.

**[SD model name accuracy]** → The exact model ID for the new endpoint may need verification. **Mitigation**: Use the name provided in the requirements (`stable-diffusion-xl-base-1-0-hnm`). This can be adjusted if the actual Hugging Face model ID differs.

## Migration Plan

1. Update `src/lib/env.ts` — rename `HF_INFERENCE_ENDPOINT` to `HF_FLUX_ENDPOINT`, add `HF_STABLE_DIFFUSION_ENDPOINT`
2. Update `.env.example` — add both new endpoint variables with documentation
3. Refactor `src/lib/huggingface.ts` — create `MODEL_ENDPOINTS` mapping, remove `HF_API_BASE` constant, update endpoint resolution logic
4. Update `src/components/ImageGenerator.tsx` — re-enable model selector, add second model to `MODELS`, restore `model` state
5. Update `src/lib/env.test.ts` — update test assertions for renamed env vars
6. Update `src/lib/huggingface.test.ts` — update mocks and test cases for per-model endpoints
7. Update `src/components/ImageGenerator.test.tsx` — update tests for re-enabled selector with two models
8. Update `openspec/specs/image-generator/spec.md` — document per-model endpoint support
9. Verify build, lint, test, type-check
