interface TVPanelProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  properties?: {
    frameColor?: string;
    screenColor?: string;
    standColor?: string;
    tvSize?: 'small' | 'medium' | 'large';
  };
}

export default function TVPanel({ 
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  properties = {}
}: TVPanelProps) {
  const {
    frameColor = '#1a1a1a',
    screenColor = '#0a0a0a',
    standColor = '#5c4033',
    tvSize = 'medium',
  } = properties;

  // TV size dimensions
  const tvDimensions = {
    small: { width: 1.2, height: 0.8 },
    medium: { width: 1.8, height: 1.1 },
    large: { width: 2.4, height: 1.4 },
  };

  const { width: tvWidth, height: tvHeight } = tvDimensions[tvSize];
  const tvDepth = 0.08;
  const frameThickness = 0.06;

  // Console/stand dimensions
  const consoleWidth = tvWidth + 0.4;
  const consoleHeight = 0.5;
  const consoleDepth = 0.5;

  return (
    <group position={position} rotation={rotation}>
      {/* TV Frame/Bezel */}
      <mesh position={[0, consoleHeight + tvHeight / 2 + 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[tvWidth + frameThickness * 2, tvHeight + frameThickness * 2, tvDepth]} />
        <meshStandardMaterial color={frameColor} roughness={0.3} metalness={0.1} />
      </mesh>
      
      {/* TV Screen */}
      <mesh position={[0, consoleHeight + tvHeight / 2 + 0.05, 0.01]} castShadow>
        <boxGeometry args={[tvWidth, tvHeight, 0.02]} />
        <meshStandardMaterial 
          color={screenColor} 
          roughness={0.1} 
          metalness={0.3}
          emissive={screenColor}
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* TV Screen Reflection Effect */}
      <mesh position={[0, consoleHeight + tvHeight / 2 + 0.05, 0.02]}>
        <boxGeometry args={[tvWidth * 0.9, tvHeight * 0.9, 0.01]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          roughness={0.05} 
          metalness={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* TV Console/Stand */}
      <mesh position={[0, consoleHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[consoleWidth, consoleHeight, consoleDepth]} />
        <meshStandardMaterial color={standColor} roughness={0.7} />
      </mesh>
      
      {/* Console Drawer Front Left */}
      <mesh position={[-consoleWidth / 4, consoleHeight / 2, consoleDepth / 2 + 0.01]} castShadow>
        <boxGeometry args={[consoleWidth / 2.2, consoleHeight * 0.8, 0.02]} />
        <meshStandardMaterial color={standColor} roughness={0.6} />
      </mesh>
      
      {/* Console Drawer Front Right */}
      <mesh position={[consoleWidth / 4, consoleHeight / 2, consoleDepth / 2 + 0.01]} castShadow>
        <boxGeometry args={[consoleWidth / 2.2, consoleHeight * 0.8, 0.02]} />
        <meshStandardMaterial color={standColor} roughness={0.6} />
      </mesh>
      
      {/* Console Legs */}
      {[
        [-consoleWidth / 2 + 0.1, -0.05, consoleDepth / 2 - 0.1],
        [consoleWidth / 2 - 0.1, -0.05, consoleDepth / 2 - 0.1],
        [-consoleWidth / 2 + 0.1, -0.05, -consoleDepth / 2 + 0.1],
        [consoleWidth / 2 - 0.1, -0.05, -consoleDepth / 2 + 0.1],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.08, 0.1, 0.08]} />
          <meshStandardMaterial color="#2d2d2d" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
      
      {/* Decorative: Small plant on console */}
      <mesh position={[-consoleWidth / 3, consoleHeight + 0.05, consoleDepth / 3]} castShadow>
        <cylinderGeometry args={[0.06, 0.05, 0.12, 16]} />
        <meshStandardMaterial color="#7c3aed" roughness={0.8} />
      </mesh>
      <mesh position={[-consoleWidth / 3, consoleHeight + 0.15, consoleDepth / 3]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#22c55e" roughness={0.9} />
      </mesh>
      
      {/* Decorative: Small vase */}
      <mesh position={[consoleWidth / 3, consoleHeight + 0.08, consoleDepth / 3]} castShadow>
        <cylinderGeometry args={[0.04, 0.06, 0.16, 16]} />
        <meshStandardMaterial color="#f97316" roughness={0.6} />
      </mesh>
    </group>
  );
}
