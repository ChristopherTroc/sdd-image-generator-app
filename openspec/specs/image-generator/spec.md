## Purpose
Text-to-image generation using Hugging Face Inference API, with configurable endpoint, settings panel, generation history, and dark mode support.
## Requirements
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

### Requirement: ImageGenerator component
The system SHALL provide an `ImageGenerator` component for text-to-image generation with a modern glassmorphism UI.

#### Scenario: Generator renders textarea and button
- **GIVEN** the `ImageGenerator` component
- **WHEN** rendered
- **THEN** it SHALL display a **textarea** prompt input (not a single-line input) with placeholder text and a "Generate" button

#### Scenario: Textarea supports long prompts
- **GIVEN** the `ImageGenerator` component
- **WHEN** the user types a long, detailed description
- **THEN** the textarea SHALL allow multiple lines and scroll as needed

#### Scenario: Generate button is disabled while loading
- **GIVEN** an image generation is in progress
- **WHEN** the component renders
- **THEN** the "Generate" button SHALL be disabled and show a loading state

#### Scenario: Generated image is displayed with modern card
- **GIVEN** an image has been generated
- **WHEN** the component receives the result
- **THEN** it SHALL display the generated image inside a styled card with glassmorphism effects (backdrop blur, semi-transparent background, subtle shadow) and a download button

#### Scenario: Clicking image opens zoom modal
- **GIVEN** a generated image is displayed
- **WHEN** the user clicks on the image
- **THEN** a full-screen modal SHALL open showing the image at maximum height (up to 90vh) centered on a dark blurred backdrop

#### Scenario: Zoom modal closes on X button
- **GIVEN** the zoom modal is open
- **WHEN** the user clicks the X close button
- **THEN** the modal SHALL close

#### Scenario: Zoom modal closes on outside click
- **GIVEN** the zoom modal is open
- **WHEN** the user clicks outside the image (on the backdrop)
- **THEN** the modal SHALL close

#### Scenario: Zoom modal has download button
- **GIVEN** the zoom modal is open
- **WHEN** rendered
- **THEN** it SHALL display a download button to save the image

#### Scenario: Error state shows retry
- **GIVEN** image generation fails
- **WHEN** the component receives an error
- **THEN** it SHALL display an error message and a "Try Again" button

#### Scenario: Generator supports dark mode
- **GIVEN** dark mode is active
- **WHEN** the `ImageGenerator` renders
- **THEN** it SHALL use appropriate dark mode Tailwind classes with glassmorphism adapting to both themes

#### Scenario: Glassmorphism effects in light mode
- **GIVEN** light mode is active
- **WHEN** the `ImageGenerator` renders
- **THEN** input area and result card SHALL have white/translucent backgrounds with backdrop blur, light shadows, and subtle borders

#### Scenario: Glassmorphism effects in dark mode
- **GIVEN** dark mode is active
- **WHEN** the `ImageGenerator` renders
- **THEN** input area and result card SHALL have dark/translucent backgrounds with backdrop blur, and adjusted shadows

### Requirement: Settings panel with model selector and parameters
The system SHALL provide a collapsible settings panel with model selection and generation parameter controls.

#### Scenario: Settings panel is collapsed by default
- **GIVEN** the `ImageGenerator` component
- **WHEN** initially rendered
- **THEN** the settings panel SHALL be collapsed/hidden, with a toggle button to expand it

#### Scenario: Model selector shows fixed model
- **GIVEN** the settings panel is expanded
- **WHEN** the user views the model selector
- **THEN** it SHALL display a single disabled option: `black-forest-labs/FLUX.1-schnell`
- **AND** the select element SHALL be disabled with a visual indicator (reduced opacity, cursor-not-allowed)
- **AND** the default selected model SHALL be `black-forest-labs/FLUX.1-schnell`

