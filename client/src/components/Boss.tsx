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

  return (
    <mesh ref={meshRef} position={bossPosition} castShadow>
      <boxGeometry args={[3, 4, 3]} />
      <meshStandardMaterial color="#800080" />
      
      {/* Weak spot - glowing red spot */}
      <mesh position={[0, 1, 1.6]}>
        <sphereGeometry args={[0.5]} />
        <meshStandardMaterial 
          color="#ff0000" 
          emissive="#ff0000" 
          emissiveIntensity={0.8}
        />
      </mesh>
      
      {/* Boss eyes */}
      <mesh position={[-0.5, 1, 1.6]}>
        <sphereGeometry args={[0.2]} />
        <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.5, 1, 1.6]}>
        <sphereGeometry args={[0.2]} />
        <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.5} />
      </mesh>
      
      {/* Health indicator */}
      <mesh position={[0, 3, 0]}>
        <planeGeometry args={[3, 0.3]} />
        <meshBasicMaterial color={health > 150 ? "#00ff00" : health > 75 ? "#ffff00" : "#ff0000"} />
      </mesh>
    </mesh>
  );
}
