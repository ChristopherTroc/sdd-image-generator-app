import { describe, it, expect, vi, beforeEach } from "vitest";

// Hoisted mock - must be before the vi.mock calls
const mockGenerateImage = vi.fn();

vi.mock("@/lib/huggingface", () => ({
  generateImage: mockGenerateImage,
}));

vi.mock("next/server", () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) => ({
      body,
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}));

// Import after mocks
const { POST } = await import("./route");

function createRequest(body: unknown) {
  return {
    json: async () => body,
  } as any;
}

describe("POST /api/generate-image", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when prompt is missing", async () => {
    const response = await POST(createRequest({}));
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Prompt is required");
  });

  it("returns 400 when prompt is empty", async () => {
    const response = await POST(createRequest({ prompt: "" }));
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Prompt is required");
  });

  it("returns image as base64 data URL on success", async () => {
    const fakeDataUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    mockGenerateImage.mockResolvedValueOnce(fakeDataUrl);

    const response = await POST(createRequest({ prompt: "a cat" }));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.imageUrl).toBe(fakeDataUrl);
    expect(body.imageUrl).toMatch(/^data:image\/png;base64,/);
    expect(body.prompt).toBe("a cat");
    expect(body.id).toBeDefined();
  });

  it("returns 500 when image generation fails", async () => {
    mockGenerateImage.mockRejectedValueOnce(
      new Error("Failed to generate image"),
    );

    const response = await POST(createRequest({ prompt: "a cat" }));
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toContain("Failed to generate image");
  });

  it("returns 500 on other errors", async () => {
    mockGenerateImage.mockRejectedValueOnce(new Error("API error"));

    const response = await POST(createRequest({ prompt: "a cat" }));
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toBeDefined();
  });

  it("returns 500 with generic message for non-Error throws", async () => {
    mockGenerateImage.mockRejectedValueOnce("string error");

    const response = await POST(createRequest({ prompt: "a cat" }));
    expect(response.status).toBe(500);
  });

  it("uses Date.now() fallback when crypto.randomUUID is unavailable", async () => {
    const originalRandomUUID = crypto.randomUUID;
    (crypto as any).randomUUID = undefined;

    mockGenerateImage.mockResolvedValueOnce("data:image/png;base64,abc");

    const response = await POST(createRequest({ prompt: "a cat" }));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.id).toBeDefined();

    (crypto as any).randomUUID = originalRandomUUID;
  });

  it("passes the error message through", async () => {
    mockGenerateImage.mockRejectedValueOnce(
      new Error("Model unavailable, please retry"),
    );

    const response = await POST(createRequest({ prompt: "a cat" }));
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toContain("unavailable");
  });

  it("returns 202 with retrying status on 503 error", async () => {
    mockGenerateImage.mockRejectedValueOnce(
      new Error("Image generation failed (503): Model is loading"),
    );

    const response = await POST(createRequest({ prompt: "a cat" }));
    expect(response.status).toBe(202);
    const body = await response.json();
    expect(body.status).toBe("retrying");
    expect(body.message).toContain("starting up");
  });
});
