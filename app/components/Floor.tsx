import { MeshReflectorMaterial } from "@react-three/drei";
import { FloorConfig } from "@/app/config/sceneConfig";

interface FloorProps {
  config?: FloorConfig;
}

export default function Floor({ config }: FloorProps) {
  const { 
    size = { width: 20, depth: 20 },
    position = { x: 0, y: 0, z: 0 },
    material = { color: '#a39382', roughness: 0.8, metalness: 0.1 }
  } = config || {};

  return (
    <mesh 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[position.x, position.y, position.z]} 
      receiveShadow
    >
      <planeGeometry args={[size.width, size.depth]} />
      <meshStandardMaterial 
        color={material.color} 
        roughness={material.roughness}
        metalness={material.metalness}
      />
    </mesh>
  );
}
