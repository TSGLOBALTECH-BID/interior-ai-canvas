"use client";

import { FurnitureItem } from "@/app/config/sceneConfig";

type WallSide = 'front' | 'back' | 'left' | 'right';
type TVSize = 'small' | 'medium' | 'large';
type TVVariant = 'console' | 'wall-mount' | 'retro' | 'modern' | 'gaming';
type SofaVariant = 'traditional' | 'modern' | 'chaise' | 'loveseat';

interface ObjectSettingsTabProps {
  objects: FurnitureItem[];
  onObjectsChange: (objects: FurnitureItem[]) => void;
  roomWidth: number;
  roomDepth: number;
}

const WALL_OPTIONS: { value: WallSide; label: string }[] = [
  { value: 'back', label: 'Back Wall' },
  { value: 'front', label: 'Front Wall' },
  { value: 'left', label: 'Left Wall' },
  { value: 'right', label: 'Right Wall' },
];

const TV_SIZE_OPTIONS: { value: TVSize; label: string; width: number; height: number }[] = [
  { value: 'small', label: 'Small (32")', width: 1.2, height: 0.8 },
  { value: 'medium', label: 'Medium (50")', width: 1.8, height: 1.1 },
  { value: 'large', label: 'Large (65")', width: 2.4, height: 1.4 },
];

const TV_VARIANT_OPTIONS: { value: TVVariant; label: string; description: string }[] = [
  { value: 'console', label: 'Console', description: 'Traditional TV with wooden console stand' },
  { value: 'wall-mount', label: 'Wall Mount', description: 'Sleek wall-mounted TV' },
  { value: 'retro', label: 'Retro', description: 'Classic vintage TV style with antennas' },
  { value: 'modern', label: 'Modern', description: 'Minimalist design with metal stand' },
  { value: 'gaming', label: 'Gaming', description: 'Curved screen with RGB lighting' },
];

const SOFA_VARIANT_OPTIONS: { value: SofaVariant; label: string; description: string }[] = [
  { value: 'traditional', label: 'Traditional', description: 'Classic sofa with armrests and back cushions' },
  { value: 'modern', label: 'Modern', description: 'Sleek minimalist design with thin profile' },
  { value: 'chaise', label: 'Chaise', description: 'Comfortable chaise lounge for relaxation' },
  { value: 'loveseat', label: 'Loveseat', description: 'Compact two-person sofa' },
];

const FRAME_COLORS = [
  { value: '#1a1a1a', label: 'Black' },
  { value: '#2d2d2d', label: 'Dark Gray' },
  { value: '#4a4a4a', label: 'Gray' },
  { value: '#f5f5f5', label: 'White' },
  { value: '#8b7355', label: 'Wood' },
  { value: '#c0c0c0', label: 'Silver' },
];

const STAND_COLORS = [
  { value: '#5c4033', label: 'Brown' },
  { value: '#3d3d3d', label: 'Dark Gray' },
  { value: '#8b7355', label: 'Light Brown' },
  { value: '#1a1a1a', label: 'Black' },
  { value: '#f5f5f5', label: 'White' },
  { value: '#c0c0c0', label: 'Silver' },
];

const SOFA_COLORS = [
  { value: '#d4c4b0', label: 'Beige' },
  { value: '#8b7355', label: 'Brown' },
  { value: '#4a4a4a', label: 'Gray' },
  { value: '#1a1a1a', label: 'Black' },
  { value: '#f5f5f5', label: 'White' },
  { value: '#7c3aed', label: 'Purple' },
  { value: '#dc2626', label: 'Red' },
  { value: '#059669', label: 'Green' },
];

const SOFA_CUSHION_COLORS = [
  { value: '#e8dcc8', label: 'Cream' },
  { value: '#f5f5f5', label: 'White' },
  { value: '#d1d5db', label: 'Light Gray' },
  { value: '#6b7280', label: 'Gray' },
  { value: '#1a1a1a', label: 'Black' },
  { value: '#7c3aed', label: 'Purple' },
  { value: '#dc2626', label: 'Red' },
  { value: '#059669', label: 'Green' },
];

const SOFA_LEG_COLORS = [
  { value: '#5c4033', label: 'Wood' },
  { value: '#3d3d3d', label: 'Dark Gray' },
  { value: '#1a1a1a', label: 'Black' },
  { value: '#f5f5f5', label: 'White' },
  { value: '#c0c0c0', label: 'Metal' },
];

