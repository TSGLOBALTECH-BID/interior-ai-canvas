interface SofaProps {
  position?: [number, number, number];
}

export default function Sofa({ position = [0, 0, 0] }: SofaProps) {
  return (
    <group position={position}>
      {/* Sofa Base */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.5, 1]} />
        <meshStandardMaterial color="#d4c4b0" roughness={0.8} />
      </mesh>
      
      {/* Sofa Seat Cushion */}
      <mesh position={[0, 0.55, 0.1]} castShadow>
        <boxGeometry args={[2.3, 0.15, 0.8]} />
        <meshStandardMaterial color="#e8dcc8" roughness={0.9} />
      </mesh>
      
      {/* Back Rest */}
      <mesh position={[0, 0.75, -0.35]} castShadow>
        <boxGeometry args={[2.5, 0.7, 0.3]} />
        <meshStandardMaterial color="#d4c4b0" roughness={0.8} />
      </mesh>
      
      {/* Left Armrest */}
      <mesh position={[-1.15, 0.5, 0]} castShadow>
        <boxGeometry args={[0.2, 0.5, 1]} />
        <meshStandardMaterial color="#d4c4b0" roughness={0.8} />
      </mesh>
      
      {/* Right Armrest */}
      <mesh position={[1.15, 0.5, 0]} castShadow>
        <boxGeometry args={[0.2, 0.5, 1]} />
        <meshStandardMaterial color="#d4c4b0" roughness={0.8} />
      </mesh>
      
      {/* Back Cushions */}
      <mesh position={[-0.6, 0.85, -0.15]} castShadow>
        <boxGeometry args={[0.7, 0.5, 0.25]} />
        <meshStandardMaterial color="#e8dcc8" roughness={0.9} />
      </mesh>
      <mesh position={[0.6, 0.85, -0.15]} castShadow>
        <boxGeometry args={[0.7, 0.5, 0.25]} />
        <meshStandardMaterial color="#e8dcc8" roughness={0.9} />
      </mesh>
      
      {/* Legs */}
      {[
        [-1, -0.05, 0.35],
        [1, -0.05, 0.35],
        [-1, -0.05, -0.35],
        [1, -0.05, -0.35],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.05, 0.05, 0.1, 8]} />
          <meshStandardMaterial color="#5c4033" metalness={0.3} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}
