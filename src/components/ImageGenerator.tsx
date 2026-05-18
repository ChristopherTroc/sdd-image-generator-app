"use client";

import { useState, useCallback, useEffect } from "react";
import { PromptAssistant } from "@/components/PromptAssistant";
import { useImageGeneration } from "@/hooks/useImageGeneration";

type GenerationResult = {
  imageUrl: string;
  prompt: string;
  id: string;
};

type ImageGeneratorProps = {
  onGeneration?: (result: GenerationResult) => void;
  forceResult?: GenerationResult | null;
};

const MODELS = [
  { id: "stable-diffusion-xl-base-1-0-hnm", label: "Stable Diffusion XL Base" },
  { id: "black-forest-labs/FLUX.1-schnell", label: "FLUX.1-schnell" },
];

export function ImageGenerator({ onGeneration, forceResult }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [model, setModel] = useState(MODELS[0].id);
  const [guidanceScale, setGuidanceScale] = useState(7.5);
  const [numInferenceSteps, setNumInferenceSteps] = useState(30);

  const { isLoading, isRetrying, retryMessage, startGeneration, cancelRetry } =
    useImageGeneration();

  const displayResult = forceResult || result;

  const handleGenerate = useCallback(
    async (overridePrompt?: string) => {
      cancelRetry();
      const effectivePrompt = overridePrompt || prompt;
      if (!effectivePrompt.trim()) return;

      setError(null);
      setResult(null);

      startGeneration(
        effectivePrompt.trim(),
        model,
        guidanceScale,
        numInferenceSteps,
        (data) => {
          setResult(data as GenerationResult);
          onGeneration?.(data as GenerationResult);
        },
        (message) => {
          setError(message);
        }
      );
    },
    [prompt, model, guidanceScale, numInferenceSteps, onGeneration, cancelRetry, startGeneration]
  );

  const handleDownload = useCallback(
    (url?: string, id?: string) => {
      const current = displayResult;
      const imageUrl = url || current?.imageUrl;
      const imageId = id || current?.id;
      if (!imageUrl || !imageId) return;
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `generated-${imageId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    [displayResult]
  );

  // Listen for prompt selection from history
  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setPrompt(customEvent.detail);
    };
    window.addEventListener("set-prompt", handler);
    return () => window.removeEventListener("set-prompt", handler);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey && !isLoading) {
        e.preventDefault();
        handleGenerate();
      }
    },
    [handleGenerate, isLoading]
  );

  // Close modal on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowModal(false);
    };
    if (showModal) {
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
    }
  }, [showModal]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Input Area — Glassmorphism */}
      <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 rounded-2xl p-5 shadow-lg shadow-black/5 dark:shadow-black/20 border border-white/50 dark:border-gray-700/50 transition-all duration-300">
        <label htmlFor="prompt-textarea" className="sr-only">
          Image description
        </label>
        <textarea
          id="prompt-textarea"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe the image you want to generate in detail..."
          disabled={isLoading}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-gray-200/80 dark:border-gray-600/80 bg-white/60 dark:bg-gray-800/60 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 disabled:opacity-50 resize-none transition-all duration-200 backdrop-blur-sm"
        />

        {/* Prompt Assistant + Generate grouped, Settings on right */}
        <div className="flex items-center justify-between mt-3">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center gap-1.5 transition-colors"
          >
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${showSettings ? "rotate-90" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {showSettings ? "Hide settings" : "Settings"}
          </button>

          <div className="flex items-center gap-1.5">
            <PromptAssistant
              onSelectSuggestion={setPrompt}
              onAutoGenerate={(s) => handleGenerate(s)}
            />
            <button
              onClick={() => handleGenerate()}
              disabled={isLoading || !prompt.trim()}
              className="px-6 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Generate
                </>
              )}
            </button>
          </div>
        </div>

        {/* Settings Panel — Collapsible */}
        {showSettings && (
          <div className="mt-4 pt-4 border-t border-gray-200/60 dark:border-gray-700/60 space-y-4">
            {/* Model Selector */}
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200/80 dark:border-gray-600/80 bg-white/60 dark:bg-gray-800/60 text-sm text-gray-900 dark:text-gray-100 transition-all backdrop-blur-sm"
              >
                {MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Guidance Scale */}
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                Guidance Scale:{" "}
                <span className="font-bold text-gray-700 dark:text-gray-200">
                  {guidanceScale.toFixed(1)}
                </span>
              </label>
              <input
                type="range"
                min={1}
                max={20}
                step={0.5}
                value={guidanceScale}
                onChange={(e) => setGuidanceScale(parseFloat(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                <span>1</span>
                <span>20</span>
              </div>
            </div>

            {/* Inference Steps */}
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                Steps:{" "}
                <span className="font-bold text-gray-700 dark:text-gray-200">
                  {numInferenceSteps}
                </span>
                <span className="ml-1 font-normal text-gray-400 dark:text-gray-500">
                  (more = better quality)
                </span>
              </label>
              <input
                type="range"
                min={10}
                max={50}
                step={1}
                value={numInferenceSteps}
                onChange={(e) => setNumInferenceSteps(parseInt(e.target.value, 10))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                <span>10</span>
                <span>50</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading Skeleton — Shimmer Effect */}
      {(isLoading || isRetrying) && !result && !displayResult && (
        <div className="rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="aspect-square relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer bg-[length:200%_100%]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="none">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  Creating your image...
                </p>
                {isRetrying && retryMessage && (
                  <div className="mt-2 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 max-w-sm">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-blue-500 animate-pulse flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-blue-700 dark:text-blue-300 text-xs text-left">
                        {retryMessage}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="backdrop-blur-xl bg-red-50/80 dark:bg-red-900/20 rounded-2xl p-5 border border-red-200/80 dark:border-red-800/50 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <svg
              className="w-5 h-5 text-red-500 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
          <button
            onClick={() => handleGenerate()}
            className="px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Result Image — Glassmorphism Card */}
      {displayResult && (
        <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 rounded-2xl overflow-hidden shadow-lg shadow-black/5 dark:shadow-black/20 border border-white/50 dark:border-gray-700/50 transition-all duration-300">
          <div className="relative group cursor-pointer" onClick={() => setShowModal(true)}>
            <img
              src={displayResult.imageUrl}
              alt={displayResult.prompt}
              className="w-full h-auto"
              onError={() => setError("Failed to load generated image. Please try again.")}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 dark:group-hover:bg-black/40 flex items-center justify-center transition-all duration-300">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                  Click to zoom
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate mr-4">
              Prompt: {displayResult.prompt}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              className="px-4 py-2 rounded-xl bg-gray-100/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-medium transition-all duration-200 flex items-center gap-2 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download
            </button>
          </div>
        </div>
      )}

      {/* Zoom Modal */}
      {showModal && displayResult && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 dark:bg-black/80 backdrop-blur-md"
          onClick={() => setShowModal(false)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowModal(false)}
              className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close zoom"
            >
              <svg
                className="w-4 h-4 text-gray-600 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <img
              src={displayResult.imageUrl}
              alt={displayResult.prompt}
              className="rounded-2xl shadow-2xl max-w-full max-h-[85vh] object-contain"
            />

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent rounded-b-2xl">
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/90 truncate mr-4 max-w-[70%]">
                  {displayResult.prompt}
                </p>
                <button
                  onClick={() => handleDownload()}
                  className="px-4 py-2 rounded-xl bg-white/20 text-white hover:bg-white/30 text-sm font-medium transition-all duration-200 flex items-center gap-2 backdrop-blur-sm border border-white/20 shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
