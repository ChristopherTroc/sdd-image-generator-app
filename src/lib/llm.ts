import OpenAI from "openai";

const MODEL = "deepseek-ai/DeepSeek-V4-Flash:novita";

const SYSTEM_PROMPT =
  "You are a creative AI prompt writer. Your task is to generate artistic, beautiful, and highly detailed image prompts. Each prompt should be descriptive, visually rich, and suitable for AI image generation. Return ONLY a numbered list, one prompt per line, starting with '1.' without any additional text.";

type SuggestionResult = {
  suggestions: string[];
};

export async function generatePromptSuggestions(keyword: string): Promise<SuggestionResult> {
  if (!keyword || !keyword.trim()) {
    throw new Error("Keyword is required");
  }

  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) {
    throw new Error("HUGGINGFACE_API_KEY is not configured");
  }

  const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey,
  });

  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Generate 5 creative image prompts about "${keyword.trim()}".`,
      },
    ],
    max_tokens: 500,
    temperature: 0.8,
  });

  const text = response.choices[0]?.message?.content || "";
  const suggestions = text
    .split("\n")
    .map((line) => line.replace(/^\d+\.\s*/, "").trim())
    .filter((line) => line.length > 10);

  return { suggestions: suggestions.slice(0, 5) };
}
