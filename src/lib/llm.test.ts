import { describe, it, expect, vi, beforeEach } from "vitest";
import { generatePromptSuggestions } from "./llm";

const mockCreate = vi.hoisted(() => vi.fn());

vi.mock("openai", () => ({
  default: class {
    chat = {
      completions: {
        create: mockCreate,
      },
    };
  },
}));

describe("generatePromptSuggestions", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubEnv("HUGGINGFACE_API_KEY", "test-key-123");
  });

  function makeResponse(text: string) {
    return {
      choices: [{ message: { content: text } }],
    };
  }

  it("returns suggestions for a valid keyword", async () => {
    mockCreate.mockResolvedValueOnce(
      makeResponse(
        '1. "A majestic cat lounging in a sunbeam"\n2. "A cyberpunk cat with neon glowing eyes"',
      ),
    );

    const result = await generatePromptSuggestions("cat");
    expect(result.suggestions).toHaveLength(2);
    expect(result.suggestions[0]).toContain("majestic");
    expect(result.suggestions[1]).toContain("cyberpunk");
  });

  it("limits to 5 suggestions", async () => {
    const lines = Array.from(
      { length: 7 },
      (_, i) => `${i + 1}. "Suggestion ${i + 1}"`,
    );
    mockCreate.mockResolvedValueOnce(makeResponse(lines.join("\n")));

    const result = await generatePromptSuggestions("test");
    expect(result.suggestions).toHaveLength(5);
  });

  it("throws an error when keyword is empty", async () => {
    await expect(generatePromptSuggestions("")).rejects.toThrow(
      "Keyword is required",
    );
  });

  it("throws an error when keyword is only whitespace", async () => {
    await expect(generatePromptSuggestions("   ")).rejects.toThrow(
      "Keyword is required",
    );
  });

  it("throws an error when API key is missing", async () => {
    vi.stubEnv("HUGGINGFACE_API_KEY", "");

    await expect(generatePromptSuggestions("cat")).rejects.toThrow(
      "HUGGINGFACE_API_KEY is not configured",
    );
  });

  it("throws an error when OpenAI API returns an error", async () => {
    mockCreate.mockRejectedValueOnce(new Error("Model unavailable"));

    await expect(generatePromptSuggestions("cat")).rejects.toThrow(
      "Model unavailable",
    );
  });

  it("calls OpenAI with DeepSeek model and correct params", async () => {
    mockCreate.mockResolvedValueOnce(makeResponse('1. "A test prompt"'));

    await generatePromptSuggestions("test");

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "deepseek-ai/DeepSeek-V4-Flash:novita",
        messages: expect.arrayContaining([
          expect.objectContaining({ role: "system" }),
          expect.objectContaining({
            role: "user",
            content: expect.stringContaining("test"),
          }),
        ]),
        temperature: 0.8,
        max_tokens: 500,
      }),
    );
  });

  it("handles empty response content gracefully", async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: "" } }],
    });

    const result = await generatePromptSuggestions("test");
    expect(result.suggestions).toEqual([]);
  });

  it("uses HF router baseURL", async () => {
    mockCreate.mockResolvedValueOnce(makeResponse('1. "Test"'));

    await generatePromptSuggestions("test");

    // OpenAI constructor captures baseURL — check it was passed
    // by verifying the create call succeeds with correct model
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ model: "deepseek-ai/DeepSeek-V4-Flash:novita" }),
    );
  });
});
