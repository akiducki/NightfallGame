import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGameState } from "../lib/stores/useGameState";
import * as THREE from "three";

export default function FirstPersonWeapon() {
  const weaponRef = useRef<THREE.Group>(null);
  const { gamePhase } = useGameState();

  useFrame((state) => {
    if (!weaponRef.current || gamePhase === 'menu') return;

    // Weapon sway based on mouse movement
    const time = state.clock.elapsedTime;
    const swayX = Math.sin(time * 2) * 0.002;
    const swayY = Math.cos(time * 1.5) * 0.001;
    
    weaponRef.current.rotation.x = swayY;
    weaponRef.current.rotation.z = swayX;
  });

  if (gamePhase === 'menu') return null;

  return (
    <group ref={weaponRef} position={[0.3, -0.4, -0.8]}>
      {/* Gun barrel */}
      <mesh position={[0, 0.1, -0.3]}>
        <cylinderGeometry args={[0.02, 0.025, 0.6, 8]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      
      {/* Gun body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.08, 0.15, 0.4]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      
      {/* Trigger guard */}
      <mesh position={[0, -0.05, 0.1]}>
        <boxGeometry args={[0.06, 0.08, 0.15]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
      
      {/* Left hand */}
      <mesh position={[-0.15, -0.1, 0.2]}>
        <boxGeometry args={[0.08, 0.03, 0.12]} />
        <meshStandardMaterial color="#d2b48c" />
      </mesh>
      
      {/* Right hand */}
      <mesh position={[0.12, -0.08, 0.05]}>
        <boxGeometry args={[0.06, 0.03, 0.1]} />
        <meshStandardMaterial color="#d2b48c" />
      </mesh>
      
      {/* Muzzle flash indicator (when shooting) */}
      <mesh position={[0, 0.1, -0.6]} visible={false}>
        <sphereGeometry args={[0.1]} />
        <meshStandardMaterial 
          color="#ffff00" 
          emissive="#ffff00" 
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
}