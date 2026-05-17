## ADDED Requirements

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
