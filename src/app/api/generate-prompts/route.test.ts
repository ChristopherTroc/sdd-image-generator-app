import { describe, it, expect, vi, beforeEach } from "vitest";

const mockGenerateSuggestions = vi.fn();

vi.mock("@/lib/llm", () => ({
  generatePromptSuggestions: mockGenerateSuggestions,
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

const { POST } = await import("./route");

function createRequest(body: unknown) {
  return {
    json: async () => body,
  } as any;
}

describe("POST /api/generate-prompts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when keyword is missing", async () => {
    const response = await POST(createRequest({}));
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Keyword is required");
  });

  it("returns 400 when keyword is empty", async () => {
    const response = await POST(createRequest({ keyword: "" }));
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Keyword is required");
  });

  it("returns suggestions on success", async () => {
    mockGenerateSuggestions.mockResolvedValueOnce({
      suggestions: ["A majestic cat", "A cyberpunk cat"],
    });

    const response = await POST(createRequest({ keyword: "cat" }));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.suggestions).toEqual(["A majestic cat", "A cyberpunk cat"]);
    expect(body.keyword).toBe("cat");
  });

  it("returns 500 when LLM fails", async () => {
    mockGenerateSuggestions.mockRejectedValueOnce(
      new Error("Model unavailable"),
    );

    const response = await POST(createRequest({ keyword: "cat" }));
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toContain("Model unavailable");
  });

  it("passes the keyword through", async () => {
    mockGenerateSuggestions.mockResolvedValueOnce({
      suggestions: ["A test prompt"],
    });

    const response = await POST(createRequest({ keyword: "space" }));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.keyword).toBe("space");
  });
});
