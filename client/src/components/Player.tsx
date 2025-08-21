import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useGameState } from "../lib/stores/useGameState";
import { useAudio } from "../lib/stores/useAudio";
import { Controls } from "../App";
import * as THREE from "three";

export default function Player() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { 
    playerPosition, 
    setPlayerPosition, 
    playerHealth,
    gamePhase,
    fireBullet
  } = useGameState();
  const { playHit } = useAudio();
  
  const [, get] = useKeyboardControls<Controls>();
  const lastShotTime = useRef(0);
  const shootCooldown = 200; // ms between shots

  useFrame((state, delta) => {
    if (!meshRef.current || gamePhase === 'menu') return;

    const controls = get();
    const speed = 5;
    const currentPosition = playerPosition || [0, 1, 0];
    
    let newX = currentPosition[0];
    let newZ = currentPosition[2];

    // Movement
    if (controls.forward) {
      newZ -= speed * delta;
      console.log("Moving forward, new Z:", newZ);
    }
    if (controls.backward) {
      newZ += speed * delta;
      console.log("Moving backward, new Z:", newZ);
    }
    if (controls.leftward) {
      newX -= speed * delta;
      console.log("Moving left, new X:", newX);
    }
    if (controls.rightward) {
      newX += speed * delta;
      console.log("Moving right, new X:", newX);
    }

    // Constrain movement based on game phase
    if (gamePhase === 'prologue') {
      // Strictly confined to room - smaller boundaries
      newX = Math.max(-4.5, Math.min(4.5, newX));
      newZ = Math.max(-4.5, Math.min(4.5, newZ));
    } else if (gamePhase === 'chapter1' || gamePhase === 'chapter2') {
      // Street movement
      newX = Math.max(-10, Math.min(10, newX));
      newZ = Math.max(-50, Math.min(50, newZ));
    } else if (gamePhase === 'chapter3') {
      // Cave area
      newX = Math.max(-8, Math.min(8, newX));
      newZ = Math.max(-8, Math.min(8, newZ));
    }

    // Update position
    const newPosition: [number, number, number] = [newX, 1, newZ];
    setPlayerPosition(newPosition);
    meshRef.current.position.set(newX, 1, newZ);

    // Shooting - now follows camera direction
    if (controls.shoot && Date.now() - lastShotTime.current > shootCooldown) {
      lastShotTime.current = Date.now();
      
      // Get camera direction for bullet firing
      const camera = state.camera;
      const direction = new THREE.Vector3();
      camera.getWorldDirection(direction);
      
      const bulletDirection: [number, number, number] = [direction.x, direction.y, direction.z];
      const bulletStartPosition: [number, number, number] = [newX, 1.7, newZ]; // Start from eye level
      
      fireBullet(bulletStartPosition, bulletDirection);
      playHit();
      console.log("Fired bullet from:", bulletStartPosition, "direction:", bulletDirection);
    }
  });

  return (
    <>
      {/* Player body - hidden in first person, keep for collision detection */}
      <mesh ref={meshRef} position={playerPosition || [0, 1, 0]} visible={false}>
        <capsuleGeometry args={[0.5, 1.5]} />
        <meshStandardMaterial color="#4444ff" />
      </mesh>
    </>
  );
}
