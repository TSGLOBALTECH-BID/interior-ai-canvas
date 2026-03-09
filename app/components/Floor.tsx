import { MeshReflectorMaterial } from "@react-three/drei";

export default function Floor() {
  return (
    <mesh 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, 0, 0]} 
      receiveShadow
    >
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial 
        color="#a39382" 
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
}
