import { NextRequest, NextResponse } from "next/server";
import { generateImage } from "@/lib/huggingface";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, model, guidance_scale, num_inference_steps } = body;

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }

    const imageUrl = await generateImage(prompt.trim(), {
      model,
      guidance_scale,
      num_inference_steps,
    });

    const id = crypto.randomUUID?.() ?? Date.now().toString();

    return NextResponse.json({
      imageUrl,
      prompt: prompt.trim(),
      model: model || "black-forest-labs/FLUX.1-dev",
      guidance_scale: guidance_scale || 7.5,
      num_inference_steps: num_inference_steps || 30,
      id,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate image";
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: message || "Failed to generate image. Please try again." },
      { status: 500 },
    );
  }
}
