import { HfInference } from "@huggingface/inference";

const DEFAULT_MODEL = "black-forest-labs/FLUX.1-dev";

type GenerateOptions = {
  model?: string;
  guidance_scale?: number;
  num_inference_steps?: number;
};

export async function generateImage(
  prompt: string,
  options?: GenerateOptions,
): Promise<string> {
  if (!prompt || !prompt.trim()) {
    throw new Error("Prompt is required");
  }

  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) {
    throw new Error("HUGGINGFACE_API_KEY is not configured");
  }

  const hf = new HfInference(apiKey);

  const params: Record<string, unknown> = {};
  if (options?.guidance_scale !== undefined) params.guidance_scale = options.guidance_scale;
  if (options?.num_inference_steps !== undefined) params.num_inference_steps = options.num_inference_steps;

  // textToImage returns a Blob at runtime (despite TS types showing string)
  const blob: Blob = await (hf.textToImage as any)({
    model: options?.model || DEFAULT_MODEL,
    inputs: prompt.trim(),
    parameters: Object.keys(params).length > 0 ? params : undefined,
  });

  const arrayBuffer = await blob.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  let binary = "";
  for (let i = 0; i < uint8Array.length; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  const base64 = btoa(binary);

  return `data:image/png;base64,${base64}`;
}
