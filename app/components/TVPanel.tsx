interface TVPanelProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  properties?: {
    frameColor?: string;
    screenColor?: string;
    standColor?: string;
    tvSize?: 'small' | 'medium' | 'large';
    variant?: 'console' | 'wall-mount' | 'retro' | 'modern' | 'gaming';
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
    variant = 'console',
  } = properties;

  // TV size dimensions
  const tvDimensions = {
    small: { width: 1.2, height: 0.8 },
    medium: { width: 1.8, height: 1.1 },
    large: { width: 2.4, height: 1.4 },
  };

  const { width: tvWidth, height: tvHeight } = tvDimensions[tvSize];
  const tvDepth = 0.08;
  const frameThickness = variant === 'retro' ? 0.08 : variant === 'modern' ? 0.04 : 0.06;
  const screenDepth = variant === 'gaming' ? 0.04 : 0.02; // Curved/gaming TVs have thicker screens

  // Console/stand dimensions
  const consoleWidth = tvWidth + 0.4;
  const consoleHeight = 0.5;
  const consoleDepth = 0.5;

  // Variant-specific TV positioning and dimensions
  const getTVPosition = () => {
    switch (variant) {
      case 'wall-mount':
        return [0, tvHeight / 2, 0] as [number, number, number];
      case 'retro':
        return [0, consoleHeight + tvHeight / 2 + 0.1, 0] as [number, number, number];
      case 'modern':
        return [0, consoleHeight + tvHeight / 2 + 0.03, 0] as [number, number, number];
      case 'gaming':
        return [0, consoleHeight + tvHeight / 2 + 0.05, 0] as [number, number, number];
      default: // console
        return [0, consoleHeight + tvHeight / 2 + 0.05, 0] as [number, number, number];
    }
  };

  const tvPosition = getTVPosition();

  // Screen geometry based on variant
  const getScreenGeometry = () => {
    if (variant === 'gaming') {
      // Curved screen approximation with cylinder
      return <cylinderGeometry args={[tvWidth / 2, tvWidth / 2, screenDepth, 32, 1, false, 0, Math.PI]} />;
    }
    return <boxGeometry args={[tvWidth, tvHeight, screenDepth]} />;
  };

  return (
    <group position={position} rotation={rotation}>
      {/* TV Frame/Bezel */}
      <mesh position={tvPosition} castShadow receiveShadow>
        {variant === 'retro' ? (
          <boxGeometry args={[tvWidth + frameThickness * 2, tvHeight + frameThickness * 2, tvDepth * 1.5]} />
        ) : variant === 'modern' ? (
          <boxGeometry args={[tvWidth + frameThickness, tvHeight + frameThickness, tvDepth * 0.8]} />
        ) : (
          <boxGeometry args={[tvWidth + frameThickness * 2, tvHeight + frameThickness * 2, tvDepth]} />
        )}
        <meshStandardMaterial
          color={variant === 'retro' ? '#3d3d3d' : frameColor}
          roughness={variant === 'modern' ? 0.1 : 0.3}
          metalness={variant === 'modern' ? 0.8 : 0.1}
        />
      </mesh>

      {/* TV Screen */}
      <mesh position={[tvPosition[0], tvPosition[1], tvPosition[2] + (variant === 'gaming' ? 0.02 : 0.01)]} castShadow>
        {getScreenGeometry()}
        <meshStandardMaterial
          color={screenColor}
          roughness={variant === 'gaming' ? 0.05 : 0.1}
          metalness={variant === 'modern' ? 0.9 : 0.3}
          emissive={screenColor}
          emissiveIntensity={variant === 'gaming' ? 0.15 : 0.1}
        />
      </mesh>

      {/* TV Screen Reflection Effect */}
      {variant !== 'gaming' && (
        <mesh position={[tvPosition[0], tvPosition[1], tvPosition[2] + 0.02]}>
          <boxGeometry args={[tvWidth * 0.9, tvHeight * 0.9, 0.01]} />
          <meshStandardMaterial
            color={variant === 'modern' ? "#0a0a1e" : "#1a1a2e"}
            roughness={0.05}
            metalness={variant === 'modern' ? 0.9 : 0.5}
            transparent
            opacity={variant === 'modern' ? 0.5 : 0.3}
          />
        </mesh>
      )}

      {/* Variant-specific stands and mounts */}
      {variant === 'console' && (
        <>
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
        </>
      )}

      {variant === 'wall-mount' && (
        <>
          {/* Wall Mount Bracket */}
          <mesh position={[0, -0.1, 0.05]} castShadow>
            <boxGeometry args={[0.3, 0.1, 0.1]} />
            <meshStandardMaterial color="#2d2d2d" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Wall Mount Arms */}
          <mesh position={[-tvWidth / 3, 0, 0.05]} castShadow>
            <boxGeometry args={[0.05, tvHeight * 0.8, 0.05]} />
            <meshStandardMaterial color="#2d2d2d" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[tvWidth / 3, 0, 0.05]} castShadow>
            <boxGeometry args={[0.05, tvHeight * 0.8, 0.05]} />
            <meshStandardMaterial color="#2d2d2d" metalness={0.8} roughness={0.2} />
          </mesh>
        </>
      )}

      {variant === 'retro' && (
        <>
          {/* Retro TV Stand */}
          <mesh position={[0, consoleHeight / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[consoleWidth * 0.8, consoleHeight, consoleDepth * 0.6]} />
            <meshStandardMaterial color="#8b7355" roughness={0.8} />
          </mesh>
          {/* Retro Antennas */}
          <mesh position={[-tvWidth / 3, tvPosition[1] + tvHeight / 2 + 0.1, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
            <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[tvWidth / 3, tvPosition[1] + tvHeight / 2 + 0.1, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.25, 8]} />
            <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
          </mesh>
        </>
      )}

      {variant === 'modern' && (
        <>
          {/* Modern Minimal Stand */}
          <mesh position={[0, consoleHeight / 2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.08, 0.08, consoleHeight, 16]} />
            <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, consoleHeight + 0.05, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
            <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
          </mesh>
        </>
      )}

      {variant === 'gaming' && (
        <>
          {/* Gaming Console Stand */}
          <mesh position={[0, consoleHeight / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[consoleWidth, consoleHeight * 0.7, consoleDepth]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.7} />
          </mesh>
          {/* RGB Lighting Effect */}
          <mesh position={[0, consoleHeight / 2, consoleDepth / 2 + 0.01]}>
            <boxGeometry args={[consoleWidth * 0.9, 0.02, 0.02]} />
            <meshStandardMaterial
              color="#ff0080"
              emissive="#ff0080"
              emissiveIntensity={0.5}
              transparent
              opacity={0.8}
            />
          </mesh>
          {/* Gaming Controllers/Decor */}
          <mesh position={[-consoleWidth / 3, consoleHeight + 0.05, consoleDepth / 3]} castShadow>
            <boxGeometry args={[0.08, 0.04, 0.15]} />
            <meshStandardMaterial color="#2d2d2d" roughness={0.4} metalness={0.3} />
          </mesh>
          <mesh position={[consoleWidth / 3, consoleHeight + 0.05, consoleDepth / 3]} castShadow>
            <boxGeometry args={[0.08, 0.04, 0.15]} />
            <meshStandardMaterial color="#2d2d2d" roughness={0.4} metalness={0.3} />
          </mesh>
        </>
      )}
    </group>
  );
}
