"use client";

import { useState } from "react";
import SceneCanvas from "./components/SceneCanvas";

export default function Home() {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Prompt submitted:", prompt);
  };

  return (
    <div className="flex min-h-screen bg-zinc-100 dark:bg-zinc-900">
      {/* Left Panel - Prompt Input */}
      <div className="w-full md:w-[400px] flex-shrink-0 flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Interior AI
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Design your space with AI
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex-1 flex flex-col">
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
            className="flex-1 min-h-[200px] w-full p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <button
            type="submit"
            className="mt-4 w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Generate Design
          </button>
        </form>

        <div className="p-6 border-t border-zinc-200 dark:border-zinc-800">
          <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
            Quick Prompts
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              "Modern living room",
              "Minimalist bedroom",
              "Cozy reading nook",
              "Open kitchen",
            ].map((quickPrompt) => (
              <button
                key={quickPrompt}
                onClick={() => setPrompt(quickPrompt)}
                className="px-3 py-1.5 text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                {quickPrompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Canvas Area */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-between">
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
            Canvas Preview
          </h2>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
              Reset View
            </button>
            <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Export
            </button>
          </div>
        </div>
        
        <div className="flex-1 relative">
          <SceneCanvas />
          
          {/* Placeholder overlay when no design is generated */}
          {prompt === "" && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-zinc-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-zinc-500 dark:text-zinc-400">
                  Enter a prompt to generate your interior design
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
