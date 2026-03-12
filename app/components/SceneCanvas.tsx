"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { Suspense, useEffect } from "react";
import Floor from "@/app/components/Floor"
import Walls from '@/app/components/Walls'
import Sofa from '@/app/components/Sofa'
import Table from '@/app/components/Table'
import Lighting from '@/app/components/Lighting'
import { PerspectiveCamera } from "three";
import { 
  SceneConfig, 
  defaultSceneConfig, 
  FurnitureItem 
} from "@/app/config/sceneConfig";

interface SceneCanvasProps {
  config?: Partial<SceneConfig>;
}

/**
 * SceneCanvas - A JSON-driven 3D scene renderer
 * 
 * All rendering is controlled by the config prop (JSON object).
 * Update the config to dynamically change the scene.
 * 
 * @param config - Partial SceneConfig object to override defaults
 */
export default function SceneCanvas({ config }: SceneCanvasProps) {
  console.log('SceneCanvas received config:', JSON.stringify(config, null, 2));
  // Merge provided config with defaults
  const sceneConfig: SceneConfig = {
    ...defaultSceneConfig,
    ...config,
    camera: { ...defaultSceneConfig.camera, ...config?.camera },
    lighting: { ...defaultSceneConfig.lighting, ...config?.lighting },
    floor: { ...defaultSceneConfig.floor, ...config?.floor },
    walls: { ...defaultSceneConfig.walls, ...config?.walls },
    grid: { ...defaultSceneConfig.grid, ...config?.grid },
    controls: { ...defaultSceneConfig.controls, ...config?.controls },
    background: { ...defaultSceneConfig.background, ...config?.background },
    furniture: config?.furniture || defaultSceneConfig.furniture,
  };

  const { camera: cameraConfig, lighting, floor, walls, grid, controls, furniture, background } = sceneConfig;

  return (
    <Canvas
      shadows
      camera={{
        position: [cameraConfig.position.x, cameraConfig.position.y, cameraConfig.position.z],
        fov: cameraConfig.fov,
        near: cameraConfig.near,
        far: cameraConfig.far,
      }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      className={`bg-gradient-to-br ${background.gradient.from} ${background.gradient.to}`}
    >
      <CameraController config={cameraConfig} />
      <Suspense fallback={null}>
        {/* Lighting */}
        <Lighting config={lighting} />
        
        {/* Floor */}
        <Floor config={floor} />
        
        {/* Walls */}
        <Walls config={walls} />
        
        {/* Furniture - rendered from JSON config */}
        {furniture.map((item: FurnitureItem) => (
          <FurnitureRenderer key={item.id} item={item} />
        ))}
        
        {/* Grid helper for design alignment */}
        {grid.enabled && (
          <Grid
            position={[0, 0.01, 0]}
            args={[grid.size, grid.divisions]}
            cellSize={grid.cellSize}
            cellThickness={grid.cellThickness}
            cellColor={grid.cellColor}
            sectionSize={grid.sectionSize}
            sectionThickness={grid.sectionThickness}
            sectionColor={grid.sectionColor}
            fadeDistance={grid.fadeDistance}
            fadeStrength={grid.fadeStrength}
            followCamera={false}
            infiniteGrid={true}
          />
        )}
        
        {/* Camera Controls */}
        <OrbitControls
          enablePan={controls.enablePan}
          enableZoom={controls.enableZoom}
          enableRotate={controls.enableRotate}
          minDistance={controls.minDistance}
          maxDistance={controls.maxDistance}
          minPolarAngle={controls.minPolarAngle}
          maxPolarAngle={controls.maxPolarAngle}
          target={[controls.target.x, controls.target.y, controls.target.z]}
        />
      </Suspense>
    </Canvas>
  );
}

/**
 * CameraController - Handles camera positioning based on config
 */
function CameraController({ config }: { config: SceneConfig['camera'] }) {
  const { camera } = useThree();
  
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      const perspectiveCamera = camera as PerspectiveCamera;
      
      if (isMobile) {
        perspectiveCamera.position.set(config.position.x + 4, config.position.y + 2, config.position.z + 4);
        perspectiveCamera.fov = 60;
      } else {
        perspectiveCamera.position.set(config.position.x, config.position.y, config.position.z);
        perspectiveCamera.fov = config.fov;
      }
      perspectiveCamera.lookAt(0, 0, 0);
      perspectiveCamera.updateProjectionMatrix();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [camera, config]);

  return null;
}

/**
 * FurnitureRenderer - Renders furniture items based on JSON config
 */
function FurnitureRenderer({ item }: { item: FurnitureItem }) {
  const position: [number, number, number] = [
    item.position.x,
    item.position.y,
    item.position.z
  ];

  switch (item.type) {
    case 'sofa':
      return <Sofa position={position} properties={item.properties} />;
    case 'table':
      return <Table position={position} properties={item.properties} />;
    default:
      return null;
  }
}
