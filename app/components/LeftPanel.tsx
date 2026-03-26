"use client";

import { useState } from "react";
import { RoomConfig, FurnitureItem } from "@/app/config/sceneConfig";
import DesignTab from "./DesignTab";
import RoomSettingsTab from "./RoomSettingsTab";
import ObjectSettingsTab from "./ObjectSettingsTab";

interface LeftPanelProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  lastUpdate: string;
  onSubmit: (prompt: string) => void;
  roomConfig: RoomConfig;
  onRoomConfigChange: (config: RoomConfig) => void;
  objects: FurnitureItem[];
  onObjectsChange: (objects: FurnitureItem[]) => void;
}

export default function LeftPanel({
  prompt,
  setPrompt,
  isGenerating,
  lastUpdate,
  onSubmit,
  roomConfig,
  onRoomConfigChange,
  objects,
  onObjectsChange,
}: LeftPanelProps) {
  const [activeTab, setActiveTab] = useState<'design' | 'room' | 'objects'>('design');

  return (
    <div className="w-full md:w-[400px] flex-shrink-0 flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-y-auto max-h-screen">
      <div className="p-4 md:p-6 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Interior AI
        </h1>
        <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Design your space with AI
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => setActiveTab('design')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'design'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-zinc-500 hover:text-zinc-700'
          }`}
        >
          Design
        </button>
        <button
          onClick={() => setActiveTab('room')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'room'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-zinc-500 hover:text-zinc-700'
          }`}
        >
          Room Settings
        </button>
        <button
          onClick={() => setActiveTab('objects')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'objects'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-zinc-500 hover:text-zinc-700'
          }`}
        >
          Objects
        </button>
      </div>

      {activeTab === 'design' ? (
        <DesignTab
          prompt={prompt}
          setPrompt={setPrompt}
          isGenerating={isGenerating}
          lastUpdate={lastUpdate}
          onSubmit={onSubmit}
        />
      ) : activeTab === 'room' ? (
        <RoomSettingsTab
          roomConfig={roomConfig}
          onRoomConfigChange={onRoomConfigChange}
        />
      ) : (
        <ObjectSettingsTab
          objects={objects}
          onObjectsChange={onObjectsChange}
          roomWidth={roomConfig.width}
          roomDepth={roomConfig.depth}
        />
      )}
    </div>
  );
}
