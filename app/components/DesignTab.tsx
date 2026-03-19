"use client";

interface DesignTabProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  lastUpdate: string;
  onSubmit: (prompt: string) => void;
}

export default function DesignTab({
  prompt,
  setPrompt,
  isGenerating,
  lastUpdate,
  onSubmit,
}: DesignTabProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(prompt);
  };

  const handleQuickPrompt = (quickPrompt: string) => {
    setPrompt(quickPrompt);
    onSubmit(quickPrompt);
  };

  const quickPrompts = [
    "Modern living room with gray sofa",
    "Cozy reading nook with warm colors",
    "Minimalist bedroom with white theme",
    "Dark moody living room",
  ];

  return (
    <>
      <form onSubmit={handleSubmit} className="p-4 md:p-6 flex-1 flex flex-col">
        <label
          htmlFor="prompt"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
        >
          Describe your design
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A modern living room with a beige sofa, wooden floor, and large windows..."
          className="flex-1 min-h-[150px] md:min-h-[200px] w-full p-3 md:p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
          disabled={isGenerating}
        />
        
        <button
          type="submit"
          disabled={isGenerating || !prompt.trim()}
          className="mt-4 w-full py-2.5 md:py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors text-sm md:text-base flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating...
            </>
          ) : (
            'Generate Design'
          )}
        </button>
      </form>

      <div className="p-4 md:p-6 border-t border-zinc-200 dark:border-zinc-800">
        <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
          Quick Prompts
        </h3>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((quickPrompt) => (
            <button
              key={quickPrompt}
              onClick={() => handleQuickPrompt(quickPrompt)}
              disabled={isGenerating}
              className="px-3 py-1.5 text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50"
            >
              {quickPrompt}
            </button>
          ))}
        </div>
      </div>

      {lastUpdate && (
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">
            Last updated: {lastUpdate}
          </p>
        </div>
      )}
    </>
  );
}
