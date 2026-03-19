import { RoomConfig, WallSegmentConfig, WindowConfig, DoorConfig } from "@/app/config/sceneConfig";

interface WallsProps {
  config?: RoomConfig;
}

/**
 * Renders a window on a wall
 */
function Window({ config, wallLength, wallThickness, wallHeight, wallPosition, wallRotation }: {
  config: WindowConfig;
  wallLength: number;
  wallThickness: number;
  wallHeight: number;
  wallPosition: [number, number, number];
  wallRotation: [number, number, number];
}) {
  const windowWidth = config.width;
  const windowHeight = config.height;
  const windowX = (config.position.x - 0.5) * wallLength;
  const windowY = windowHeight / 2 + 0.1;

  return (
    <group position={wallPosition} rotation={wallRotation}>
      {/* Window glass - fully transparent to show outside view */}
      <mesh position={[windowX, windowY, 0]}>
        <boxGeometry args={[windowWidth, windowHeight, wallThickness + 0.1]} />
        <meshBasicMaterial 
          color={config.glassColor} 
          transparent
          opacity={0.3}
          side={2}
        />
      </mesh>
      {/* Window frame - only at edges */}
      {/* Top frame */}
      <mesh position={[windowX, windowY + windowHeight / 2 - 0.03, 0]}>
        <boxGeometry args={[windowWidth + 0.1, 0.06, wallThickness + 0.08]} />
        <meshStandardMaterial color={config.frameColor || '#5c4033'} roughness={0.7} metalness={0.1} />
      </mesh>
      {/* Bottom frame */}
      <mesh position={[windowX, windowY - windowHeight / 2 + 0.03, 0]}>
        <boxGeometry args={[windowWidth + 0.1, 0.06, wallThickness + 0.08]} />
        <meshStandardMaterial color={config.frameColor || '#5c4033'} roughness={0.7} metalness={0.1} />
      </mesh>
      {/* Left frame */}
      <mesh position={[windowX - windowWidth / 2 + 0.03, windowY, 0]}>
        <boxGeometry args={[0.06, windowHeight - 0.06, wallThickness + 0.08]} />
        <meshStandardMaterial color={config.frameColor || '#5c4033'} roughness={0.7} metalness={0.1} />
      </mesh>
      {/* Right frame */}
      <mesh position={[windowX + windowWidth / 2 - 0.03, windowY, 0]}>
        <boxGeometry args={[0.06, windowHeight - 0.06, wallThickness + 0.08]} />
        <meshStandardMaterial color={config.frameColor || '#5c4033'} roughness={0.7} metalness={0.1} />
      </mesh>
    </group>
  );
}

/**
 * Renders a door on a wall
 */
