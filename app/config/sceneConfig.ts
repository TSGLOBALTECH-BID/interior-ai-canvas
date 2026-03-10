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

export interface WallConfig {
  enabled: boolean;
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

export interface FurnitureItem {
  id: string;
  type: 'sofa' | 'table' | 'custom';
  position: Vector3;
  rotation?: Vector3;
  scale?: Vector3;
  properties?: Record<string, unknown>;
}

export interface SceneConfig {
  camera: CameraConfig;
  lighting: LightingConfig;
  floor: FloorConfig;
  walls: WallConfig;
  grid: GridConfig;
  controls: ControlsConfig;
  furniture: FurnitureItem[];
  background: {
    gradient: {
      from: string;
      to: string;
    };
  };
}

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
  walls: {
    enabled: true,
    height: 4,
    thickness: 0.2,
    material: {
      color: '#f5f5f4',
      roughness: 0.9,
    },
    baseboard: {
      color: '#78716c',
      height: 0.1,
    },
  },
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
  furniture: [
    {
      id: 'sofa-1',
      type: 'sofa',
      position: { x: -2, y: 0, z: 0 },
      properties: {
        color: '#d4c4b0',
        cushionColor: '#e8dcc8',
        legColor: '#5c4033',
      },
    },
    {
      id: 'table-1',
      type: 'table',
      position: { x: 2, y: 0, z: 0 },
      properties: {
        topColor: '#8b7355',
        legColor: '#5c4033',
        accentColors: ['#7c3aed', '#dc2626', '#22c55e', '#f97316', '#fef3c7'],
      },
    },
  ],
  background: {
    gradient: {
      from: 'from-zinc-100',
      to: 'to-zinc-200',
    },
  },
};
