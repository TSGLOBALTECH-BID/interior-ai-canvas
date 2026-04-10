

interface SofaProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  properties?: {
    color?: string;
    cushionColor?: string;
    legColor?: string;
    variant?: 'traditional' | 'modern' | 'chaise' | 'loveseat';
  };
}

export default function Sofa({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  properties = {}
}: SofaProps) {
  const {
    color = '#d4c4b0',
    cushionColor = '#e8dcc8',
    legColor = '#5c4033',
    variant = 'traditional',
  } = properties;

  // Variant-specific sofa configurations
  const getSofaConfig = () => {
    switch (variant) {
      case 'traditional':
        return {
          base: { width: 2.5, height: 0.5, depth: 1, y: 0.25 },
          seat: { width: 2.3, height: 0.15, depth: 0.8, y: 0.55, z: 0.1 },
          back: { width: 2.5, height: 0.7, depth: 0.3, y: 0.75, z: -0.35 },
          armrests: true,
          backCushions: true,
          legs: [
            [-1, -0.05, 0.35],
            [1, -0.05, 0.35],
            [-1, -0.05, -0.35],
            [1, -0.05, -0.35],
          ],
          legHeight: 0.1,
        };
      case 'modern':
        return {
          base: { width: 2.5, height: 0.3, depth: 0.8, y: 0.2 },
          seat: { width: 2.4, height: 0.12, depth: 0.7, y: 0.46, z: 0.05 },
          back: { width: 2.5, height: 0.8, depth: 0.2, y: 0.8, z: -0.3 },
          armrests: false,
          backCushions: false,
          legs: [
            [-1.1, -0.05, 0.25],
            [1.1, -0.05, 0.25],
            [-1.1, -0.05, -0.25],
            [1.1, -0.05, -0.25],
          ],
          legHeight: 0.15,
        };

      case 'chaise':
        return {
          base: { width: 1.8, height: 0.5, depth: 2.2, y: 0.25 },
          seat: { width: 1.6, height: 0.15, depth: 2.0, y: 0.55, z: 0.1 },
          back: { width: 1.8, height: 0.7, depth: 0.3, y: 0.75, z: -0.95 },
          armrests: true,
          backCushions: true,
          legs: [
            [-0.8, -0.05, 0.95],
            [0.8, -0.05, 0.95],
            [-0.8, -0.05, -0.95],
            [0.8, -0.05, -0.95],
          ],
          legHeight: 0.1,
        };
      case 'loveseat':
        return {
          base: { width: 1.8, height: 0.5, depth: 1, y: 0.25 },
          seat: { width: 1.6, height: 0.15, depth: 0.8, y: 0.55, z: 0.1 },
          back: { width: 1.8, height: 0.7, depth: 0.3, y: 0.75, z: -0.35 },
          armrests: true,
          backCushions: true,
          legs: [
            [-0.8, -0.05, 0.35],
            [0.8, -0.05, 0.35],
            [-0.8, -0.05, -0.35],
            [0.8, -0.05, -0.35],
          ],
          legHeight: 0.1,
        };
      default:
        return {
          base: { width: 2.5, height: 0.5, depth: 1, y: 0.25 },
          seat: { width: 2.3, height: 0.15, depth: 0.8, y: 0.55, z: 0.1 },
          back: { width: 2.5, height: 0.7, depth: 0.3, y: 0.75, z: -0.35 },
          armrests: true,
          backCushions: true,
          legs: [
            [-1, -0.05, 0.35],
            [1, -0.05, 0.35],
            [-1, -0.05, -0.35],
            [1, -0.05, -0.35],
          ],
          legHeight: 0.1,
        };
    }
  };

  const config = getSofaConfig();

  return (
    <group position={position} rotation={rotation}>
      {/* Sofa Base */}
      <mesh position={[0, config.base.y, 0]} castShadow receiveShadow>
        <boxGeometry args={[config.base.width, config.base.height, config.base.depth]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>

      {/* Sofa Seat Cushion */}
      <mesh position={[0, config.seat.y, config.seat.z]} castShadow>
        <boxGeometry args={[config.seat.width, config.seat.height, config.seat.depth]} />
        <meshStandardMaterial color={cushionColor} roughness={0.9} />
      </mesh>

      {/* Back Rest */}
      <mesh position={[0, config.back.y, config.back.z]} castShadow>
        <boxGeometry args={[config.back.width, config.back.height, config.back.depth]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>

      {/* Armrests */}
      {config.armrests && (
        <>
          <mesh position={[-config.base.width / 2 + 0.1, 0.5, 0]} castShadow>
            <boxGeometry args={[0.2, 0.5, config.base.depth]} />
            <meshStandardMaterial color={color} roughness={0.8} />
          </mesh>
          <mesh position={[config.base.width / 2 - 0.1, 0.5, 0]} castShadow>
            <boxGeometry args={[0.2, 0.5, config.base.depth]} />
            <meshStandardMaterial color={color} roughness={0.8} />
          </mesh>
        </>
      )}

      {/* Back Cushions */}
      {config.backCushions && (
        <>
          <mesh position={[-config.base.width / 4, config.back.y + 0.1, config.back.z + 0.1]} castShadow>
            <boxGeometry args={[config.base.width / 3.5, 0.5, 0.25]} />
            <meshStandardMaterial color={cushionColor} roughness={0.9} />
          </mesh>
          <mesh position={[config.base.width / 4, config.back.y + 0.1, config.back.z + 0.1]} castShadow>
            <boxGeometry args={[config.base.width / 3.5, 0.5, 0.25]} />
            <meshStandardMaterial color={cushionColor} roughness={0.9} />
          </mesh>
        </>
      )}

      {/* Legs */}
      {config.legs.map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.05, 0.05, config.legHeight, 8]} />
          <meshStandardMaterial color={legColor} metalness={0.3} roughness={0.6} />
        </mesh>
      ))}

      {/* Additional decorative elements for modern sofa */}
      {variant === 'modern' && (
        <>
          {/* Modern sofa has sleek metal accents */}
          <mesh position={[0, 0.45, 0.06]} castShadow>
            <boxGeometry args={[config.base.width * 0.95, 0.02, 0.02]} />
            <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
          </mesh>
        </>
      )}

      {/* Chaise has extended footrest */}
      {variant === 'chaise' && (
        <>
          {/* Extended chaise footrest */}
          <mesh position={[0, 0.15, 0.7]} castShadow receiveShadow>
            <boxGeometry args={[1.4, 0.3, 0.8]} />
            <meshStandardMaterial color={color} roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.35, 0.8]} castShadow>
            <boxGeometry args={[1.2, 0.15, 0.6]} />
            <meshStandardMaterial color={cushionColor} roughness={0.9} />
          </mesh>
        </>
      )}
    </group>
  );
}
