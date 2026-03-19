"use client";

import SceneCanvas from "./SceneCanvas";
import { SceneConfig, RoomDesign } from "@/app/config/sceneConfig";

interface RightPanelProps {
  sceneConfig: SceneConfig;
  roomDesign: RoomDesign;
  hasStartedDesign: boolean;
  onResetView: () => void;
  onExportConfig: () => void;
}

export default function RightPanel({
  sceneConfig,
  roomDesign,
  hasStartedDesign,
  onResetView,
  onExportConfig,
}: RightPanelProps) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="p-3 md:p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-between gap-2 md:gap-0">
        <h2 className="text-base md:text-lg font-medium text-zinc-900 dark:text-zinc-100">
          Canvas Preview
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={onResetView}
            className="px-2.5 md:px-3 py-1.5 text-xs md:text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            Reset View
          </button>
          <button 
            onClick={onExportConfig}
            className="px-2.5 md:px-3 py-1.5 text-xs md:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Export
          </button>
        </div>
      </div>
      
      <div className="md:flex-1 h-[50vh] md:h-auto relative">
        <SceneCanvas config={roomDesign} isEmpty={!hasStartedDesign} />
      </div>
    </div>
  );
}
