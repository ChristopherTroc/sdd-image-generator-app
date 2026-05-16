import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateImage } from "./huggingface";

const mockTextToImage = vi.hoisted(() => vi.fn());

vi.mock("@huggingface/inference", () => {
  const mockTti = mockTextToImage;
  return {
    HfInference: class {
      textToImage = mockTti;
    },
  };
});

function createBlob(bytes: number[]): Blob {
  return new Blob([new Uint8Array(bytes)]);
}

describe("generateImage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubEnv("HUGGINGFACE_API_KEY", "test-key-123");
  });

  it("returns a base64 data URL for a valid prompt", async () => {
    const pngBytes = [137, 80, 78, 71, 13, 10, 26, 10];
    mockTextToImage.mockResolvedValueOnce(createBlob(pngBytes));

    const result = await generateImage("a cat");
    expect(result).toMatch(/^data:image\/png;base64,/);
  });

  it("calls textToImage with the default model when none specified", async () => {
    const pngBytes = [137, 80, 78, 71];
    mockTextToImage.mockResolvedValueOnce(createBlob(pngBytes));

    await generateImage("a cat");

    expect(mockTextToImage).toHaveBeenCalledWith({
      model: "black-forest-labs/FLUX.1-dev",
      inputs: "a cat",
      parameters: undefined,
    });
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

  it("throws an error when Hugging Face API returns an error", async () => {
    mockTextToImage.mockRejectedValueOnce(new Error("Model is loading"));

    await expect(generateImage("a cat")).rejects.toThrow("Model is loading");
  });

  it("returns a data URL with default model when no options provided", async () => {
    const pngBytes = [137, 80, 78, 71];
    mockTextToImage.mockResolvedValueOnce(createBlob(pngBytes));

    const result = await generateImage("a cat");

    expect(result).toMatch(/^data:image\/png;base64,/);
    expect(mockTextToImage).toHaveBeenCalledWith({
      model: "black-forest-labs/FLUX.1-dev",
      inputs: "a cat",
      parameters: undefined,
    });
  });

  it("accepts custom model option", async () => {
    const pngBytes = [137, 80, 78, 71];
    mockTextToImage.mockResolvedValueOnce(createBlob(pngBytes));

    await generateImage("a cat", { model: "stabilityai/stable-diffusion-3.5-large" });

    expect(mockTextToImage).toHaveBeenCalledWith({
      model: "stabilityai/stable-diffusion-3.5-large",
      inputs: "a cat",
      parameters: undefined,
    });
  });

  it("passes parameters when provided", async () => {
    const pngBytes = [137, 80, 78, 71];
    mockTextToImage.mockResolvedValueOnce(createBlob(pngBytes));

    await generateImage("a cat", { guidance_scale: 7, num_inference_steps: 40 });

    expect(mockTextToImage).toHaveBeenCalledWith({
      model: "black-forest-labs/FLUX.1-dev",
      inputs: "a cat",
      parameters: { guidance_scale: 7, num_inference_steps: 40 },
    });
  });
});
