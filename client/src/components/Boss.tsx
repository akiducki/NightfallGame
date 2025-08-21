import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGameState } from "../lib/stores/useGameState";
import * as THREE from "three";

interface BossProps {
  health: number;
}

export default function Boss({ health }: BossProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { playerPosition, damagePlayer, endGame } = useGameState();
  
  const lastDamageTime = useRef(0);
  const damageCooldown = 2000; // 2 seconds between attacks
  const bossPosition: [number, number, number] = [0, 2, -5];

  useFrame((state, delta) => {
    if (!meshRef.current || !playerPosition) return;

    // Boss attack logic
    const distance = Math.sqrt(
      Math.pow(playerPosition[0] - bossPosition[0], 2) + 
      Math.pow(playerPosition[2] - bossPosition[2], 2)
    );

    if (distance < 5 && Date.now() - lastDamageTime.current > damageCooldown) {
      lastDamageTime.current = Date.now();
      damagePlayer(20);
      console.log("Boss attacked player");
    }

    // Pulsing effect for weak spot
    const pulseFactor = Math.sin(state.clock.elapsedTime * 5) * 0.3 + 0.7;
    if (meshRef.current.children[0]) {
      (meshRef.current.children[0] as THREE.Mesh).scale.setScalar(pulseFactor);
    }
  });

  // Check for boss defeat
  useEffect(() => {
    if (health <= 0) {
      console.log("Boss defeated!");
      endGame('victory');
    }
  }, [health, endGame]);

  // Calculate health bar colors for 3 bars (600 total health)
  const healthBar1 = health > 400 ? "#00ff00" : "#333333"; // First bar: 600-401
  const healthBar2 = health > 200 ? (health > 400 ? "#00ff00" : "#ffff00") : "#333333"; // Second bar: 400-201
  const healthBar3 = health > 0 ? (health > 200 ? "#ffff00" : "#ff0000") : "#333333"; // Third bar: 200-1

  return (
    <mesh ref={meshRef} position={bossPosition} castShadow>
      <boxGeometry args={[2, 2.5, 2]} />
      <meshStandardMaterial color="#800080" />
      
      {/* Weak spot - glowing red spot */}
      <mesh position={[0, 0.5, 1.1]}>
        <sphereGeometry args={[0.3]} />
        <meshStandardMaterial 
          color="#ff0000" 
          emissive="#ff0000" 
          emissiveIntensity={0.8}
        />
      </mesh>
      
      {/* Boss eyes */}
      <mesh position={[-0.3, 0.5, 1.1]}>
        <sphereGeometry args={[0.15]} />
        <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.3, 0.5, 1.1]}>
        <sphereGeometry args={[0.15]} />
        <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.5} />
      </mesh>
      
      {/* 3 Health bars */}
      <mesh position={[-0.8, 2.2, 0]}>
        <planeGeometry args={[0.6, 0.2]} />
        <meshBasicMaterial color={healthBar1} />
      </mesh>
      <mesh position={[0, 2.2, 0]}>
        <planeGeometry args={[0.6, 0.2]} />
        <meshBasicMaterial color={healthBar2} />
      </mesh>
      <mesh position={[0.8, 2.2, 0]}>
        <planeGeometry args={[0.6, 0.2]} />
        <meshBasicMaterial color={healthBar3} />
      </mesh>
      
      {/* Health bar background */}
      <mesh position={[0, 2.2, -0.1]}>
        <planeGeometry args={[2.2, 0.3]} />
        <meshBasicMaterial color="#222222" />
      </mesh>
    </mesh>
  );
}
