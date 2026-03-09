"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, Grid } from "@react-three/drei";
import { Suspense, useEffect } from "react";
import Floor from "@/app/components/Floor"
import Walls from '@/app/components/Walls'
import Sofa from '@/app/components/Sofa'
import Table from '@/app/components/Table'
import Lighting from '@/app/components/Lighting'
import { PerspectiveCamera } from "three";

function CameraController() {
  const { camera } = useThree();
  
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      const perspectiveCamera = camera as PerspectiveCamera;
      
      if (isMobile) {
        perspectiveCamera.position.set(12, 8, 12);
        perspectiveCamera.fov = 60;
      } else {
        perspectiveCamera.position.set(8, 6, 8);
        perspectiveCamera.fov = 50;
      }
      perspectiveCamera.lookAt(0, 0, 0);
      perspectiveCamera.updateProjectionMatrix();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [camera]);

  return null;
}

export default function SceneCanvas() {
  return (
    <Canvas
      shadows
      camera={{
        position: [8, 6, 8],
        fov: 50,
        near: 0.1,
        far: 1000,
      }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      className="bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900"
    >
      <CameraController />
      <Suspense fallback={null}>
        {/* Lighting */}
        <Lighting />
        
        {/* Environment */}
        <Environment preset="apartment" />
        
        {/* Floor */}
        <Floor />
        
        {/* Walls */}
        <Walls />
        
        {/* Furniture */}
        <Sofa position={[-2, 0, 0]} />
        <Table position={[2, 0, 0]} />
        
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
  );
}
