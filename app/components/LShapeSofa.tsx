
import { RoundedBox } from '@react-three/drei';

interface LShapeSofaProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  properties?: {
    color?: string;
    cushionColor?: string;
    legColor?: string;
    seatsX?: number; // seats along x-axis
    seatsZ?: number; // seats along z-axis
  };
}

export default function LShapeSofa({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  properties = {}
}: LShapeSofaProps) {
  const {
    color = '#8b7355',
    cushionColor = '#e8dcc8',
    legColor = '#5c4033',
    seatsX = 3,
    seatsZ = 2,
  } = properties;

  const seatWidth = 0.95; // fixed width per seat
  const depth = 0.8; // sofa depth (made slimmer)
  const seatHeight = 0.5;
  const backHeight = 0.65; // adjusted for better proportion to seat width

  const armXLength = seatsX * seatWidth;
  const armZLength = seatsZ * seatWidth;

  return (
    <group position={position} rotation={rotation}>
      {/* Base frames */}
      {/* X-arm base */}
      <mesh position={[armXLength / 2, 0.25, depth / 2]} castShadow receiveShadow>
        <boxGeometry args={[armXLength, 0.5, depth]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Z-arm base */}
      <mesh position={[depth / 2, 0.25, armZLength / 2]} castShadow receiveShadow>
        <boxGeometry args={[depth, 0.5, armZLength]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>

      {/* Seat cushions - equal size for all, with rounded edges */}
      {/* X-arm seats */}
      {Array.from({ length: seatsX }, (_, i) => (
        <RoundedBox key={`seat-x-${i}`} position={[i * seatWidth + seatWidth / 2, seatHeight, depth / 2]} args={[seatWidth, 0.15, depth, 8, 0.05]} castShadow>
          <meshStandardMaterial color={cushionColor} roughness={0.8} />
        </RoundedBox>
      ))}
      {/* Z-arm seats */}
      {Array.from({ length: seatsZ }, (_, i) => (
        <RoundedBox key={`seat-z-${i}`} position={[depth / 2, seatHeight, i * seatWidth + seatWidth / 2]} args={[depth, 0.15, seatWidth, 8, 0.05]} castShadow>
          <meshStandardMaterial color={cushionColor} roughness={0.8} />
        </RoundedBox>
      ))}

      {/* Backrests */}
      {/* X-arm backrest */}
      <mesh position={[armXLength / 2, backHeight, -depth / 2 + 0.15]} castShadow>
        <boxGeometry args={[armXLength, 0.7, 0.3]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Z-arm backrest */}
      <mesh position={[-depth / 2 + 0.15, backHeight, armZLength / 2]} castShadow>
        <boxGeometry args={[0.3, 0.7, armZLength]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Corner backrest */}
      <mesh position={[-depth / 2 + 0.15, backHeight, -depth / 2 + 0.15]} castShadow>
        <boxGeometry args={[0.3, 0.7, 0.3]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>

      {/* Back cushions - equal size, rounded, adjusted height */}
      {/* X-arm back cushions */}
      {Array.from({ length: seatsX }, (_, i) => (
        <RoundedBox key={`back-x-${i}`} position={[i * seatWidth + seatWidth / 2, 0.75, -depth / 2 + 0.25]} args={[seatWidth, 0.35, 0.2, 6, 0.03]} castShadow>
          <meshStandardMaterial color={cushionColor} roughness={0.7} />
        </RoundedBox>
      ))}
      {/* Z-arm back cushions */}
      {Array.from({ length: seatsZ }, (_, i) => (
        <RoundedBox key={`back-z-${i}`} position={[-depth / 2 + 0.25, 0.75, i * seatWidth + seatWidth / 2]} args={[0.2, 0.35, seatWidth, 6, 0.03]} castShadow>
          <meshStandardMaterial color={cushionColor} roughness={0.7} />
        </RoundedBox>
      ))}



      {/* Legs */}
      {/* X-arm legs */}
      <mesh position={[0.1, -0.05, depth / 2 - 0.1]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.1, 8]} />
        <meshStandardMaterial color={legColor} metalness={0.3} roughness={0.6} />
      </mesh>
      <mesh position={[armXLength - 0.1, -0.05, depth / 2 - 0.1]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.1, 8]} />
        <meshStandardMaterial color={legColor} metalness={0.3} roughness={0.6} />
      </mesh>
      <mesh position={[0.1, -0.05, -depth / 2 + 0.1]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.1, 8]} />
        <meshStandardMaterial color={legColor} metalness={0.3} roughness={0.6} />
      </mesh>
      <mesh position={[armXLength - 0.1, -0.05, -depth / 2 + 0.1]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.1, 8]} />
        <meshStandardMaterial color={legColor} metalness={0.3} roughness={0.6} />
      </mesh>
      {/* Z-arm legs */}
      <mesh position={[depth / 2 - 0.1, -0.05, 0.1]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.1, 8]} />
        <meshStandardMaterial color={legColor} metalness={0.3} roughness={0.6} />
      </mesh>
      <mesh position={[depth / 2 - 0.1, -0.05, armZLength - 0.1]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.1, 8]} />
        <meshStandardMaterial color={legColor} metalness={0.3} roughness={0.6} />
      </mesh>
      <mesh position={[-depth / 2 + 0.1, -0.05, 0.1]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.1, 8]} />
        <meshStandardMaterial color={legColor} metalness={0.3} roughness={0.6} />
      </mesh>
      <mesh position={[-depth / 2 + 0.1, -0.05, armZLength - 0.1]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.1, 8]} />
        <meshStandardMaterial color={legColor} metalness={0.3} roughness={0.6} />
      </mesh>

      {/* Additional legs for longer arms */}
      {seatsX > 3 && (
        <mesh position={[armXLength / 2, -0.05, depth / 2 - 0.1]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.1, 8]} />
          <meshStandardMaterial color={legColor} metalness={0.3} roughness={0.6} />
        </mesh>
      )}
      {seatsZ > 2 && (
        <mesh position={[depth / 2 - 0.1, -0.05, armZLength / 2]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.1, 8]} />
          <meshStandardMaterial color={legColor} metalness={0.3} roughness={0.6} />
        </mesh>
      )}
    </group>
  );
}