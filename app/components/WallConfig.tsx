"use client";

import { WallSegmentConfig, WindowConfig, DoorConfig } from "@/app/config/sceneConfig";

type WallSide = 'front' | 'back' | 'left' | 'right';

interface WallConfigProps {
  side: WallSide;
  label: string;
  wallConfig?: WallSegmentConfig;
  onWindowToggle: (hasWindow: boolean) => void;
  onDoorToggle: (hasDoor: boolean) => void;
  onWindowConfigChange: (config: Partial<WindowConfig>) => void;
  onDoorConfigChange: (config: Partial<DoorConfig>) => void;
}

export default function WallConfig({
  side,
  label,
  wallConfig,
  onWindowToggle,
  onDoorToggle,
  onWindowConfigChange,
  onDoorConfigChange,
}: WallConfigProps) {
  return (
    <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {label} Wall
        </span>
        <div className="flex gap-2">
          <label className="flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-400">
            <input
              type="checkbox"
              checked={wallConfig?.hasWindow || false}
              onChange={(e) => onWindowToggle(e.target.checked)}
              className="rounded"
            />
            Window
          </label>
          <label className="flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-400">
            <input
              type="checkbox"
              checked={wallConfig?.hasDoor || false}
              onChange={(e) => onDoorToggle(e.target.checked)}
              className="rounded"
            />
            Door
          </label>
        </div>
      </div>
      
      {/* Window Config */}
      {wallConfig?.hasWindow && wallConfig.windowConfig && (
        <div className="mt-2 pl-3 border-l-2 border-zinc-300 dark:border-zinc-600 space-y-2">
          <p className="text-xs font-medium text-zinc-500">Window Settings</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-zinc-500 dark:text-zinc-400">Position (0-1)</label>
              <input
                type="number"
                step="0.1"
                min={0}
                max={1}
                value={wallConfig.windowConfig.position.x}
                onChange={(e) => onWindowConfigChange({ position: { ...wallConfig.windowConfig!.position, x: Number(e.target.value) } })}
                className="w-full p-1.5 text-xs rounded border border-zinc-200 dark:border-zinc-700"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 dark:text-zinc-400">Width (m)</label>
              <input
                type="number"
                step="0.1"
                min={0.5}
                max={5}
                value={wallConfig.windowConfig.width}
                onChange={(e) => onWindowConfigChange({ width: Number(e.target.value) })}
                className="w-full p-1.5 text-xs rounded border border-zinc-200 dark:border-zinc-700"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 dark:text-zinc-400">Height (m)</label>
              <input
                type="number"
                step="0.1"
                min={0.5}
                max={3}
                value={wallConfig.windowConfig.height}
                onChange={(e) => onWindowConfigChange({ height: Number(e.target.value) })}
                className="w-full p-1.5 text-xs rounded border border-zinc-200 dark:border-zinc-700"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Door Config */}
      {wallConfig?.hasDoor && wallConfig.doorConfig && (
        <div className="mt-2 pl-3 border-l-2 border-zinc-300 dark:border-zinc-600 space-y-2">
          <p className="text-xs font-medium text-zinc-500">Door Settings</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-zinc-500 dark:text-zinc-400">Position (0-1)</label>
              <input
                type="number"
                step="0.1"
                min={0}
                max={1}
                value={wallConfig.doorConfig.position.x}
                onChange={(e) => onDoorConfigChange({ position: { ...wallConfig.doorConfig!.position, x: Number(e.target.value) } })}
                className="w-full p-1.5 text-xs rounded border border-zinc-200 dark:border-zinc-700"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 dark:text-zinc-400">Width (m)</label>
              <input
                type="number"
                step="0.1"
                min={0.5}
                max={2}
                value={wallConfig.doorConfig.width}
                onChange={(e) => onDoorConfigChange({ width: Number(e.target.value) })}
                className="w-full p-1.5 text-xs rounded border border-zinc-200 dark:border-zinc-700"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 dark:text-zinc-400">Height (m)</label>
              <input
                type="number"
                step="0.1"
                min={1}
                max={3}
                value={wallConfig.doorConfig.height}
                onChange={(e) => onDoorConfigChange({ height: Number(e.target.value) })}
                className="w-full p-1.5 text-xs rounded border border-zinc-200 dark:border-zinc-700"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 dark:text-zinc-400">Swing</label>
              <select
                value={wallConfig.doorConfig.swingDirection}
                onChange={(e) => onDoorConfigChange({ swingDirection: e.target.value as 'left' | 'right' })}
                className="w-full p-1.5 text-xs rounded border border-zinc-200 dark:border-zinc-700"
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
