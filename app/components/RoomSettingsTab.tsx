"use client";

import { RoomConfig, WallSegmentConfig, WindowConfig, DoorConfig } from "@/app/config/sceneConfig";
import WallConfig from "./WallConfig";

type RoomType = 'rectangular' | 'square' | 'L-shaped' | 'open-plan';
type RoomPreset = 'bedroom' | 'living-room' | 'bathroom' | 'kitchen' | 'office' | 'custom';
type WallSide = 'front' | 'back' | 'left' | 'right';

interface RoomSettingsTabProps {
  roomConfig: RoomConfig;
  onRoomConfigChange: (config: RoomConfig) => void;
}

// Room type presets with realistic dimensions
const ROOM_PRESETS: Record<RoomType, { width: number; depth: number; height: number }> = {
  rectangular: { width: 4, depth: 5, height: 2.8 },       // Standard bedroom/living room
  square: { width: 4, depth: 4, height: 2.8 },              // Small square room
  'L-shaped': { width: 6, depth: 6, height: 2.8 },          // L-shaped room
  'open-plan': { width: 8, depth: 6, height: 3 },           // Open plan area
};

// Room preset labels
const ROOM_TYPES: { value: RoomType; label: string }[] = [
  { value: 'rectangular', label: 'Rectangular' },
  { value: 'square', label: 'Square' },
  { value: 'L-shaped', label: 'L-Shaped' },
  { value: 'open-plan', label: 'Open Plan' },
];

