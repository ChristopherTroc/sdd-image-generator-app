## ADDED Requirements

### Requirement: Auto-generate on suggestion click
The system SHALL automatically trigger image generation when the user clicks a prompt suggestion from the PromptAssistant, eliminating the extra "Generate" button click.

#### Scenario: Clicking suggestion triggers auto-generate
- **GIVEN** a list of suggestions is displayed in the PromptAssistant panel
- **WHEN** the user clicks on a suggestion
- **THEN** the prompt textarea SHALL be populated with the selected suggestion text
- **AND** image generation SHALL automatically start using the **same suggestion text** (not stale prompt state)

#### Scenario: Auto-generate uses correct prompt text
- **GIVEN** the prompt textarea is empty (or has unrelated text)
- **WHEN** the user clicks a suggestion
- **THEN** the generated image SHALL be based on the clicked suggestion text, NOT on the previous textarea content

#### Scenario: Auto-generate shows loading state
- **GIVEN** a suggestion has been clicked and auto-generation has started
- **WHEN** the component renders
- **THEN** the Generate button SHALL be disabled and show the loading spinner

#### Scenario: Auto-generate works with current settings
- **GIVEN** the user has modified generation settings (model, guidance_scale, steps)
- **WHEN** auto-generation is triggered by clicking a suggestion
- **THEN** the current settings SHALL be used for the generation
