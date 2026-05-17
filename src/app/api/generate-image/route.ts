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
      model: model || "black-forest-labs/FLUX.1-schnell",
      guidance_scale: guidance_scale || 7.5,
      num_inference_steps: num_inference_steps || 30,
      id,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate image";

    // If the Hugging Face endpoint is cold (503 Service Unavailable),
    // return 202 so the client can retry with informational feedback
    if (message.includes("(503)")) {
      console.error("Image generation service unavailable (cold start):", error);
      return NextResponse.json(
        {
          status: "retrying",
          message:
            "The image generation service is starting up. This may take up to a minute. Please wait...",
        },
        { status: 202 },
      );
    }

    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: message || "Failed to generate image. Please try again." },
      { status: 500 },
    );
  }
}
