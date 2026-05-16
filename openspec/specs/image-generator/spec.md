## ADDED Requirements

### Requirement: Image generation API route
The system SHALL provide a server-side API route for generating images via Hugging Face Inference API using the official `@huggingface/inference` SDK.

#### Scenario: Generate image from text prompt
- **GIVEN** a valid text prompt and a valid `HUGGINGFACE_API_KEY` environment variable
- **WHEN** a `POST /api/generate-image` request is sent with `{ prompt: "a cat in space" }`
- **THEN** the system SHALL return `{ image: string (base64-encoded image), prompt: string, id: string }` on success

#### Scenario: Missing prompt returns error
- **GIVEN** an empty or missing prompt
- **WHEN** a `POST /api/generate-image` request is sent
- **THEN** the response SHALL return a 400 error with `{ error: "Prompt is required" }`

#### Scenario: Missing API key returns error
- **GIVEN** the `HUGGINGFACE_API_KEY` environment variable is not set
- **WHEN** a `POST /api/generate-image` request is sent
- **THEN** the response SHALL return a 500 error with `{ error: "API key not configured" }`

#### Scenario: Hugging Face API returns error
- **GIVEN** the Hugging Face Inference API returns a non-200 status
- **WHEN** a `POST /api/generate-image` request is sent
- **THEN** the response SHALL return a 500 error with the error message from Hugging Face

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

#### Scenario: Model selector switches between available models
- **GIVEN** the settings panel is expanded
- **WHEN** the user opens the model selector dropdown
- **THEN** it SHALL display at least two options: `black-forest-labs/FLUX.1-dev` and `stabilityai/stable-diffusion-3.5-large`
- **AND** the default selected model SHALL be `black-forest-labs/FLUX.1-dev`

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