#### Scenario: Guidance scale slider adjusts value
- **GIVEN** the settings panel is expanded
- **WHEN** the user moves the guidance_scale slider
- **THEN** the value SHALL be displayed numerically and range from 1 to 20
- **AND** the default value SHALL be 7.5

#### Scenario: Inference steps slider adjusts quality
- **GIVEN** the settings panel is expanded
- **WHEN** the user moves the num_inference_steps slider
- **THEN** the value SHALL be displayed numerically and range from 10 to 50
- **AND** the default value SHALL be 30
- **AND** a note SHALL indicate that higher values produce better quality but take longer

#### Scenario: Settings are sent with the generation request
- **GIVEN** the user has modified settings
- **WHEN** the "Generate" button is clicked
- **THEN** the POST request to `/api/generate-image` SHALL include `model`, `guidance_scale`, and `num_inference_steps` alongside the `prompt`
- **AND** SHALL NOT include `width` or `height` (these are not supported by the Hugging Face Inference API for text-to-image)

#### Scenario: Settings panel supports dark mode
- **GIVEN** dark mode is active
- **WHEN** the settings panel is expanded
- **THEN** it SHALL use appropriate dark mode glassmorphism styles

### Requirement: Generation history
The system SHALL display a history of previously generated images.

#### Scenario: History shows past generations
- **GIVEN** the user has generated images
- **WHEN** the `GenerationHistory` component renders
- **THEN** it SHALL display a list of previous prompts and thumbnails

#### Scenario: Clicking history item re-uses prompt
- **GIVEN** a previous generation in history
- **WHEN** the user clicks on it
- **THEN** the prompt SHALL be populated in the input field

#### Scenario: History empty state
- **GIVEN** the user has not generated any images
- **WHEN** the `GenerationHistory` component renders
- **THEN** it SHALL display an empty state message

### Requirement: Generate page
The system SHALL provide a dedicated `/generate` page for the image generator.

#### Scenario: Page renders generator and history
- **GIVEN** the `/generate` route
- **WHEN** navigated to
- **THEN** it SHALL display the `ImageGenerator` and `GenerationHistory` components

#### Scenario: Page has dark mode support
- **GIVEN** dark mode is active
- **WHEN** the `/generate` page renders
- **THEN** the page background and text SHALL use dark mode classes

### Requirement: Flash prevention without hydration errors
The system SHALL apply the user's saved dark mode preference before the first paint without causing React hydration errors in Next.js 16 / React 19.

#### Scenario: Flash prevention uses next/script with beforeInteractive strategy
- **GIVEN** a user with a saved dark mode preference in localStorage
- **WHEN** the page loads
- **THEN** the flash prevention script SHALL be injected via `next/script` with `strategy="beforeInteractive"` (NOT via raw `<script>` tag with `dangerouslySetInnerHTML`)

#### Scenario: Flash script runs before React hydration
- **GIVEN** the `next/script` with `beforeInteractive` strategy
- **WHEN** the page loads
- **THEN** the script SHALL execute before React hydration, reading `localStorage` and applying the `dark` class to `<html>` if needed

#### Scenario: No hydration mismatch errors
- **GIVEN** the flash prevention script has added a `dark` class to `<html>`
- **WHEN** React hydrates
- **THEN** no hydration mismatch error SHALL occur (requires `suppressHydrationWarning` on the `<html>` element)

#### Scenario: No console warnings from React
- **GIVEN** the flash prevention script is rendered
- **WHEN** the page loads in development mode
- **THEN** React SHALL NOT log the warning "Encountered a script tag while rendering React component"

### Requirement: API key environment variable
The system SHALL require a `HUGGINGFACE_API_KEY` environment variable for the API route.

#### Scenario: Missing key shows configuration error
- **GIVEN** the `HUGGINGFACE_API_KEY` environment variable is not set
- **WHEN** the API route is called
- **THEN** the response SHALL return a 500 error indicating the API key is not configured

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

