## Why

Users often struggle to write detailed, creative prompts for AI image generation, resulting in lower quality images. A built-in prompt assistant powered by an LLM can suggest artistic, beautiful, and well-structured prompts, making the image generator more accessible and producing better results with less effort.

## What Changes

- Add a **Prompt Assistant** feature: a floating button near the prompt textarea that opens a suggestion panel
- The assistant uses a Hugging Face **text-generation LLM** to generate 3-5 creative prompt variations from a short user input (keyword or theme)
- Clicking a suggestion populates the prompt textarea with the selected text
- Integrate with the existing ImageGenerator component on the home page
- Add loading, error, empty, and dark mode states for the assistant UI

## Capabilities

### New Capabilities
- `prompt-assistant`: LLM-powered creative prompt suggestion system integrated into the image generator UI

### Modified Capabilities
<!-- No existing capability requirements are changing -->

## Impact

- **Code**: New `src/components/PromptAssistant.tsx` component, new `src/app/api/generate-prompts/route.ts` API endpoint, new `src/lib/llm.ts` module, modifications to `src/components/ImageGenerator.tsx` to integrate the assistant button
- **APIs**: New `POST /api/generate-prompts` endpoint (calls DeepSeek model via OpenAI-compatible API through Hugging Face router)
- **Dependencies**: New `openai` npm package (official OpenAI SDK, used with HF router as base URL)
- **Systems**: DeepSeek V4 Flash model (`deepseek-ai/DeepSeek-V4-Flash:novita`) via Hugging Face router at `https://router.huggingface.co/v1`; uses `HUGGINGFACE_API_KEY` as the auth token
