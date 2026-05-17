import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateImage } from "./huggingface";

function createUint8Array(bytes: number[]): Uint8Array {
  return new Uint8Array(bytes);
}

function mockFetchOk(bytes: number[], mime = "image/png"): void {
  vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
    new Response(createUint8Array(bytes), {
      status: 200,
      headers: { "Content-Type": mime },
    }),
  );
}

function mockFetchError(status: number, body: string): void {
  vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
    new Response(body, { status, headers: { "Content-Type": "text/plain" } }),
  );
}

function mockFetchJson(data: unknown): void {
  vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
    new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }),
  );
}

describe("generateImage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubEnv("HUGGINGFACE_API_KEY", "test-key-123");
  });

  it("returns a base64 data URL for a valid prompt", async () => {
    const pngBytes = [137, 80, 78, 71, 13, 10, 26, 10];
    mockFetchOk(pngBytes);

    const result = await generateImage("a cat");
    expect(result).toMatch(/^data:image\/png;base64,/);
  });

  it("calls the standard HF API with the default model when no endpoint is set", async () => {
    const pngBytes = [137, 80, 78, 71];
    mockFetchOk(pngBytes);

    await generateImage("a cat");

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      expect.objectContaining({
        method: "POST",
        headers: {
          Authorization: "Bearer test-key-123",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: "a cat" }),
      }),
    );
  });

  it("throws an error when prompt is empty", async () => {
    await expect(generateImage("")).rejects.toThrow("Prompt is required");
  });

  it("throws an error when prompt is only whitespace", async () => {
    await expect(generateImage("   ")).rejects.toThrow("Prompt is required");
  });

  it("throws an error when API key is missing", async () => {
    vi.stubEnv("HUGGINGFACE_API_KEY", "");

    await expect(generateImage("a cat")).rejects.toThrow(
      "HUGGINGFACE_API_KEY is not configured",
    );
  });

  it("throws an error when Hugging Face API returns a non-OK status", async () => {
    mockFetchError(503, "Model is loading");

    await expect(generateImage("a cat")).rejects.toThrow(
      "Image generation failed (503): Model is loading",
    );
  });

  it("returns a data URL with default model when no options provided", async () => {
    const pngBytes = [137, 80, 78, 71];
    mockFetchOk(pngBytes);

    const result = await generateImage("a cat");

    expect(result).toMatch(/^data:image\/png;base64,/);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining("black-forest-labs/FLUX.1-schnell"),
      expect.any(Object),
    );
  });

  it("accepts custom model option", async () => {
    const pngBytes = [137, 80, 78, 71];
    mockFetchOk(pngBytes);

    await generateImage("a cat", { model: "stabilityai/stable-diffusion-3.5-large" });

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large",
      expect.any(Object),
    );
  });

  it("passes parameters in the request body when provided", async () => {
    const pngBytes = [137, 80, 78, 71];
    mockFetchOk(pngBytes);

    await generateImage("a cat", { guidance_scale: 7, num_inference_steps: 40 });

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: JSON.stringify({
          inputs: "a cat",
          parameters: { guidance_scale: 7, num_inference_steps: 40 },
        }),
      }),
    );
  });

  it("uses custom endpoint URL when HF_INFERENCE_ENDPOINT is set", async () => {
    const pngBytes = [137, 80, 78, 71];
    mockFetchOk(pngBytes);

    // Temporarily override env mock by setting env directly
    vi.stubEnv("HF_INFERENCE_ENDPOINT", "https://custom.endpoint.com/v1");

    await generateImage("a cat");

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://custom.endpoint.com/v1",
      expect.any(Object),
    );
  });

  it("handles JSON response with b64_json format", async () => {
    mockFetchJson({
      data: [{ b64_json: "iVBORw0KGgo=" }],
    });

    const result = await generateImage("a cat");
    expect(result).toBe("data:image/jpeg;base64,iVBORw0KGgo=");
  });

  it("throws on unexpected JSON response", async () => {
    mockFetchJson({ error: "unexpected format" });

    await expect(generateImage("a cat")).rejects.toThrow(
      "Unexpected JSON response",
    );
  });

  it("handles JSON response with plain base64 string", async () => {
    const b64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    mockFetchJson(b64);

    const result = await generateImage("a cat");
    expect(result).toBe(`data:image/png;base64,${b64}`);
  });
});
