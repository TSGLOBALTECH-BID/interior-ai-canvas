interface TableProps {
  position?: [number, number, number];
  properties?: {
    topColor?: string;
    legColor?: string;
    accentColors?: string[];
  };
}

export default function Table({ 
  position = [0, 0, 0],
  properties = {}
}: TableProps) {
  const {
    topColor = '#8b7355',
    legColor = '#5c4033',
    accentColors = ['#7c3aed', '#dc2626', '#22c55e', '#f97316', '#fef3c7'],
  } = properties;

  return (
    <group position={position}>
      {/* Table Top */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.05, 0.8]} />
        <meshStandardMaterial color={topColor} roughness={0.6} />
      </mesh>
      
      {/* Table Legs */}
      {[
        [-0.5, 0.22, 0.3],
        [0.5, 0.22, 0.3],
        [-0.5, 0.22, -0.3],
        [0.5, 0.22, -0.3],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.08, 0.44, 0.08]} />
          <meshStandardMaterial color={legColor} roughness={0.7} />
        </mesh>
      ))}
      
      {/* Decorative Items on Table */}
      {/* Book Stack */}
      <mesh position={[-0.3, 0.52, 0]} castShadow>
        <boxGeometry args={[0.25, 0.04, 0.18]} />
        <meshStandardMaterial color={accentColors[0]} roughness={0.9} />
      </mesh>
      <mesh position={[-0.3, 0.56, 0]} castShadow>
        <boxGeometry args={[0.22, 0.03, 0.15]} />
        <meshStandardMaterial color={accentColors[1]} roughness={0.9} />
      </mesh>
      
      {/* Small Plant Pot */}
      <mesh position={[0.35, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.05, 0.1, 16]} />
        <meshStandardMaterial color={accentColors[3]} roughness={0.8} />
      </mesh>
      {/* Plant */}
      <mesh position={[0.35, 0.58, 0]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={accentColors[2]} roughness={0.9} />
      </mesh>
      
      {/* Coffee Mug */}
      <mesh position={[0.1, 0.52, 0.2]} castShadow>
        <cylinderGeometry args={[0.04, 0.035, 0.08, 16]} />
        <meshStandardMaterial color={accentColors[4]} roughness={0.5} />
      </mesh>
    </group>
  );
}