function Door({ config, wallLength, wallThickness, wallHeight, wallPosition, wallRotation }: {
  config: DoorConfig;
  wallLength: number;
  wallThickness: number;
  wallHeight: number;
  wallPosition: [number, number, number];
  wallRotation: [number, number, number];
}) {
  const doorWidth = config.width;
  const doorHeight = config.height;
  const doorX = (config.position.x - 0.5) * wallLength;
  const doorY = doorHeight / 2;

  return (
    <group position={wallPosition} rotation={wallRotation}>
      {/* Door frame */}
      <mesh position={[doorX, doorHeight / 2, 0]} castShadow>
        <boxGeometry args={[doorWidth + 0.1, doorHeight + 0.05, wallThickness + 0.15]} />
        <meshStandardMaterial color={config.frameColor} roughness={0.7} />
      </mesh>
      {/* Door panel */}
      <mesh position={[doorX, doorY, 0]} castShadow>
        <boxGeometry args={[doorWidth - 0.05, doorHeight - 0.05, wallThickness + 0.05]} />
        <meshStandardMaterial color={config.doorColor} roughness={0.6} />
      </mesh>
      {/* Door handle */}
      <mesh position={[doorX + (config.swingDirection === 'right' ? -0.15 : 0.15), doorY - 0.2, wallThickness / 2 + 0.08]} castShadow>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

/**
 * Renders a solid wall segment with optional cutouts for windows and doors
 */
function WallSegment({ 
  config, 
  wallLength, 
  wallHeight, 
  wallThickness, 
  position, 
  rotation 
}: {
  config: WallSegmentConfig;
  wallLength: number;
  wallHeight: number;
  wallThickness: number;
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  const material = { color: '#f5f5f4', roughness: 0.9 };
  const baseboard = { color: '#78716c', height: 0.1 };

  const windowConfig = config.windowConfig;
  const doorConfig = config.doorConfig;

  // Calculate window position in wall coordinates
  const windowXWorld = ((windowConfig?.position?.x ?? 0.5) - 0.5) * wallLength;
  const windowWidth = windowConfig?.width || 1;
  const windowHeight = windowConfig?.height || 1;
  const windowLeftEdge = windowXWorld - windowWidth / 2;
  const windowRightEdge = windowXWorld + windowWidth / 2;
  const wallLeftEdge = -wallLength / 2;
  const wallRightEdge = wallLength / 2;

  // Widths for the wall segments
  const leftWallWidth = windowLeftEdge - wallLeftEdge;
  const rightWallWidth = wallRightEdge - windowRightEdge;
  const centerWidth = wallLength - leftWallWidth - rightWallWidth;

  return (
    <group position={position} rotation={rotation}>
      {/* Main wall with hole for window */}
      {config.hasWindow && windowConfig && (
        <>
          {/* Wall left of window - full height */}
          {leftWallWidth > 0 && (
            <mesh position={[wallLeftEdge + leftWallWidth / 2, wallHeight / 2, 0]} receiveShadow castShadow>
              <boxGeometry args={[leftWallWidth, wallHeight, wallThickness]} />
              <meshStandardMaterial color={material.color} roughness={material.roughness} />
            </mesh>
          )}
          {/* Wall right of window - full height */}
          {rightWallWidth > 0 && (
            <mesh position={[wallRightEdge - rightWallWidth / 2, wallHeight / 2, 0]} receiveShadow castShadow>
              <boxGeometry args={[rightWallWidth, wallHeight, wallThickness]} />
              <meshStandardMaterial color={material.color} roughness={material.roughness} />
            </mesh>
          )}
          {/* Wall above window - no wall below, that's the window opening */}
          {wallHeight > windowHeight && (
            <mesh position={[windowXWorld, windowHeight + (wallHeight - windowHeight) / 2, 0]} receiveShadow castShadow>
              <boxGeometry args={[centerWidth, wallHeight - windowHeight, wallThickness]} />
              <meshStandardMaterial color={material.color} roughness={material.roughness} />
            </mesh>
          )}
        </>
      )}

      {/* Main wall with hole for door */}
      {config.hasDoor && doorConfig && (
        <>
          {/* Wall above door */}
          <mesh position={[0, doorConfig.height + (wallHeight - doorConfig.height) / 2, 0]} receiveShadow castShadow>
            <boxGeometry args={[wallLength, wallHeight - doorConfig.height, wallThickness]} />
            <meshStandardMaterial color={material.color} roughness={material.roughness} />
          </mesh>
          {/* Wall left of door */}
          <mesh position={[-(wallLength / 2 + ((doorConfig?.position?.x ?? 0.5) - 0.5) * wallLength - doorConfig.width / 2) / 2 - doorConfig.width / 2, wallHeight / 2, 0]} receiveShadow castShadow>
            <boxGeometry args={[wallLength * (1 - (doorConfig?.position?.x ?? 0.5)) - doorConfig.width / 2, wallHeight, wallThickness]} />
            <meshStandardMaterial color={material.color} roughness={material.roughness} />
          </mesh>
          {/* Wall right of door */}
          <mesh position={[(wallLength / 2 - ((doorConfig?.position?.x ?? 0.5) - 0.5) * wallLength - doorConfig.width / 2) / 2 + doorConfig.width / 2, wallHeight / 2, 0]} receiveShadow castShadow>
            <boxGeometry args={[wallLength * (doorConfig?.position?.x ?? 0.5) - doorConfig.width / 2, wallHeight, wallThickness]} />
            <meshStandardMaterial color={material.color} roughness={material.roughness} />
          </mesh>
        </>
      )}

      {/* Simple wall if no cutouts */}
      {!config.hasWindow && !config.hasDoor && (
        <mesh position={[0, wallHeight / 2, 0]} receiveShadow castShadow>
          <boxGeometry args={[wallLength, wallHeight, wallThickness]} />
          <meshStandardMaterial color={material.color} roughness={material.roughness} />
        </mesh>
      )}

      {/* Render window */}
      {config.hasWindow && windowConfig && (
        <Window 
          config={windowConfig} 
          wallLength={wallLength} 
          wallThickness={wallThickness}
          wallHeight={wallHeight}
          wallPosition={[0, 0, 0]}
          wallRotation={[0, 0, 0]}
        />
      )}

      {/* Render door */}
      {/* {config.hasDoor && doorConfig && (
        <Door 
          config={doorConfig}
          wallLength={wallLength}
          wallThickness={wallThickness}
          wallHeight={wallHeight}
          wallPosition={position}
          wallRotation={rotation}
        />
      )} */}
    </group>
  );
}

export default function Walls({ config }: WallsProps) {
  const {
    enabled = true,
    width = 10,
    depth = 10,
    height = 4,
    thickness = 0.2,
    material = { color: '#f5f5f4', roughness: 0.9 },
    baseboard = { color: '#78716c', height: 0.1 },
    walls = [],
  } = config || {};

  if (!enabled) return null;

  const wallLength = Math.max(width, depth);
  const wallOffset = wallLength / 2;

  // Default wall configurations if not provided
  const defaultWalls: WallSegmentConfig[] = [
    { id: 'front-wall', side: 'front', hasWindow: false, hasDoor: false },
    { id: 'back-wall', side: 'back', hasWindow: false, hasDoor: false },
    { id: 'left-wall', side: 'left', hasWindow: false, hasDoor: false },
    { id: 'right-wall', side: 'right', hasWindow: false, hasDoor: false },
  ];

  const wallConfigs = walls.length > 0 ? walls : defaultWalls;

  // Find wall configurations by side
  const getWallConfig = (side: string): WallSegmentConfig => {
    return wallConfigs.find(w => w.side === side) || { id: side, side: side as any, hasWindow: false, hasDoor: false };
  };

  return (
    <group>
      {/* Back Wall (front in 3D view) */}
      <WallSegment
        config={getWallConfig('front')}
        wallLength={width}
        wallHeight={height}
        wallThickness={thickness}
        position={[0, 0, -wallOffset]}
        rotation={[0, 0, 0]}
      />
      
      {/* Front Wall (back in 3D view) */}
      <WallSegment
        config={getWallConfig('back')}
        wallLength={width}
        wallHeight={height}
        wallThickness={thickness}
        position={[0, 0, wallOffset]}
        rotation={[0, Math.PI, 0]}
      />
      
      {/* Left Wall */}
      <WallSegment
        config={getWallConfig('left')}
        wallLength={depth}
        wallHeight={height}
        wallThickness={thickness}
        position={[-wallOffset, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
      />
      
      {/* Right Wall */}
      <WallSegment
        config={getWallConfig('right')}
        wallLength={depth}
        wallHeight={height}
        wallThickness={thickness}
        position={[wallOffset, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      />
    </group>
  );
}

