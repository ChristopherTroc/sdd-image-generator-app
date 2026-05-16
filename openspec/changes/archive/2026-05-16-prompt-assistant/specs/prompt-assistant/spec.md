## ADDED Requirements

### Requirement: PromptAssistant component renders
The system SHALL provide a `PromptAssistant` component that generates creative image prompt suggestions using a Hugging Face LLM.

#### Scenario: Renders floating button near textarea
- **GIVEN** the ImageGenerator is rendered
- **WHEN** the PromptAssistant is active
- **THEN** it SHALL display a floating button near the prompt textarea (e.g., a magic wand icon)

#### Scenario: Clicking button opens suggestion panel
- **GIVEN** the floating button is visible
- **WHEN** the user clicks the button
- **THEN** a suggestion panel SHALL open showing generated prompt ideas

#### Scenario: Assistant generates 3-5 prompt suggestions
- **GIVEN** the user has entered a short keyword or theme
- **WHEN** the assistant is activated
- **THEN** it SHALL generate 3 to 5 creative prompt variations based on the input

#### Scenario: Clicking suggestion populates textarea
- **GIVEN** a list of suggestions is displayed
- **WHEN** the user clicks on a suggestion
- **THEN** the prompt textarea SHALL be populated with the selected suggestion text

#### Scenario: Shows loading state while generating
- **GIVEN** the assistant is generating suggestions
- **WHEN** the component renders
- **THEN** it SHALL display a loading indicator (e.g., spinner or skeleton)

#### Scenario: Shows error state with retry
- **GIVEN** the LLM fails to generate suggestions
- **WHEN** the error occurs
- **THEN** an error message SHALL be displayed with a "Try Again" button

#### Scenario: Supports "Regenerate" action
- **GIVEN** suggestions are already displayed
- **WHEN** the user clicks "Regenerate"
- **THEN** new suggestions SHALL be fetched, replacing the current ones

#### Scenario: Supports dark mode
- **GIVEN** dark mode is active
- **WHEN** the PromptAssistant renders
- **THEN** it SHALL use appropriate dark mode Tailwind classes

#### Scenario: Panel spans full width on mobile
- **GIVEN** a mobile viewport (< 640px)
- **WHEN** the suggestion panel is open
- **THEN** the panel SHALL render as a **fixed centered overlay** with **no backdrop** (no gray area on the sides)
- **AND** the panel SHALL have a visible **close button (X)** in the top-right corner of the card header
- **AND** the X button SHALL close the panel when clicked

#### Scenario: Panel is a dropdown with close button on desktop
- **GIVEN** a desktop viewport (>= 640px)
- **WHEN** the suggestion panel is open
- **THEN** the panel SHALL be a fixed-width dropdown (`w-80`) anchored near the floating button
- **AND** the panel SHALL have a visible **close button (X)** in the top-right corner of the card header
- **AND** the X button SHALL close the panel when clicked
- **AND** clicking **outside the panel** (on the textarea or anywhere else outside the panel) SHALL close the panel — using a `document` click event listener with a ref to the panel element
- **AND** clicking **inside the panel** (on the input field, suggestions, or X button) SHALL NOT close the panel

#### Scenario: Assistant button has magic wand icon
- **GIVEN** the PromptAssistant is rendered
- **WHEN** the floating button is visible
- **THEN** it SHALL display a **magic wand icon** (star shape on top + tapered handle) that intuitively communicates "creative assistance"
- **AND** the icon SHALL NOT be a download arrow or other unrelated icon

#### Scenario: Assistant button is grouped next to Generate button
- **GIVEN** the ImageGenerator is rendered
- **WHEN** the bottom bar is visible
- **THEN** the PromptAssistant button SHALL be positioned to the **immediate left of the Generate button** with a ~5px gap between them
- **AND** the Settings toggle button SHALL be on the **right side of the bar**

#### Scenario: Panel content scrolls vertically
- **GIVEN** there are many suggestions
- **WHEN** the suggestion panel is open
- **THEN** the panel content SHALL have `overflow-y-auto` so the content scrolls without overflowing

#### Scenario: Panel background is fully opaque
- **GIVEN** the PromptAssistant panel is open
- **WHEN** the panel renders
- **THEN** the panel card background SHALL be fully opaque (`bg-white` in light mode, `bg-gray-900` in dark mode) — text or elements behind the panel SHALL NOT be visible through the panel background

#### Scenario: Empty state when no input
- **GIVEN** the prompt textarea is empty
- **WHEN** the user opens the assistant
- **THEN** it SHALL show a message asking the user to type a keyword first, or generate general creative themes

### Requirement: Prompt generation API route
The system SHALL provide a server-side API route for generating prompt suggestions via DeepSeek V4 Flash model through Hugging Face router using the OpenAI SDK.

#### Scenario: Generates prompts from keyword
- **GIVEN** a valid keyword and a valid `HUGGINGFACE_API_KEY` environment variable
- **WHEN** a `POST /api/generate-prompts` request is sent with `{ keyword: "cat" }`
- **THEN** the system SHALL call the OpenAI SDK's `chat.completions.create()` with model `deepseek-ai/DeepSeek-V4-Flash:novita` and return `{ suggestions: string[], keyword: string }` on success

#### Scenario: Missing keyword returns error
- **GIVEN** an empty or missing keyword
- **WHEN** a `POST /api/generate-prompts` request is sent
- **THEN** the response SHALL return a 400 error with `{ error: "Keyword is required" }`

#### Scenario: LLM error returns 500
- **GIVEN** Hugging Face API returns an error
- **WHEN** a `POST /api/generate-prompts` request is sent
- **THEN** the response SHALL return a 500 error with the error message
