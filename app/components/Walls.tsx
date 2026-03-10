import { WallConfig } from "@/app/config/sceneConfig";

interface WallsProps {
  config?: WallConfig;
}

export default function Walls({ config }: WallsProps) {
  const {
    enabled = true,
    height = 4,
    thickness = 0.2,
    material = { color: '#f5f5f4', roughness: 0.9 },
    baseboard = { color: '#78716c', height: 0.1 },
  } = config || {};

  if (!enabled) return null;

  const wallLength = 10;
  const wallOffset = wallLength / 2;

  return (
    <group>
      {/* Back Wall */}
      <mesh position={[0, height / 2, -wallOffset]} receiveShadow castShadow>
        <boxGeometry args={[wallLength, height, thickness]} />
        <meshStandardMaterial color={material.color} roughness={material.roughness} />
      </mesh>
      
      {/* Left Wall */}
      <mesh position={[-wallOffset, height / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[thickness, height, wallLength]} />
        <meshStandardMaterial color={material.color} roughness={material.roughness} />
      </mesh>
      
      {/* Right Wall */}
      <mesh position={[wallOffset, height / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[thickness, height, wallLength]} />
        <meshStandardMaterial color={material.color} roughness={material.roughness} />
      </mesh>
      
      {/* Baseboard - Back */}
      <mesh position={[0, baseboard.height / 2, -wallOffset + thickness / 2]}>
        <boxGeometry args={[wallLength, baseboard.height, thickness]} />
        <meshStandardMaterial color={baseboard.color} />
      </mesh>
      
      {/* Baseboard - Left */}
      <mesh position={[-wallOffset + thickness / 2, baseboard.height / 2, 0]}>
        <boxGeometry args={[thickness, baseboard.height, wallLength]} />
        <meshStandardMaterial color={baseboard.color} />
      </mesh>
      
      {/* Baseboard - Right */}
      <mesh position={[wallOffset - thickness / 2, baseboard.height / 2, 0]}>
        <boxGeometry args={[thickness, baseboard.height, wallLength]} />
        <meshStandardMaterial color={baseboard.color} />
      </mesh>
    </group>
  );
}
