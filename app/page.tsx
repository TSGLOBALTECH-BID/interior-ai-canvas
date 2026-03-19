"use client";

import { useState, useCallback } from "react";
import SceneCanvas from "./components/SceneCanvas";
import { SceneConfig, defaultSceneConfig } from "./config/sceneConfig";

// Create an empty initial config (no furniture) for the canvas
const emptySceneConfig: SceneConfig = {
  ...defaultSceneConfig,
  furniture: [],
  walls: {
    ...defaultSceneConfig.walls,
    enabled: false,
  },
  grid: {
    ...defaultSceneConfig.grid,
    enabled: true,
  },
};

// Simplified canvas JSON format for AI communication
interface CanvasJSON {
  room: {
    width: number;
    depth: number;
    floorMaterial: string;
  };
  objects: Array<{
    id: string;
    type: string;
    position: [number, number, number];
    rotation: number;
    color: string;
  }>;
}

// Convert SceneConfig to simplified CanvasJSON for AI
function sceneConfigToCanvasJSON(config: SceneConfig): CanvasJSON {
  return {
    room: {
      width: config.floor.size.width,
      depth: config.floor.size.depth,
      floorMaterial: config.floor.material.color,
    },
    objects: config.furniture?.map((item) => ({
      id: item.id,
      type: item.type,
      position: [item.position.x, item.position.y, item.position.z] as [number, number, number],
      rotation: item.rotation?.y || 0,
      color: (item.properties as { color?: string })?.color || '#ffffff',
    }))||[],
  };
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [sceneConfig, setSceneConfig] = useState<SceneConfig>(defaultSceneConfig);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [hasStartedDesign, setHasStartedDesign] = useState(true);

  const handleSceneUpdate = useCallback(async (newPrompt: string) => {
    if (!newPrompt.trim()) return;
    
    setIsGenerating(true);
    setHasStartedDesign(true);
    
    try {
      // Convert current scene config to simplified canvas JSON for AI
      const currentCanvasJSON = sceneConfigToCanvasJSON(sceneConfig);
      
      console.log('Sending current canvas JSON to AI:', JSON.stringify(currentCanvasJSON, null, 2));
      
      const response = await fetch('/api/scene', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: newPrompt,
          currentConfig: currentCanvasJSON,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate scene');
      }

      const data = await response.json();
      console.log('API data:',JSON.stringify(data))
      
      if (data.success && data.updates) {
        console.log('Received updates from API:', JSON.stringify(data.updates, null, 2));
        // Apply partial updates to the scene config
        setSceneConfig(prevConfig => ({
          ...prevConfig,
          ...data.updates,
          // Deep merge for nested objects
          furniture: data.updates.furniture || prevConfig.furniture,
          floor: data.updates.floor || prevConfig.floor,
          walls: data.updates.walls || prevConfig.walls,
          background: data.updates.background || prevConfig.background,
        }));
        setLastUpdate(new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error('Error generating scene:', error);
      alert('Failed to generate scene. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [sceneConfig]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSceneUpdate(prompt);
  };

  const handleQuickPrompt = (quickPrompt: string) => {
    setPrompt(quickPrompt);
    handleSceneUpdate(quickPrompt);
  };

  const handleResetView = () => {
    // Reset to default room config with walls and furniture
    setSceneConfig(defaultSceneConfig);
    setLastUpdate("");
    setPrompt("");
  };

  const handleExportConfig = () => {
    // Export current scene config as JSON
    const configJSON = JSON.stringify(sceneConfig, null, 2);
    const blob = new Blob([configJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scene-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-zinc-100 dark:bg-zinc-900">
      {/* Left Panel - Prompt Input */}
      <div className="w-full md:w-[400px] flex-shrink-0 flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="p-4 md:p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h1 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Interior AI
          </h1>
          <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Design your space with AI
          </p>
        </div>

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
            {[
              "Modern living room with gray sofa",
              "Cozy reading nook with warm colors",
              "Minimalist bedroom with white theme",
              "Dark moody living room",
            ].map((quickPrompt) => (
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

        {/* Current Config Status */}
        {lastUpdate && (
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
            <p className="text-xs text-zinc-500">
              Last updated: {lastUpdate}
            </p>
          </div>
        )}
      </div>

      {/* Right Panel - Canvas Area */}
      <div className="flex-1 flex flex-col">
        <div className="p-3 md:p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-between gap-2 md:gap-0">
          <h2 className="text-base md:text-lg font-medium text-zinc-900 dark:text-zinc-100">
            Canvas Preview
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={handleResetView}
              className="px-2.5 md:px-3 py-1.5 text-xs md:text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              Reset View
            </button>
            <button 
              onClick={handleExportConfig}
              className="px-2.5 md:px-3 py-1.5 text-xs md:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Export
            </button>
          </div>
        </div>
        
        <div className="md:flex-1 h-[50vh] md:h-auto relative">
          <SceneCanvas config={sceneConfig} isEmpty={!hasStartedDesign} />
        </div>
      </div>
    </div>
  );
}
