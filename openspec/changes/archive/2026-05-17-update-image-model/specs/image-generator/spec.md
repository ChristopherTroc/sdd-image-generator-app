## MODIFIED Requirements

### Requirement: Image generation API route
The system SHALL provide a server-side API route for generating images via Hugging Face Inference API using direct HTTP fetch (not the `@huggingface/inference` SDK) for reliable custom endpoint support.

#### Scenario: Generate image from text prompt (updated endpoint + raw fetch)
- **GIVEN** a valid text prompt and a valid `HUGGINGFACE_API_KEY` environment variable
- **WHEN** a `POST /api/generate-image` request is sent with `{ prompt: "a cat in space" }`
- **THEN** the system SHALL make a `fetch()` POST request to either:
  - A custom endpoint URL from `HF_INFERENCE_ENDPOINT` env var, OR
  - The standard Hugging Face Inference API at `https://api-inference.huggingface.co/models/{model}`
- **AND** the system SHALL use `black-forest-labs/FLUX.1-schnell` as the default model instead of `FLUX.1-dev`
- **AND** handle the response as follows:
  - If the response `Content-Type` is `application/json` and the body is a plain base64 string → return as `data:image/png;base64,{string}`
  - If the response `Content-Type` is `application/json` with `{ data: [{ b64_json: "..." }] }` → return as `data:image/jpeg;base64,{b64_json}`
  - Otherwise treat the response as binary → convert to `data:image/png;base64,{blob}`
- **AND** return `{ image: string (base64-encoded data URL), prompt: string, id: string }` on success

#### Scenario: Custom endpoint from env var
- **GIVEN** the `HF_INFERENCE_ENDPOINT` environment variable is set to `https://custom-hf-proxy.example.com`
- **WHEN** a `POST /api/generate-image` request is sent
- **THEN** the system SHALL send the request directly to the custom endpoint URL instead of the standard Hugging Face API

## ADDED Requirements

### Requirement: Endpoint environment variable
The system SHALL read `HF_INFERENCE_ENDPOINT` from environment variables to configure the Hugging Face Inference API endpoint.

#### Scenario: Default endpoint when env var is not set
- **GIVEN** `HF_INFERENCE_ENDPOINT` is not set
- **WHEN** the image generation is called
- **THEN** the system SHALL use `https://api-inference.huggingface.co` as the default endpoint

#### Scenario: Endpoint validation in env module
- **GIVEN** `HF_INFERENCE_ENDPOINT` is set
- **WHEN** the env module validates it
- **THEN** it SHALL be available via `getServerOptionalEnv().HF_INFERENCE_ENDPOINT`

### Requirement: Model selector disabled with single model
The system SHALL display the model selector as a disabled dropdown with only `FLUX.1-schnell` as the available option.

#### Scenario: Model selector is disabled
- **GIVEN** the settings panel is expanded
- **WHEN** the user views the model selector
- **THEN** the select element SHALL be disabled (`disabled` attribute)
- **AND** SHALL contain only one option: `black-forest-labs/FLUX.1-schnell`
- **AND** SHALL have reduced opacity and `cursor-not-allowed` styling to indicate it cannot be changed

#### Scenario: Model defaults to FLUX.1-schnell
- **GIVEN** the `ImageGenerator` component renders
- **WHEN** the settings panel is opened
- **THEN** the model selector SHALL have `black-forest-labs/FLUX.1-schnell` selected by default
- **AND** the POST request to `/api/generate-image` SHALL always include `model: "black-forest-labs/FLUX.1-schnell"`

#### Scenario: Default endpoint when env var is not set
- **GIVEN** `HF_INFERENCE_ENDPOINT` is not set
- **WHEN** the image generation is called
- **THEN** the system SHALL use `https://api-inference.huggingface.co` as the default endpoint

#### Scenario: Endpoint validation in env module
- **GIVEN** `HF_INFERENCE_ENDPOINT` is set
- **WHEN` the env module validates it
- **THEN** it SHALL be available via `getServerEnv().HF_INFERENCE_ENDPOINT`
