import { LightingConfig } from "@/app/config/sceneConfig";

interface LightingProps {
  config?: LightingConfig;
}

export default function Lighting({ config }: LightingProps) {
  const {
    ambient = { intensity: 0.4, color: '#ffffff' },
    main = {
      position: { x: 10, y: 15, z: 10 },
      intensity: 1.2,
      color: '#ffffff',
      castShadow: true,
      shadowMapSize: { width: 2048, height: 2048 },
      shadowCamera: { far: 50, left: -10, right: 10, top: 10, bottom: -10 },
    },
    fill = {
      position: { x: -5, y: 8, z: -5 },
      intensity: 0.5,
      color: '#e0e7ff',
    },
    hemisphere = {
      skyColor: '#87ceeb',
      groundColor: '#8b7355',
      intensity: 0.6,
    },
  } = config || {};

  return (
    <>
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={ambient.intensity} color={ambient.color} />
      
      {/* Main directional light (simulating sun) */}
      <directionalLight
        position={[main.position.x, main.position.y, main.position.z]}
        intensity={main.intensity}
        color={main.color}
        castShadow={main.castShadow}
        shadow-mapSize-width={main.shadowMapSize.width}
        shadow-mapSize-height={main.shadowMapSize.height}
        shadow-camera-far={main.shadowCamera.far}
        shadow-camera-left={main.shadowCamera.left}
        shadow-camera-right={main.shadowCamera.right}
        shadow-camera-top={main.shadowCamera.top}
        shadow-camera-bottom={main.shadowCamera.bottom}
      />
      
      {/* Fill light from the opposite side */}
      <directionalLight
        position={[fill.position.x, fill.position.y, fill.position.z]}
        intensity={fill.intensity}
        color={fill.color}
      />
      
      {/* Hemisphere light for natural sky/ground lighting */}
      <hemisphereLight
        args={[hemisphere.skyColor, hemisphere.groundColor, hemisphere.intensity]}
      />
    </>
  );
}
