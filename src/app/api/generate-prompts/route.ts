import { NextRequest, NextResponse } from "next/server";
import { generatePromptSuggestions } from "@/lib/llm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { keyword } = body;

    if (!keyword || !keyword.trim()) {
      return NextResponse.json(
        { error: "Keyword is required" },
        { status: 400 },
      );
    }

    const result = await generatePromptSuggestions(keyword.trim());

    return NextResponse.json({
      suggestions: result.suggestions,
      keyword: keyword.trim(),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate prompts";
    console.error("Prompt generation error:", error);
    return NextResponse.json(
      { error: message || "Failed to generate prompts. Please try again." },
      { status: 500 },
    );
  }
}