const LSHAPE_SOFA_SIZE_OPTIONS: { value: 'small' | 'medium' | 'large'; label: string; description: string }[] = [
  { value: 'small', label: 'Small (3x2)', description: 'Compact L-shaped sofa for smaller spaces' },
  { value: 'medium', label: 'Medium (3x3)', description: 'Standard L-shaped sofa with balanced dimensions' },
  { value: 'large', label: 'Large (4x4)', description: 'Spacious L-shaped sofa for larger areas' },
];

export default function ObjectSettingsTab({
  objects,
  onObjectsChange,
  roomWidth,
  roomDepth,
}: ObjectSettingsTabProps) {
  // Find TV panel in objects
  const tvPanel = objects.find(obj => obj.type === 'tvpanel');

  // Find sofa in objects
  const sofa = objects.find(obj => obj.type === 'sofa');

  // Find L-shaped sofa in objects
  const lShapeSofa = objects.find(obj => obj.type === 'lshapesofa');
  
  // Calculate wall position based on wall side
  const getWallPosition = (wallSide: WallSide): { x: number; z: number; rotation: number } => {
    const wallOffset = 0.3; // Distance from wall
    switch (wallSide) {
      case 'back':
        return { x: 0, z: roomDepth / 2 - wallOffset, rotation: 0 };
      case 'front':
        return { x: 0, z: -roomDepth / 2 + wallOffset, rotation: Math.PI };
      case 'left':
        return { x: -roomWidth / 2 + wallOffset, z: 0, rotation: -Math.PI / 2 };
      case 'right':
        return { x: roomWidth / 2 - wallOffset, z: 0, rotation: Math.PI / 2 };
    }
  };

  // Get current wall side from position
  const getCurrentWallSide = (): WallSide => {
    if (!tvPanel) return 'back';
    const { z } = tvPanel.position;
    if (z > 0 && z === roomDepth / 2 - 0.3) return 'back';
    if (z < 0 && z === -roomDepth / 2 + 0.3) return 'front';
    if (tvPanel.position.x < 0) return 'left';
    if (tvPanel.position.x > 0) return 'right';
    return 'back';
  };

  const handleTVPanelToggle = (enabled: boolean) => {
    if (enabled) {
      // Add TV panel if not present
      const wallSide = getCurrentWallSide();
      const wallPos = getWallPosition(wallSide);
      const newTVPanel: FurnitureItem = {
        id: 'tvpanel-1',
        type: 'tvpanel',
        position: { x: wallPos.x, y: 0, z: wallPos.z },
        rotation: { x: 0, y: wallPos.rotation, z: 0 },
        properties: {
          frameColor: '#1a1a1a',
          screenColor: '#0a0a0a',
          standColor: '#5c4033',
          tvSize: 'medium',
          variant: 'console',
        },
      };
      onObjectsChange([...objects.filter(obj => obj.type !== 'tvpanel'), newTVPanel]);
    } else {
      // Remove TV panel
      onObjectsChange(objects.filter(obj => obj.type !== 'tvpanel'));
    }
  };

  const handleWallChange = (wallSide: WallSide) => {
    const wallPos = getWallPosition(wallSide);
    const updatedObjects = objects.map(obj => {
      if (obj.type === 'tvpanel') {
        return {
          ...obj,
          position: { ...obj.position, x: wallPos.x, z: wallPos.z },
          rotation: { x: 0, y: wallPos.rotation, z: 0 },
        };
      }
      return obj;
    });
    onObjectsChange(updatedObjects);
  };

  const handlePositionChange = (position: number) => {
    const wallSide = getCurrentWallSide();
    const maxPosition = wallSide === 'left' || wallSide === 'right' ? roomDepth / 2 - 1 : roomWidth / 2 - 1;
    const clampedPosition = Math.max(-maxPosition, Math.min(maxPosition, position));
    
    const updatedObjects = objects.map(obj => {
      if (obj.type === 'tvpanel') {
        if (wallSide === 'left' || wallSide === 'right') {
          return { ...obj, position: { ...obj.position, z: clampedPosition } };
        } else {
          return { ...obj, position: { ...obj.position, x: clampedPosition } };
        }
      }
      return obj;
    });
    onObjectsChange(updatedObjects);
  };

  const handleSizeChange = (size: TVSize) => {
    const updatedObjects = objects.map(obj => {
      if (obj.type === 'tvpanel') {
        return {
          ...obj,
          properties: { ...obj.properties, tvSize: size },
        };
      }
      return obj;
    });
    onObjectsChange(updatedObjects);
  };

  const handleFrameColorChange = (color: string) => {
    const updatedObjects = objects.map(obj => {
      if (obj.type === 'tvpanel') {
        return {
          ...obj,
          properties: { ...obj.properties, frameColor: color },
        };
      }
      return obj;
    });
    onObjectsChange(updatedObjects);
  };

  const handleStandColorChange = (color: string) => {
    const updatedObjects = objects.map(obj => {
      if (obj.type === 'tvpanel') {
        return {
          ...obj,
          properties: { ...obj.properties, standColor: color },
        };
      }
      return obj;
    });
    onObjectsChange(updatedObjects);
  };

  const handleVariantChange = (variant: TVVariant) => {
    const updatedObjects = objects.map(obj => {
      if (obj.type === 'tvpanel') {
        return {
          ...obj,
          properties: { ...obj.properties, variant },
        };
      }
      return obj;
    });
    onObjectsChange(updatedObjects);
  };

  const handleSofaToggle = (enabled: boolean) => {
    if (enabled) {
      // Add sofa if not present
      const newSofa: FurnitureItem = {
        id: 'sofa-1',
        type: 'sofa',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        properties: {
          color: '#d4c4b0',
          cushionColor: '#e8dcc8',
          legColor: '#5c4033',
          variant: 'traditional',
        },
      };
      onObjectsChange([...objects.filter(obj => obj.type !== 'sofa'), newSofa]);
    } else {
      // Remove sofa
      onObjectsChange(objects.filter(obj => obj.type !== 'sofa'));
    }
  };

  const handleSofaVariantChange = (variant: SofaVariant) => {
    const updatedObjects = objects.map(obj => {
      if (obj.type === 'sofa') {
        return {
          ...obj,
          properties: { ...obj.properties, variant },
        };
      }
      return obj;
    });
    onObjectsChange(updatedObjects);
  };

  const handleSofaColorChange = (color: string) => {
    const updatedObjects = objects.map(obj => {
      if (obj.type === 'sofa') {
        return {
          ...obj,
          properties: { ...obj.properties, color },
        };
      }
      return obj;
    });
    onObjectsChange(updatedObjects);
  };

  const handleSofaCushionColorChange = (color: string) => {
    const updatedObjects = objects.map(obj => {
      if (obj.type === 'sofa') {
        return {
          ...obj,
          properties: { ...obj.properties, cushionColor: color },
        };
      }
      return obj;
    });
    onObjectsChange(updatedObjects);
  };

  const handleSofaLegColorChange = (color: string) => {
    const updatedObjects = objects.map(obj => {
      if (obj.type === 'sofa') {
        return {
          ...obj,
          properties: { ...obj.properties, legColor: color },
        };
      }
      return obj;
    });
    onObjectsChange(updatedObjects);
  };



  const handleLShapeSofaToggle = (enabled: boolean) => {
    if (enabled) {
      // Add L-shaped sofa if not present - positioned at back-left corner
      const newLShapeSofa: FurnitureItem = {
        id: 'lshapesofa-1',
        type: 'lshapesofa',
        position: { x: -3, y: 0, z: 3 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        properties: {
          color: '#8b7355',
          cushionColor: '#e8dcc8',
          legColor: '#5c4033',
        },
      };
      onObjectsChange([...objects.filter(obj => obj.type !== 'lshapesofa'), newLShapeSofa]);
    } else {
      // Remove L-shaped sofa
      onObjectsChange(objects.filter(obj => obj.type !== 'lshapesofa'));
    }
  };

  const handleLShapeSofaColorChange = (color: string) => {
    const updatedObjects = objects.map(obj => {
      if (obj.type === 'lshapesofa') {
        return {
          ...obj,
          properties: { ...obj.properties, color },
        };
      }
      return obj;
    });
    onObjectsChange(updatedObjects);
  };

  const handleLShapeSofaCushionColorChange = (color: string) => {
    const updatedObjects = objects.map(obj => {
      if (obj.type === 'lshapesofa') {
        return {
          ...obj,
          properties: { ...obj.properties, cushionColor: color },
        };
      }
      return obj;
    });
    onObjectsChange(updatedObjects);
  };

  const handleLShapeSofaLegColorChange = (color: string) => {
    const updatedObjects = objects.map(obj => {
      if (obj.type === 'lshapesofa') {
        return {
          ...obj,
          properties: { ...obj.properties, legColor: color },
        };
      }
      return obj;
    });
    onObjectsChange(updatedObjects);
  };

  const handleLShapeSofaSizeChange = (size: 'small' | 'medium' | 'large') => {
    const updatedObjects = objects.map(obj => {
      if (obj.type === 'lshapesofa') {
        return {
          ...obj,
          properties: { ...obj.properties, size },
        };
      }
      return obj;
    });
    onObjectsChange(updatedObjects);
  };

  const handleLShapeSofaRotationChange = (rotation: number) => {
    const updatedObjects = objects.map(obj => {
      if (obj.type === 'lshapesofa') {
        return {
          ...obj,
          rotation: { x: 0, y: rotation, z: 0 },
        };
      }
      return obj;
    });
    onObjectsChange(updatedObjects);
  };

  const currentWallSide = getCurrentWallSide();
  const currentPosition = currentWallSide === 'left' || currentWallSide === 'right'
    ? tvPanel?.position.z || 0
    : tvPanel?.position.x || 0;
  const currentSize = (tvPanel?.properties?.tvSize as TVSize) || 'medium';
  const currentFrameColor = (tvPanel?.properties?.frameColor as string) || '#1a1a1a';
  const currentStandColor = (tvPanel?.properties?.standColor as string) || '#5c4033';
  const currentVariant = (tvPanel?.properties?.variant as TVVariant) || 'console';

  const currentSofaVariant = (sofa?.properties?.variant as SofaVariant) || 'traditional';
  const currentSofaColor = (sofa?.properties?.color as string) || '#d4c4b0';
  const currentSofaCushionColor = (sofa?.properties?.cushionColor as string) || '#e8dcc8';
  const currentSofaLegColor = (sofa?.properties?.legColor as string) || '#5c4033';

  const currentLShapeSofaColor = (lShapeSofa?.properties?.color as string) || '#8b7355';
  const currentLShapeSofaCushionColor = (lShapeSofa?.properties?.cushionColor as string) || '#e8dcc8';
  const currentLShapeSofaLegColor = (lShapeSofa?.properties?.legColor as string) || '#5c4033';
  const currentLShapeSofaSize = (lShapeSofa?.properties?.size as 'small' | 'medium' | 'large') || 'medium';
  const currentLShapeSofaRotation = (lShapeSofa?.rotation?.y as number) || Math.PI / 2;
  const currentSofaRotation = (sofa?.rotation?.y as number) || 0;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* TV Panel Enable/Disable */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          TV Panel
        </label>
        <button
          onClick={() => handleTVPanelToggle(!tvPanel)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            tvPanel ? 'bg-blue-600' : 'bg-zinc-300 dark:bg-zinc-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              tvPanel ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {tvPanel && (
        <>
          {/* Wall Selection */}
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
              Wall
            </label>
            <select
              value={currentWallSide}
              onChange={(e) => handleWallChange(e.target.value as WallSide)}
              className="w-full p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm"
            >
              {WALL_OPTIONS.map((wall) => (
                <option key={wall.value} value={wall.value}>
                  {wall.label}
                </option>
              ))}
            </select>
          </div>

          {/* Position on Wall */}
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
              Position on Wall
            </label>
            <input
              type="range"
              min={-Math.max(roomWidth, roomDepth) / 2 + 1}
              max={Math.max(roomWidth, roomDepth) / 2 - 1}
              step={0.1}
              value={currentPosition}
              onChange={(e) => handlePositionChange(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-zinc-500 mt-1">
              <span>Left</span>
              <span>Center ({currentPosition.toFixed(1)})</span>
              <span>Right</span>
            </div>
          </div>

          {/* TV Size */}
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
              TV Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {TV_SIZE_OPTIONS.map((size) => (
                <button
                  key={size.value}
                  onClick={() => handleSizeChange(size.value)}
                  className={`p-2 rounded-lg border text-xs font-medium transition-colors ${
                    currentSize === size.value
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900 text-blue-600'
                      : 'border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          {/* TV Variant */}
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
              TV Style
            </label>
            <div className="grid grid-cols-1 gap-2">
              {TV_VARIANT_OPTIONS.map((variant) => (
                <button
                  key={variant.value}
                  onClick={() => handleVariantChange(variant.value)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    currentVariant === variant.value
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900 text-blue-600'
                      : 'border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300'
                  }`}
                >
                  <div className="font-medium text-sm">{variant.label}</div>
                  <div className="text-xs opacity-75 mt-1">{variant.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Frame Color */}
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
              Frame Color
            </label>
            <div className="flex flex-wrap gap-2">
              {FRAME_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleFrameColorChange(color.value)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    currentFrameColor === color.value
                      ? 'border-blue-600 scale-110'
                      : 'border-zinc-200 dark:border-zinc-700'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          {/* Stand Color */}
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
              Stand Color
            </label>
            <div className="flex flex-wrap gap-2">
              {STAND_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleStandColorChange(color.value)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    currentStandColor === color.value
                      ? 'border-blue-600 scale-110'
                      : 'border-zinc-200 dark:border-zinc-700'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Sofa Enable/Disable */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Sofa
        </label>
        <button
          onClick={() => handleSofaToggle(!sofa)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            sofa ? 'bg-blue-600' : 'bg-zinc-300 dark:bg-zinc-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              sofa ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {sofa && (
        <>
          {/* Sofa Variant */}
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
              Sofa Style
            </label>
            <div className="grid grid-cols-1 gap-2">
              {SOFA_VARIANT_OPTIONS.map((variant) => (
                <button
                  key={variant.value}
                  onClick={() => handleSofaVariantChange(variant.value)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    currentSofaVariant === variant.value
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900 text-blue-600'
                      : 'border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300'
                  }`}
                >
                  <div className="font-medium text-sm">{variant.label}</div>
                  <div className="text-xs opacity-75 mt-1">{variant.description}</div>
                </button>
              ))}
            </div>
          </div>



          {/* Sofa Frame Color */}
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
              Sofa Color
            </label>
            <div className="flex flex-wrap gap-2">
              {SOFA_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleSofaColorChange(color.value)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    currentSofaColor === color.value
                      ? 'border-blue-600 scale-110'
                      : 'border-zinc-200 dark:border-zinc-700'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          {/* Sofa Cushion Color */}
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
              Cushion Color
            </label>
            <div className="flex flex-wrap gap-2">
              {SOFA_CUSHION_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleSofaCushionColorChange(color.value)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    currentSofaCushionColor === color.value
                      ? 'border-blue-600 scale-110'
                      : 'border-zinc-200 dark:border-zinc-700'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          {/* Sofa Leg Color */}
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
              Leg Color
            </label>
            <div className="flex flex-wrap gap-2">
              {SOFA_LEG_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleSofaLegColorChange(color.value)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    currentSofaLegColor === color.value
                      ? 'border-blue-600 scale-110'
                      : 'border-zinc-200 dark:border-zinc-700'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* L-Shaped Sofa Enable/Disable */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          L-Shaped Sofa
        </label>
        <button
          onClick={() => handleLShapeSofaToggle(!lShapeSofa)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            lShapeSofa ? 'bg-blue-600' : 'bg-zinc-300 dark:bg-zinc-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              lShapeSofa ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {lShapeSofa && (
        <>
          {/* L-Shaped Sofa Size */}
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
              Size
            </label>
            <div className="grid grid-cols-1 gap-2">
              {LSHAPE_SOFA_SIZE_OPTIONS.map((size) => (
                <button
                  key={size.value}
                  onClick={() => handleLShapeSofaSizeChange(size.value)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    currentLShapeSofaSize === size.value
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900 text-blue-600'
                      : 'border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300'
                  }`}
                >
                  <div className="font-medium text-sm">{size.label}</div>
                  <div className="text-xs opacity-75 mt-1">{size.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* L-Shaped Sofa Rotation */}
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
              Rotation
            </label>
            <input
              type="range"
              min={0}
              max={Math.PI * 2}
              step={Math.PI / 4}
              value={currentLShapeSofaRotation}
              onChange={(e) => handleLShapeSofaRotationChange(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-zinc-500 mt-1">
              <span>0°</span>
              <span>{(currentLShapeSofaRotation * 180 / Math.PI).toFixed(0)}°</span>
              <span>360°</span>
            </div>
          </div>

          {/* L-Shaped Sofa Frame Color */}
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
              L-Shaped Sofa Color
            </label>
            <div className="flex flex-wrap gap-2">
              {SOFA_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleLShapeSofaColorChange(color.value)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    currentLShapeSofaColor === color.value
                      ? 'border-blue-600 scale-110'
                      : 'border-zinc-200 dark:border-zinc-700'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          {/* L-Shaped Sofa Cushion Color */}
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
              Cushion Color
            </label>
            <div className="flex flex-wrap gap-2">
              {SOFA_CUSHION_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleLShapeSofaCushionColorChange(color.value)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    currentLShapeSofaCushionColor === color.value
                      ? 'border-blue-600 scale-110'
                      : 'border-zinc-200 dark:border-zinc-700'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          {/* L-Shaped Sofa Leg Color */}
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
              Leg Color
            </label>
            <div className="flex flex-wrap gap-2">
              {SOFA_LEG_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleLShapeSofaLegColorChange(color.value)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    currentLShapeSofaLegColor === color.value
                      ? 'border-blue-600 scale-110'
                      : 'border-zinc-200 dark:border-zinc-700'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Placeholder for future objects */}
      {!tvPanel && !sofa && !lShapeSofa && (
        <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
          <p className="text-sm">Enable TV Panel, Sofa, or L-Shaped Sofa to configure their settings</p>
        </div>
      )}
    </div>
  );
}
