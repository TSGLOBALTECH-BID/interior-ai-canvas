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
  CanvasJSON, 
  defaultCanvasJSON, 
  FurnitureItem,
  RoomConfig
} from "@/app/config/sceneConfig";

interface SceneCanvasProps {
  config?: Partial<CanvasJSON>;
  isEmpty?: boolean;
}

/**
 * SceneCanvas - A JSON-driven 3D scene renderer
 * 
 * Rendering is controlled by the CanvasJSON prop with two main parts:
 * - room: Wall configuration including windows and doors
 * - objects: Furniture items to render in the room
 * 
 * @param config - Partial CanvasJSON object to override defaults
 */
export default function SceneCanvas({ config, isEmpty = false }: SceneCanvasProps) {
  console.log('SceneCanvas received config:', JSON.stringify(config, null, 2));
  
  // Merge provided config with defaults
  const canvasJSON: CanvasJSON = {
    room: config?.room ? { ...defaultCanvasJSON.room, ...config.room } : defaultCanvasJSON.room,
    objects: config?.objects || defaultCanvasJSON.objects,
    floor: config?.floor ? { ...defaultCanvasJSON.floor, ...config.floor } : defaultCanvasJSON.floor,
    camera: config?.camera ? { ...defaultCanvasJSON.camera, ...config.camera } : defaultCanvasJSON.camera,
    lighting: config?.lighting ? { ...defaultCanvasJSON.lighting, ...config.lighting } : defaultCanvasJSON.lighting,
    background: config?.background ? { ...defaultCanvasJSON.background, ...config.background } : defaultCanvasJSON.background,
  };

  const { room, objects, floor, camera: cameraConfig, lighting, background } = canvasJSON;

  return (
    <div className="w-full h-full relative">
      {/* Placeholder overlay when canvas is empty */}
      {isEmpty && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
          <div className="text-center p-8 max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
              <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Start Space Design
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              by specifying/selecting your room first
            </p>
          </div>
        </div>
      )}
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
        
        {/* Room Walls - dynamically generated from room config */}
        <Walls config={room} />
        
        {/* Objects/Furniture - rendered from CanvasJSON objects */}
        {objects.map((item: FurnitureItem) => (
          <FurnitureRenderer key={item.id} item={item} />
        ))}
        
        {/* Grid helper for design alignment */}
        <Grid
          position={[0, 0.01, 0]}
          args={[20, 20]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#6b7280"
          sectionSize={2}
          sectionThickness={1}
          sectionColor="#9ca3af"
          fadeDistance={30}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid={true}
        />
        
        {/* Camera Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={20}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.1}
          target={[0, 0, 0]}
        />
      </Suspense>
    </Canvas>
    </div>
  );
}

/**
 * CameraController - Handles camera positioning based on config
 */
function CameraController({ config }: { config: CanvasJSON['camera'] }) {
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
 * FurnitureRenderer - Renders furniture items based on CanvasJSON objects
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
