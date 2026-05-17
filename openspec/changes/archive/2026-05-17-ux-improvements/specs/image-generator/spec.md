## ADDED Requirements

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
