const HF_API_BASE = "https://api-inference.huggingface.co";
const DEFAULT_MODEL = "stable-diffusion-xl-base-1-0-hnm";

// Mapping from model ID to environment variable name for custom endpoint
const MODEL_ENDPOINTS: Record<string, string> = {
  "stable-diffusion-xl-base-1-0-hnm": "HF_STABLE_DIFFUSION_ENDPOINT",
  "black-forest-labs/FLUX.1-schnell": "HF_FLUX_ENDPOINT",
};

type GenerateOptions = {
  model?: string;
  guidance_scale?: number;
  num_inference_steps?: number;
};

async function blobToBase64(blob: Blob): Promise<string> {
  const arrayBuffer = await blob.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  let binary = "";
  for (let i = 0; i < uint8Array.length; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return btoa(binary);
}

export async function generateImage(prompt: string, options?: GenerateOptions): Promise<string> {
  if (!prompt || !prompt.trim()) {
    throw new Error("Prompt is required");
  }

  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) {
    throw new Error("HUGGINGFACE_API_KEY is not configured");
  }

  const model = options?.model || DEFAULT_MODEL;

  // Determine the request URL:
  // - Look up model-specific endpoint env var (e.g., HF_FLUX_ENDPOINT for FLUX)
  // - If that env var is explicitly set, use it as the endpoint URL
  // - Otherwise, use the standard HF API URL with the model path
  const endpointEnvVar = MODEL_ENDPOINTS[model];
  const customEndpoint = endpointEnvVar ? process.env[endpointEnvVar] : undefined;
  const url = customEndpoint || `${HF_API_BASE}/models/${model}`;

  const params: Record<string, unknown> = {};
  if (options?.guidance_scale !== undefined) params.guidance_scale = options.guidance_scale;
  if (options?.num_inference_steps !== undefined)
    params.num_inference_steps = options.num_inference_steps;

  const body: Record<string, unknown> = { inputs: prompt.trim() };
  if (Object.keys(params).length > 0) {
    body.parameters = params;
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Image generation failed (${response.status}): ${errorBody}`);
  }

  const contentType = response.headers.get("Content-Type") || "";

  if (contentType.startsWith("application/json")) {
    // The response is JSON — could be a base64-encoded image or an error
    const json = await response.json();

    // Case 1: The JSON body is a plain base64 string
    if (typeof json === "string" && json.length > 50) {
      return `data:image/png;base64,${json}`;
    }

    // Case 2: Standard HF format { data: [{ b64_json: "..." }] }
    if (json.data && Array.isArray(json.data) && json.data[0]?.b64_json) {
      return `data:image/jpeg;base64,${json.data[0].b64_json}`;
    }

    // Unrecognized JSON format
    throw new Error(
      `Unexpected JSON response from image API: ${JSON.stringify(json).slice(0, 200)}`
    );
  }

  // Binary response — treat as image
  const blob = await response.blob();
  const base64 = await blobToBase64(blob);
  return `data:image/png;base64,${base64}`;
}
