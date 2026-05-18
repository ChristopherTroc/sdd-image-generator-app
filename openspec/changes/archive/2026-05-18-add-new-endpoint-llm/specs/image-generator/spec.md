## MODIFIED Requirements

### Requirement: Image generation API route
The system SHALL provide a server-side API route for generating images via Hugging Face Inference API using direct HTTP fetch, with per-model endpoint resolution.

#### Scenario: Generate image from text prompt (per-model endpoints)
- **GIVEN** a valid text prompt and a valid `HUGGINGFACE_API_KEY` environment variable
- **WHEN** a `POST /api/generate-image` request is sent with `{ prompt: "a cat in space", model: "black-forest-labs/FLUX.1-schnell" }`
- **THEN** the system SHALL make a `fetch()` POST request to the endpoint configured in `HF_FLUX_ENDPOINT` env var (or fall back to `https://api-inference.huggingface.co/models/{model}`)
- **AND** handle the response as follows:
  - If the response `Content-Type` is `application/json` and the body is a plain base64 string → return as `data:image/png;base64,{string}`
  - If the response `Content-Type` is `application/json` with `{ data: [{ b64_json: "..." }] }` → return as `data:image/jpeg;base64,{b64_json}`
  - Otherwise treat the response as binary → convert to `data:image/png;base64,{blob}`
- **AND** return `{ image: string (base64-encoded data URL), prompt: string, id: string }` on success

#### Scenario: Endpoint resolution per model
- **GIVEN** the `HF_FLUX_ENDPOINT` environment variable is set to `https://flux-private-endpoint.hf.space` AND the `HF_STABLE_DIFFUSION_ENDPOINT` environment variable is set to `https://sd-private-endpoint.hf.space`
- **WHEN** a request is made with `model: "black-forest-labs/FLUX.1-schnell"`
- **THEN** the system SHALL send the request to `https://flux-private-endpoint.hf.space`
- **WHEN** a request is made with `model: "stable-diffusion-xl-base-1-0-hnm"`
- **THEN** the system SHALL send the request to `https://sd-private-endpoint.hf.space`

#### Scenario: Fallback to standard API when endpoint env var is not set
- **GIVEN** `HF_FLUX_ENDPOINT` is not set
- **WHEN** a request is made with `model: "black-forest-labs/FLUX.1-schnell"`
- **THEN** the system SHALL send the request to `https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell`

### Requirement: Environment variables
The system SHALL read `HF_FLUX_ENDPOINT` and `HF_STABLE_DIFFUSION_ENDPOINT` from environment variables to configure per-model endpoints.

#### Scenario: FLUX endpoint env var
- **GIVEN** `HF_FLUX_ENDPOINT` is set
- **WHEN** the env module validates it
- **THEN** it SHALL be available via `getServerOptionalEnv().HF_FLUX_ENDPOINT`

#### Scenario: Stable Diffusion endpoint env var
- **GIVEN** `HF_STABLE_DIFFUSION_ENDPOINT` is set
- **WHEN** the env module validates it
- **THEN** it SHALL be available via `getServerOptionalEnv().HF_STABLE_DIFFUSION_ENDPOINT`

### Requirement: Model selector with two models (re-enabled)
The system SHALL display an interactive model selector in the settings panel with two model options.

#### Scenario: Model selector has two options
- **GIVEN** the settings panel is expanded
- **WHEN** the user views the model selector
- **THEN** the select element SHALL be enabled (no `disabled` attribute)
- **AND** SHALL contain two options:
  1. `black-forest-labs/FLUX.1-schnell` (label: "FLUX.1-schnell")
  2. `stable-diffusion-xl-base-1-0-hnm` (label: "Stable Diffusion XL Base")

#### Scenario: Model defaults to Stable Diffusion XL Base
- **GIVEN** the `ImageGenerator` component renders
- **WHEN** the settings panel is opened
- **THEN** the model selector SHALL have `stable-diffusion-xl-base-1-0-hnm` selected by default

#### Scenario: Switching model updates generation request
- **GIVEN** the user has selected `stable-diffusion-xl-base-1-0-hnm` in the model selector
- **WHEN** the user clicks "Generate"
- **THEN** the POST request to `/api/generate-image` SHALL include `model: "stable-diffusion-xl-base-1-0-hnm"`

## REMOVED Requirements

### Requirement: Model selector disabled with single model
The model selector is no longer disabled — it is now an interactive dropdown with two model options.
