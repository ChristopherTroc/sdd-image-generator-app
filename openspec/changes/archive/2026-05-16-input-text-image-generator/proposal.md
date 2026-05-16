## Why

Adding a text-to-image generator brings AI-powered creative capabilities directly into the application. Users can describe an image in natural language and have it generated on demand, making the app more engaging and demonstrating modern AI integration. Using Hugging Face Inference API provides robust AI image generation via hosted models.

## What Changes

- Create an **Image Generator page** at `/generate` with a **textarea prompt input** (supports long, detailed descriptions) and image output area
- Build a prompt textarea with a "Generate" button and loading state
- Add a **settings panel** with controls for **guidance_scale**, **num_inference_steps** and a **model selector** between `FLUX.1-dev` and `SD3.5-large`
- Use configurable model selection for higher-quality image generation
- Create a server-side API route (`POST /api/generate-image`) to make the call to Hugging Face Inference API and return the image
- Display generated images with a **click-to-zoom modal** that fills the screen height
- Add **image download** capability from both the card and the zoomed view
- Add image generation history (in-memory, per session) with thumbnail grid
- Apply a **modern, polished look and feel** with glassmorphism, smooth animations, and responsive design
- Support dark mode in all new components
- Write comprehensive tests (≥90% coverage)

## Capabilities

### New Capabilities
- `image-generator`: Text-to-image generation with configurable HF model (FLUX.1-dev / SD3.5-large), textarea prompt, settings panel (guidance_scale, num_inference_steps), zoom modal viewer, download, and generation history with modern UI

### Modified Capabilities
<!-- No existing capabilities being modified -->

## Impact

- **Code**: New `src/app/generate/` page, `src/app/api/generate-image/` API route, `src/components/ImageGenerator.tsx`, `src/components/GenerationHistory.tsx`, `src/lib/huggingface.ts`
- **APIs**: New `POST /api/generate-image` endpoint (calls Hugging Face Inference API and returns image data via `@huggingface/inference` SDK)
- **Dependencies**: New `@huggingface/inference` npm package (official Hugging Face SDK for reliable HTTP communication — avoids Next.js fetch interception issues)
- **Systems**: Hugging Face Inference API for image generation using configurable models (`black-forest-labs/FLUX.1-dev` or `stabilityai/stable-diffusion-3.5-large`) with adjustable parameters (guidance_scale, num_inference_steps); in-memory generation history
