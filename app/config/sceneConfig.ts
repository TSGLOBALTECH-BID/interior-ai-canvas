/**
 * Scene Configuration Schema
 * This JSON object controls all aspects of the 3D scene rendering.
 * Update this configuration to dynamically change the scene.
 */

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Color {
  hex: string;
}

export interface CameraConfig {
  position: Vector3;
  fov: number;
  near: number;
  far: number;
}

export interface LightingConfig {
  ambient: {
    intensity: number;
    color: string;
  };
  main: {
    position: Vector3;
    intensity: number;
    color: string;
    castShadow: boolean;
    shadowMapSize: { width: number; height: number };
    shadowCamera: {
      far: number;
      left: number;
      right: number;
      top: number;
      bottom: number;
    };
  };
  fill: {
    position: Vector3;
    intensity: number;
    color: string;
  };
  hemisphere: {
    skyColor: string;
    groundColor: string;
    intensity: number;
  };
}

export interface FloorConfig {
  size: { width: number; depth: number };
  position: Vector3;
  material: {
    color: string;
    roughness: number;
    metalness: number;
  };
}

/**
 * Window configuration for room walls
 */
export interface WindowConfig {
  id: string;
  position: Vector3; // Position on the wall (0-1 normalized from wall start)
  width: number;
  height: number;
  frameColor?: string;
  glassColor: string;
}

/**
 * Door configuration for room walls
 */
export interface DoorConfig {
  id: string;
  position: Vector3; // Position on the wall (0-1 normalized from wall start)
  width: number;
  height: number;
  swingDirection: 'left' | 'right';
  frameColor?: string;
  doorColor?: string;
}

/**
 * Wall configuration for a single wall
 */
export interface WallSegmentConfig {
  id: string;
  side: 'front' | 'back' | 'left' | 'right';
  hasWindow: boolean;
  windowConfig?: WindowConfig;
  hasDoor: boolean;
  doorConfig?: DoorConfig;
}

/**
 * Room configuration for dynamic room generation
 */
export interface RoomConfig {
  enabled: boolean;
  type: 'rectangular' | 'square' | 'L-shaped' | 'open-plan';
  width: number;
  depth: number;
  height: number;
  thickness: number;
  material: {
    color: string;
    roughness: number;
  };
  baseboard: {
    color: string;
    height: number;
  };
  walls: WallSegmentConfig[];
}

/**
 * Furniture item configuration for objects
 */
export interface FurnitureItem {
  id: string;
  type: 'sofa' | 'table' | 'custom';
  position: Vector3;
  rotation?: Vector3;
  scale?: Vector3;
  properties?: Record<string, unknown>;
}

/**
 * CanvasJSON - Main JSON structure for canvas rendering
 * Has two parts: room (walls, floor) and objects (furniture)
 */
export interface CanvasJSON {
  room: RoomConfig;
  objects: FurnitureItem[];
  floor: FloorConfig;
  camera: CameraConfig;
  lighting: LightingConfig;
  background: {
    gradient: {
      from: string;
      to: string;
    };
  };
}

export interface GridConfig {
  enabled: boolean;
  size: number;
  divisions: number;
  cellSize: number;
  cellThickness: number;
  cellColor: string;
  sectionSize: number;
  sectionThickness: number;
  sectionColor: string;
  fadeDistance: number;
  fadeStrength: number;
}

export interface ControlsConfig {
  enablePan: boolean;
  enableZoom: boolean;
  enableRotate: boolean;
  minDistance: number;
  maxDistance: number;
  minPolarAngle: number;
  maxPolarAngle: number;
  target: Vector3;
}

// Legacy interface for backward compatibility
export interface SceneConfig {
  camera: CameraConfig;
  lighting: LightingConfig;
  floor: FloorConfig;
  walls: RoomConfig;
  grid: GridConfig;
  controls: ControlsConfig;
  furniture?: FurnitureItem[];
  background: {
    gradient: {
      from: string;
      to: string;
    };
  };
}

