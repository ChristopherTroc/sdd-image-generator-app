"use client";

import { useState, useCallback, useEffect, useRef } from "react";

type PromptAssistantProps = {
  onSelectSuggestion: (suggestion: string) => void;
  onAutoGenerate?: (suggestion: string) => void;
};

function PanelContent({
  keyword,
  setKeyword,
  isLoading,
  suggestions,
  error,
  handleGenerate,
  handleSuggestionClick,
  onClose,
}: {
  keyword: string;
  setKeyword: (v: string) => void;
  isLoading: boolean;
  suggestions: string[];
  error: string | null;
  handleGenerate: () => void;
  handleSuggestionClick: (s: string) => void;
  onClose?: () => void;
}) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200/60 dark:border-gray-700/60">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            ✨ Prompt Assistant
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Describe a theme and get creative prompt ideas
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0 ml-2"
            aria-label="Close"
            data-testid="prompt-assistant-close"
          >
            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Input area */}
      <div className="p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !isLoading) {
                e.preventDefault();
                handleGenerate();
              }
            }}
            placeholder="e.g., cat, space, fantasy..."
            disabled={isLoading}
            className="flex-1 px-3 py-2 rounded-xl border border-gray-200/80 dark:border-gray-600/80 bg-white/60 dark:bg-gray-800/60 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 transition-all"
            data-testid="prompt-assistant-input"
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading || !keyword.trim()}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-[0.95]"
            data-testid="prompt-assistant-generate"
          >
            {isLoading ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              "Go"
            )}
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="px-4 pb-4 max-h-64 overflow-y-auto">
        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-6">
            <div className="flex flex-col items-center gap-2">
              <svg className="animate-spin h-6 w-6 text-purple-500" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-sm text-gray-400 dark:text-gray-500">Generating ideas...</p>
            </div>
          </div>
        )}

        {/* Suggestions */}
        {!isLoading && suggestions.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Suggestions ({suggestions.length})
              </span>
              <button
                onClick={handleGenerate}
                className="text-xs text-purple-500 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors"
                data-testid="prompt-assistant-regenerate"
              >
                Regenerate
              </button>
            </div>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left p-3 rounded-xl bg-gray-50/80 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 border border-gray-100 dark:border-gray-700/30 transition-all text-sm text-gray-700 dark:text-gray-300 leading-relaxed hover:shadow-sm active:scale-[0.99]"
                data-testid={`prompt-suggestion-${index}`}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && suggestions.length === 0 && (
          <div className="text-center py-6">
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Type a keyword above and click Go ✨
            </p>
          </div>
        )}

        {/* Error state */}
        {!isLoading && error && (
          <div className="text-center py-4">
            <p className="text-sm text-red-500 dark:text-red-400 mb-2">{error}</p>
            <button
              onClick={handleGenerate}
              className="px-4 py-1.5 rounded-xl bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors"
              data-testid="prompt-assistant-retry"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export function PromptAssistant({ onSelectSuggestion, onAutoGenerate }: PromptAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!keyword.trim()) return;

    setIsLoading(true);
    setError(null);
    setSuggestions([]);

    try {
      const response = await fetch("/api/generate-prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: keyword.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate prompts");
      }

      setSuggestions(data.suggestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [keyword]);

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      onSelectSuggestion(suggestion);
      onAutoGenerate?.(suggestion);
      setIsOpen(false);
      setKeyword("");
      setSuggestions([]);
    },
    [onSelectSuggestion, onAutoGenerate],
  );

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => {
      if (prev) {
        setKeyword("");
        setSuggestions([]);
        setError(null);
      }
      return !prev;
    });
  }, []);

  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Document click listener for outside-click close on desktop
  useEffect(() => {
    if (!isOpen || isMobile) return;

    const handler = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        toggleRef.current &&
        !toggleRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setKeyword("");
        setSuggestions([]);
        setError(null);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, isMobile]);

  const panelProps = {
    keyword,
    setKeyword,
    isLoading,
    suggestions,
    error,
    handleGenerate,
    handleSuggestionClick,
  };

  return (
    <div className="relative">
      {/* Floating button */}
      <button
        ref={toggleRef}
        onClick={handleToggle}
        className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.95]"
        aria-label={isOpen ? "Close prompt assistant" : "Open prompt assistant"}
        title="Prompt Assistant"
        data-testid="prompt-assistant-toggle"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      </button>

      {isOpen && (
        <>
          {isMobile ? (
            <div className="fixed inset-0 z-[110] flex items-center justify-center pointer-events-none">
              <div
                ref={panelRef}
                className="w-[calc(100%-2rem)] max-h-[90vh] pointer-events-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden z-50"
                onClick={(e) => e.stopPropagation()}
                data-testid="prompt-assistant-panel"
              >
                <PanelContent {...panelProps} onClose={handleToggle} />
              </div>
            </div>
          ) : (
            <>
              <div className="fixed inset-0 z-40" onClick={handleToggle} />
              <div
                ref={panelRef}
                className="fixed bottom-auto left-auto right-4 top-1/2 -translate-y-1/2 w-80 z-50 bg-white dark:bg-gray-900 rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/30 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
                data-testid="prompt-assistant-panel"
              >
                <PanelContent {...panelProps} onClose={handleToggle} />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