const WALL_SIDES: { value: WallSide; label: string }[] = [
  { value: 'front', label: 'Front' },
  { value: 'back', label: 'Back' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
];

export default function RoomSettingsTab({
  roomConfig,
  onRoomConfigChange,
}: RoomSettingsTabProps) {
  const handleRoomTypeChange = (type: RoomType) => {
    const dimensions = ROOM_PRESETS[type];
    const wallLength = Math.max(dimensions.width, dimensions.depth);
    
    // Calculate appropriate window size based on wall length (1/4 to 1/3 of wall)
    const windowWidth = Math.min(1.2, wallLength / 3);
    const windowHeight = Math.min(1.2, dimensions.height * 0.5);
    
    // Calculate appropriate door size based on room height
    const doorWidth = 0.9; // Standard door width
    const doorHeight = Math.min(2.1, dimensions.height - 0.2); // Standard door height with clearance

    // Update walls with appropriate defaults
    const updatedWalls = roomConfig.walls.map((wall) => {
      const wallLen = wall.side === 'front' || wall.side === 'back' ? dimensions.width : dimensions.depth;
      return {
        ...wall,
        // Keep existing window/door config if already set, otherwise create new with scaled sizes
        windowConfig: wall.windowConfig ? {
          ...wall.windowConfig,
          width: Math.min(wall.windowConfig.width, wallLen / 2.5),
          height: Math.min(wall.windowConfig.height, dimensions.height * 0.5),
        } : undefined,
        doorConfig: wall.doorConfig ? {
          ...wall.doorConfig,
          width: Math.min(wall.doorConfig.width, 1.0),
          height: Math.min(wall.doorConfig.height, doorHeight),
        } : undefined,
      };
    });

    onRoomConfigChange({
      ...roomConfig,
      type,
      width: dimensions.width,
      depth: dimensions.depth,
      height: dimensions.height,
      walls: updatedWalls,
    });
  };

  const handleDimensionChange = (dimension: 'width' | 'depth' | 'height', value: number) => {
    // Scale windows/doors proportionally when dimensions change
    const updatedWalls = roomConfig.walls.map((wall) => ({
      ...wall,
      windowConfig: wall.windowConfig ? {
        ...wall.windowConfig,
        width: Math.min(wall.windowConfig.width, value / 2.5),
      } : undefined,
      doorConfig: wall.doorConfig ? {
        ...wall.doorConfig,
        height: Math.min(wall.doorConfig.height, dimension === 'height' ? value - 0.2 : wall.doorConfig.height),
      } : undefined,
    }));

    onRoomConfigChange({
      ...roomConfig,
      [dimension]: value,
      walls: updatedWalls,
    });
  };

  const getWallConfig = (side: WallSide): WallSegmentConfig | undefined => {
    return roomConfig.walls.find((w) => w.side === side);
  };

  const handleWallToggle = (side: WallSide, hasWindow: boolean, hasDoor: boolean) => {
    const wallLength = side === 'front' || side === 'back' ? roomConfig.width : roomConfig.depth;
    
    // Calculate appropriate window size based on wall length
    const windowWidth = Math.min(1.2, wallLength / 3);
    const windowHeight = Math.min(1.2, roomConfig.height * 0.5);
    
    // Calculate appropriate door size based on room height
    const doorHeight = Math.min(2.1, roomConfig.height - 0.2);

    const updatedWalls = roomConfig.walls.map((wall) => {
      if (wall.side === side) {
        return {
          ...wall,
          hasWindow,
          hasDoor,
          windowConfig: hasWindow ? (wall.windowConfig || createDefaultWindowConfig(side, windowWidth, windowHeight)) : undefined,
          doorConfig: hasDoor ? (wall.doorConfig || createDefaultDoorConfig(side, doorHeight)) : undefined,
        };
      }
      return wall;
    });
    onRoomConfigChange({
      ...roomConfig,
      walls: updatedWalls,
    });
  };

  const handleWindowConfigChange = (side: WallSide, windowConfig: Partial<WindowConfig>) => {
    const updatedWalls = roomConfig.walls.map((wall) => {
      if (wall.side === side && wall.windowConfig) {
        return {
          ...wall,
          windowConfig: { ...wall.windowConfig, ...windowConfig },
        };
      }
      return wall;
    });
    onRoomConfigChange({
      ...roomConfig,
      walls: updatedWalls,
    });
  };

  const handleDoorConfigChange = (side: WallSide, doorConfig: Partial<DoorConfig>) => {
    const updatedWalls = roomConfig.walls.map((wall) => {
      if (wall.side === side && wall.doorConfig) {
        return {
          ...wall,
          doorConfig: { ...wall.doorConfig, ...doorConfig },
        };
      }
      return wall;
    });
    onRoomConfigChange({
      ...roomConfig,
      walls: updatedWalls,
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Room Type */}
      <div>
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
          Room Type
        </label>
        <select
          value={roomConfig.type}
          onChange={(e) => handleRoomTypeChange(e.target.value as RoomType)}
          className="w-full p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm"
        >
          {ROOM_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Room Dimensions */}
      <div>
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
          Dimensions (meters)
        </label>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-zinc-500 dark:text-zinc-400 block mb-1">
              Width
            </label>
            <input
              type="number"
              value={roomConfig.width}
              onChange={(e) => handleDimensionChange('width', Number(e.target.value))}
              min={2}
              max={20}
              step={0.5}
              className="w-full p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 dark:text-zinc-400 block mb-1">
              Depth
            </label>
            <input
              type="number"
              value={roomConfig.depth}
              onChange={(e) => handleDimensionChange('depth', Number(e.target.value))}
              min={2}
              max={20}
              step={0.5}
              className="w-full p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 dark:text-zinc-400 block mb-1">
              Height
            </label>
            <input
              type="number"
              value={roomConfig.height}
              onChange={(e) => handleDimensionChange('height', Number(e.target.value))}
              min={2.4}
              max={5}
              step={0.1}
              className="w-full p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm"
            />
          </div>
        </div>
        <p className="text-xs text-zinc-500 mt-2">
          Typical room heights: 2.4m (minimum), 2.8m (standard), 3m+ (modern)
        </p>
      </div>

      {/* Wall Configuration */}
      <div>
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3 block">
          Wall Configuration
        </label>
        <div className="space-y-4">
          {WALL_SIDES.map((side) => (
            <WallConfig
              key={side.value}
              side={side.value}
              label={side.label}
              wallConfig={getWallConfig(side.value)}
              onWindowToggle={(hasWindow) => handleWallToggle(side.value, hasWindow, getWallConfig(side.value)?.hasDoor || false)}
              onDoorToggle={(hasDoor) => handleWallToggle(side.value, getWallConfig(side.value)?.hasWindow || false, hasDoor)}
              onWindowConfigChange={(config) => handleWindowConfigChange(side.value, config)}
              onDoorConfigChange={(config) => handleDoorConfigChange(side.value, config)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Create window config with realistic default sizes
function createDefaultWindowConfig(side: string, width: number = 1.0, height: number = 1.2): WindowConfig {
  return {
    id: `${side}-window`,
    position: { x: 0.5, y: 0, z: 0 },
    width,
    height,
    frameColor: '#5c4033',
    glassColor: 'rgba(200, 220, 255, 0.5)',
  };
}

// Create door config with realistic default sizes
function createDefaultDoorConfig(side: string, height: number = 2.1): DoorConfig {
  return {
    id: `${side}-door`,
    position: { x: 0.2, y: 0, z: 0 },
    width: 0.9,  // Standard door width (90cm)
    height,      // Based on room height
    swingDirection: 'right',
    frameColor: '#8B4513',
    doorColor: '#A0522D',
  };
}