// Default Room Configuration with walls, windows, and doors
export const defaultRoomConfig: RoomConfig = {
  enabled: true,
  type: 'rectangular',
  width: 10,
  depth: 10,
  height: 4,
  thickness: 0.2,
  material: {
    color: '#f5f5f4',
    roughness: 0.9,
  },
  baseboard: {
    color: '#706c78',
    height: 0.1,
  },
  walls: [
    {
      id: 'front-wall',
      side: 'front',
      hasWindow: false,
      hasDoor: true,
      doorConfig: {
        id: 'front-door',
        position: { x: 0.7, y: 0, z: 0 },
        width: 1.2,
        height: 2.4,
        swingDirection: 'right',
        frameColor: '#11e577',
        doorColor: '#8b7355',
      },
    },
    {
      id: 'back-wall',
      side: 'back',
      hasWindow: true,
      windowConfig: {
        id: 'back-window',
        position: { x: 0.5, y: 0, z: 0 },
        width: 2,
        height: 1.8,
        frameColor: '#5c4033',
        glassColor: 'rgba(201, 223, 232, 0.5)',
      },
      hasDoor: false,
    },
    {
      id: 'left-wall',
      side: 'left',
      hasWindow: true,
      windowConfig: {
        id: 'left-window',
        position: { x: 0.5, y: 0, z: 0 },
        width: 1.5,
        height: 1.8,
        frameColor: '#5c4033',
        glassColor: '#87ceeb',
      },
      hasDoor: false,
    },
    {
      id: 'right-wall',
      side: 'right',
      hasWindow: false,
      hasDoor: false,
    },
  ],
};

// Default Scene Configuration
export const defaultSceneConfig: SceneConfig = {
  camera: {
    position: { x: 8, y: 6, z: 8 },
    fov: 50,
    near: 0.1,
    far: 1000,
  },
  lighting: {
    ambient: {
      intensity: 0.4,
      color: '#ffffff',
    },
    main: {
      position: { x: 10, y: 15, z: 10 },
      intensity: 1.2,
      color: '#ffffff',
      castShadow: true,
      shadowMapSize: { width: 2048, height: 2048 },
      shadowCamera: {
        far: 50,
        left: -10,
        right: 10,
        top: 10,
        bottom: -10,
      },
    },
    fill: {
      position: { x: -5, y: 8, z: -5 },
      intensity: 0.5,
      color: '#e0e7ff',
    },
    hemisphere: {
      skyColor: '#87ceeb',
      groundColor: '#8b7355',
      intensity: 0.6,
    },
  },
  floor: {
    size: { width: 20, depth: 20 },
    position: { x: 0, y: 0, z: 0 },
    material: {
      color: '#a39382',
      roughness: 0.8,
      metalness: 0.1,
    },
  },
  walls: defaultRoomConfig,
  grid: {
    enabled: true,
    size: 20,
    divisions: 20,
    cellSize: 0.5,
    cellThickness: 0.5,
    cellColor: '#6b7280',
    sectionSize: 2,
    sectionThickness: 1,
    sectionColor: '#9ca3af',
    fadeDistance: 30,
    fadeStrength: 1,
  },
  controls: {
    enablePan: true,
    enableZoom: true,
    enableRotate: true,
    minDistance: 3,
    maxDistance: 20,
    minPolarAngle: 0,
    maxPolarAngle: Math.PI / 2.1,
    target: { x: 0, y: 0, z: 0 },
  },
  background: {
    gradient: {
      from: 'from-zinc-100',
      to: 'to-zinc-200',
    },
  },
};

// Default CanvasJSON for room-focused rendering
export const defaultCanvasJSON: CanvasJSON = {
  room: defaultRoomConfig,
  objects: defaultSceneConfig.furniture || [],
  floor: defaultSceneConfig.floor,
  camera: defaultSceneConfig.camera,
  lighting: defaultSceneConfig.lighting,
  background: defaultSceneConfig.background,
};
