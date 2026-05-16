"use client";

type GenerationItem = {
  imageUrl: string;
  prompt: string;
  id: string;
};

type GenerationHistoryProps = {
  generations: GenerationItem[];
  onSelectPrompt: (prompt: string) => void;
};

export function GenerationHistory({
  generations,
  onSelectPrompt,
}: GenerationHistoryProps) {
  if (generations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-gray-500 dark:text-gray-400">No generations yet</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Your generated images will appear here
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        History ({generations.length})
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {generations.map((gen) => (
          <button
            key={gen.id}
            onClick={() => onSelectPrompt(gen.prompt)}
            className="group relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors text-left"
            title={`Re-use prompt: ${gen.prompt}`}
          >
            <img
              src={gen.imageUrl}
              alt={gen.prompt}
              className="w-full aspect-square object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
              <p className="text-xs text-white truncate">{gen.prompt}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
