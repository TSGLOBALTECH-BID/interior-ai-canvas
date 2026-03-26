"use client";

import { useState, useCallback } from "react";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";
import { SceneConfig, RoomConfig, RoomDesign, WallSegmentConfig, defaultSceneConfig, defaultRoomConfig } from "./config/sceneConfig";

// Helper function to recalculate wall positions when room dimensions change
function recalculateWallPositions(roomConfig: RoomConfig, prevWidth?: number, prevDepth?: number): RoomConfig {
  const newWidth = roomConfig.width;
  const newDepth = roomConfig.depth;
  const oldWidth = prevWidth || newWidth;
  const oldDepth = prevDepth || newDepth;

  // If dimensions haven't changed, return as-is
  if (newWidth === oldWidth && newDepth === oldDepth) {
    return roomConfig;
  }

  // Calculate scale factors
  const widthScale = newWidth / oldWidth;
  const depthScale = newDepth / oldDepth;

  // Recalculate window and door positions for each wall
  const recalculatedWalls = roomConfig.walls.map((wall: WallSegmentConfig) => {
    const newWall = { ...wall };
    
    // Recalculate window position
    if (newWall.hasWindow && newWall.windowConfig) {
      newWall.windowConfig = {
        ...newWall.windowConfig,
        position: {
          ...newWall.windowConfig.position,
          // Scale position proportionally
          x: newWall.windowConfig.position.x * (wall.side === 'left' || wall.side === 'right' ? depthScale : widthScale),
        },
      };
    }

    // Recalculate door position
    if (newWall.hasDoor && newWall.doorConfig) {
      newWall.doorConfig = {
        ...newWall.doorConfig,
        position: {
          ...newWall.doorConfig.position,
          // Scale position proportionally
          x: newWall.doorConfig.position.x * (wall.side === 'left' || wall.side === 'right' ? depthScale : widthScale),
        },
      };
    }

    return newWall;
  });

  return {
    ...roomConfig,
    walls: recalculatedWalls,
  };
}

// Create an empty initial room design (no furniture) for the canvas
const emptyRoomDesign: RoomDesign = {
  room: {
    ...defaultSceneConfig.roomDesign.room,
    enabled: false,
  } as RoomConfig,
  objects: [],
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

// Convert RoomDesign to simplified CanvasJSON for AI
function roomDesignToCanvasJSON(roomDesign: RoomDesign): CanvasJSON {
  const room = roomDesign.room || defaultRoomConfig;
  return {
    room: {
      width: room.width,
      depth: room.depth,
      floorMaterial: defaultSceneConfig.floor.material.color,
    },
    objects: roomDesign.objects?.map((item) => ({
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

  const roomConfig = sceneConfig.roomDesign.room as RoomConfig;

  const handleRoomConfigChange = useCallback((newRoomConfig: RoomConfig) => {
    console.log('newRoomConfig-',newRoomConfig);
    setSceneConfig(prevConfig => {
      // Get previous dimensions for recalculation
      const prevRoom = prevConfig.roomDesign.room;
      const prevWidth = prevRoom?.width || 10;
      const prevDepth = prevRoom?.depth || 10;

      // Recalculate wall positions based on new dimensions
      const recalculatedRoom = recalculateWallPositions(newRoomConfig, prevWidth, prevDepth);

      return {
        ...prevConfig,
        roomDesign: {
          ...prevConfig.roomDesign,
          room: {
            ...recalculatedRoom,
            enabled: true, // Always enable walls when room settings change
          },
        },
        floor: {
          ...prevConfig.floor,
          size: {
            width: newRoomConfig.width,
            depth: newRoomConfig.depth,
          },
        },
      };
    });
  }, []);

  const handleSceneUpdate = useCallback(async (newPrompt: string) => {
    if (!newPrompt.trim()) return;
    
    setIsGenerating(true);
    setHasStartedDesign(true);
    
    try {
      // Convert current room design to simplified canvas JSON for AI
      const currentCanvasJSON = roomDesignToCanvasJSON(sceneConfig.roomDesign);
      
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
          roomDesign: {
            ...prevConfig.roomDesign,
            ...data.updates.roomDesign,
            objects: data.updates.roomDesign?.objects || prevConfig.roomDesign.objects,
          },
          floor: data.updates.floor || prevConfig.floor,
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
      <LeftPanel
        prompt={prompt}
        setPrompt={setPrompt}
        isGenerating={isGenerating}
        lastUpdate={lastUpdate}
        onSubmit={handleSceneUpdate}
        roomConfig={roomConfig}
        onRoomConfigChange={handleRoomConfigChange}
        objects={sceneConfig.roomDesign.objects || []}
        onObjectsChange={(newObjects) => {
          setSceneConfig(prevConfig => ({
            ...prevConfig,
            roomDesign: {
              ...prevConfig.roomDesign,
              objects: newObjects,
            },
          }));
        }}
      />

      {/* Right Panel - Canvas Area */}
      <RightPanel
        sceneConfig={sceneConfig}
        roomDesign={sceneConfig.roomDesign}
        hasStartedDesign={hasStartedDesign}
        onResetView={handleResetView}
        onExportConfig={handleExportConfig}
      />
    </div>
  );
}
