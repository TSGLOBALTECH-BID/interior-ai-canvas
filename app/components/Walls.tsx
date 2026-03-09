export default function Walls() {
  return (
    <group>
      {/* Back Wall */}
      <mesh position={[0, 2, -5]} receiveShadow castShadow>
        <boxGeometry args={[10, 4, 0.2]} />
        <meshStandardMaterial color="#f5f5f4" roughness={0.9} />
      </mesh>
      
      {/* Left Wall */}
      <mesh position={[-5, 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.2, 4, 10]} />
        <meshStandardMaterial color="#f5f5f4" roughness={0.9} />
      </mesh>
      
      {/* Right Wall */}
      <mesh position={[5, 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.2, 4, 10]} />
        <meshStandardMaterial color="#f5f5f4" roughness={0.9} />
      </mesh>
      
      {/* Baseboard - Back */}
      <mesh position={[0, 0.05, -4.9]}>
        <boxGeometry args={[10, 0.1, 0.1]} />
        <meshStandardMaterial color="#78716c" />
      </mesh>
      
      {/* Baseboard - Left */}
      <mesh position={[-4.9, 0.05, 0]}>
        <boxGeometry args={[0.1, 0.1, 10]} />
        <meshStandardMaterial color="#78716c" />
      </mesh>
      
      {/* Baseboard - Right */}
      <mesh position={[4.9, 0.05, 0]}>
        <boxGeometry args={[0.1, 0.1, 10]} />
        <meshStandardMaterial color="#78716c" />
      </mesh>
    </group>
  );
}