### Requirement: Prompt Assistant panel visibility
The system SHALL ensure the PromptAssistant suggestion panel is fully visible and not overlapped by the generated image result.

#### Scenario: Prompt Assistant panel renders above generated image
- **GIVEN** a generated image is displayed
- **WHEN** the PromptAssistant panel is opened
- **THEN** the suggestion panel SHALL use `fixed` positioning (not `absolute`) with `z-50` to break out of its container's stacking context
- **AND** all suggestion text SHALL be fully visible without being cut off by the image below

### Requirement: Clickable generation history
The system SHALL allow users to click on a history item to view that generation's image and prompt as the main result.

#### Scenario: Clicking history item shows that image
- **GIVEN** the generation history has at least one item
- **WHEN** the user clicks on a history thumbnail
- **THEN** the main result image SHALL be replaced with the clicked history item's image
- **AND** the prompt text SHALL update to show the clicked history item's prompt

#### Scenario: Clicking history item after a new generation
- **GIVEN** a history item was clicked and is shown as the main result
- **WHEN** the user generates a new image
- **THEN** the main result SHALL update to the newly generated image

### Requirement: Generation history persistence
The system SHALL persist generation history across page navigations using `sessionStorage`.

#### Scenario: History persists on page reload
- **GIVEN** the user has generated images
- **WHEN** the page is reloaded (same tab)
- **THEN** the generation history SHALL be restored from `sessionStorage`

#### Scenario: History clears on tab close
- **GIVEN** the user has generated images
- **WHEN** the tab is closed and a new tab is opened
- **THEN** the generation history SHALL be empty

#### Scenario: No errors when sessionStorage is unavailable
- **GIVEN** `sessionStorage` is unavailable (private browsing, storage full)
- **WHEN** the page loads
- **THEN** history SHALL fall back to in-memory state without throwing errors

### Requirement: Service unavailable retry with user feedback
The system SHALL automatically retry image generation when the Hugging Face Inference endpoint returns a 503 Service Unavailable response, and SHALL display an informational message to the user during retries.

#### Scenario: 503 triggers retry with info message
- **GIVEN** the Hugging Face Inference endpoint returns HTTP 503 (Service Unavailable)
- **WHEN** a `POST /api/generate-image` request is sent
- **THEN** the API route SHALL return HTTP 202 with `{ status: "retrying", message: "The image generation service is starting up. This may take up to a minute. Please wait..." }`
- **AND** the client SHALL display the informational message while keeping the loading state active
- **AND** the client SHALL NOT display an error state during retries

#### Scenario: First retry after 60 seconds
- **GIVEN** a 503 response was received
- **WHEN** the retry mechanism starts
- **THEN** the first retry SHALL occur after 60 seconds

#### Scenario: Subsequent retries every 30 seconds
- **GIVEN** the first retry also returned 503
- **WHEN** subsequent retries are performed
- **THEN** each retry SHALL wait 30 seconds before the next attempt
- **AND** this SHALL continue for up to 5 total attempts

#### Scenario: Successful retry shows result
- **GIVEN** the service becomes available during a retry
- **WHEN** the retry request succeeds
- **THEN** the informational message SHALL be cleared
- **AND** the generated image SHALL be displayed normally

#### Scenario: Max retries exceeded shows error
- **GIVEN** all 5 retry attempts returned 503
- **WHEN** the max retry count is reached
- **THEN** the system SHALL display an error message explaining the service is unavailable
- **AND** the "Try Again" button SHALL be available for manual retry

#### Scenario: New generation cancels pending retry
- **GIVEN** a retry is in progress (waiting for next attempt)
- **WHEN** the user triggers a new image generation
- **THEN** the pending retry SHALL be cancelled
- **AND** the new generation request SHALL start immediately

#### Scenario: Component unmount cancels pending retry
- **GIVEN** a retry is in progress
- **WHEN** the component unmounts
- **THEN** the pending retry timer SHALL be cleared to avoid state updates on unmounted component

