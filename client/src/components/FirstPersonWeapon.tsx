import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { Controls } from "../App";
import * as THREE from "three";

export default function FirstPersonWeapon() {
  const weaponRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const [, get] = useKeyboardControls<Controls>();
  
  const shootAnimationTime = useRef(0);
  const lastShotTime = useRef(0);

  useEffect(() => {
    // Attach weapon to camera so it follows camera movement
    if (weaponRef.current) {
      camera.add(weaponRef.current);
      weaponRef.current.position.set(0.4, -0.3, -0.6);
    }
    
    return () => {
      if (weaponRef.current) {
        camera.remove(weaponRef.current);
      }
    };
  }, [camera]);

  useFrame((state, delta) => {
    if (!weaponRef.current) return;

    const controls = get();

    // Shooting animation
    if (controls.shoot && Date.now() - lastShotTime.current > 200) {
      lastShotTime.current = Date.now();
      shootAnimationTime.current = 0.2; // Animation duration
    }

    // Recoil animation
    if (shootAnimationTime.current > 0) {
      shootAnimationTime.current -= delta;
      const recoilAmount = Math.sin((0.2 - shootAnimationTime.current) * 15) * 0.02;
      weaponRef.current.position.z = -0.6 + recoilAmount;
    } else {
      weaponRef.current.position.z = -0.6;
    }

    // Idle sway animation
    const time = state.clock.elapsedTime;
    const baseY = -0.3;
    const baseX = 0.4;
    weaponRef.current.position.y = baseY + Math.sin(time * 2) * 0.002;
    weaponRef.current.position.x = baseX + Math.sin(time * 1.5) * 0.001;
  });

  return (
    <group ref={weaponRef}>
      {/* Left Hand */}
      <mesh position={[-0.2, -0.1, 0.2]}>
        <boxGeometry args={[0.08, 0.15, 0.08]} />
        <meshStandardMaterial color="#D2B48C" />
      </mesh>
      
      {/* Right Hand */}
      <mesh position={[0.15, -0.05, 0.1]}>
        <boxGeometry args={[0.08, 0.15, 0.08]} />
        <meshStandardMaterial color="#D2B48C" />
      </mesh>
      
      {/* Gun Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.03, 0.15, 0.4]} />
        <meshStandardMaterial color="#2F2F2F" />
      </mesh>
      
      {/* Gun Barrel */}
      <mesh position={[0, 0.03, -0.25]}>
        <cylinderGeometry args={[0.015, 0.015, 0.15]} />
        <meshStandardMaterial color="#1F1F1F" />
      </mesh>
      
      {/* Gun Handle */}
      <mesh position={[0, -0.1, 0.1]}>
        <boxGeometry args={[0.025, 0.12, 0.08]} />
        <meshStandardMaterial color="#2F2F2F" />
      </mesh>
      
      {/* Trigger Guard */}
      <mesh position={[0, -0.05, 0.05]}>
        <torusGeometry args={[0.03, 0.008, 8, 16]} />
        <meshStandardMaterial color="#2F2F2F" />
      </mesh>
      
      {/* Muzzle Flash (when shooting) */}
      {shootAnimationTime.current > 0 && (
        <mesh position={[0, 0.03, -0.35]} rotation={[0, 0, Math.random() * Math.PI]}>
          <planeGeometry args={[0.1, 0.1]} />
          <meshBasicMaterial 
            color="#FFFF88" 
            transparent 
            opacity={shootAnimationTime.current * 5}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}