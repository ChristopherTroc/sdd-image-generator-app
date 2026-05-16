"use client";

import { useState, useCallback } from "react";
import { ImageGenerator } from "@/components/ImageGenerator";
import { GenerationHistory } from "@/components/GenerationHistory";

type GenerationItem = {
  imageUrl: string;
  prompt: string;
  id: string;
};

export default function Home() {
  const [generations, setGenerations] = useState<GenerationItem[]>([]);

  const handleGeneration = useCallback((result: GenerationItem) => {
    setGenerations((prev) => [result, ...prev]);
  }, []);

  const handleSelectPrompt = useCallback((prompt: string) => {
    window.dispatchEvent(
      new CustomEvent("set-prompt", { detail: prompt }),
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            AI Image Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Describe any image and let AI bring it to life
          </p>
        </div>

        {/* Generator */}
        <ImageGenerator onGeneration={handleGeneration} />

        {/* History */}
        <div className="mt-16 max-w-2xl mx-auto">
          <GenerationHistory
            generations={generations}
            onSelectPrompt={handleSelectPrompt}
          />
        </div>
      </div>
    </div>
  );
}

