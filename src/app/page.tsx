"use client";

import { useState, useCallback, useEffect } from "react";
import { ImageGenerator } from "@/components/ImageGenerator";
import { GenerationHistory } from "@/components/GenerationHistory";

type GenerationItem = {
  imageUrl: string;
  prompt: string;
  id: string;
};

const STORAGE_KEY = "generation-history";

function loadHistory(): GenerationItem[] {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveHistory(items: GenerationItem[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // sessionStorage unavailable (private browsing, quota)
  }
}

export default function Home() {
  const [generations, setGenerations] = useState<GenerationItem[]>(loadHistory);
  const [selectedGeneration, setSelectedGeneration] = useState<GenerationItem | null>(null);

  useEffect(() => {
    saveHistory(generations);
  }, [generations]);

  const handleGeneration = useCallback((result: GenerationItem) => {
    setGenerations((prev) => {
      const updated = [result, ...prev];
      saveHistory(updated);
      return updated;
    });
    setSelectedGeneration(null);
  }, []);

  const handleSelectPrompt = useCallback((prompt: string) => {
    window.dispatchEvent(
      new CustomEvent("set-prompt", { detail: prompt }),
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSelectHistory = useCallback((item: GenerationItem) => {
    setSelectedGeneration(item);
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
        <ImageGenerator onGeneration={handleGeneration} forceResult={selectedGeneration} />

        {/* History */}
        <div className="mt-16 max-w-2xl mx-auto">
          <GenerationHistory
            generations={generations}
            onSelectPrompt={handleSelectPrompt}
            onSelectHistory={handleSelectHistory}
          />
        </div>
      </div>
    </div>
  );
}

