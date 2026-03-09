export default function Lighting() {
  return (
    <>
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.4} color="#ffffff" />
      
      {/* Main directional light (simulating sun) */}
      <directionalLight
        position={[10, 15, 10]}
        intensity={1.2}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Fill light from the opposite side */}
      <directionalLight
        position={[-5, 8, -5]}
        intensity={0.5}
        color="#e0e7ff"
      />
      
      {/* Hemisphere light for natural sky/ground lighting */}
      <hemisphereLight
        args={["#87ceeb", "#8b7355", 0.6]}
      />
    </>
  );
}
