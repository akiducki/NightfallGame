import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGameState } from "../lib/stores/useGameState";
import * as THREE from "three";

interface ZombieProps {
  id: string;
  position: [number, number, number];
  health: number;
  targetPosition: [number, number, number] | null;
}

export default function Zombie({ id, position, health, targetPosition }: ZombieProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { damagePlayer, removeZombie } = useGameState();
  
  const lastDamageTime = useRef(0);
  const damageCooldown = 1000; // 1 second between damage

  useFrame((state, delta) => {
    if (!meshRef.current || !targetPosition) return;

    // Move towards player
    const direction = new THREE.Vector3(
      targetPosition[0] - position[0],
      0,
      targetPosition[2] - position[2]
    ).normalize();

    const speed = 1.5; // Reduced zombie speed to give player more time
    const newX = position[0] + direction.x * speed * delta;
    const newZ = position[2] + direction.z * speed * delta;

    meshRef.current.position.set(newX, position[1], newZ);

    // Check collision with player - need to be touching to damage
    const distance = Math.sqrt(
      Math.pow(targetPosition[0] - newX, 2) + 
      Math.pow(targetPosition[2] - newZ, 2)
    );

    if (distance < 1.2 && Date.now() - lastDamageTime.current > damageCooldown) {
      lastDamageTime.current = Date.now();
      damagePlayer(15);
      console.log("Zombie", id, "damaged player, distance:", distance);
    }

    // Update position in the position array for collision detection
    position[0] = newX;
    position[2] = newZ;
  });

  // Remove zombie if health <= 0
  useEffect(() => {
    if (health <= 0) {
      console.log("Zombie", id, "destroyed");
      removeZombie(id);
    }
  }, [health, id, removeZombie]);

  return (
    <mesh ref={meshRef} position={position} castShadow>
      <boxGeometry args={[0.8, 1.8, 0.8]} />
      <meshStandardMaterial color="#228B22" />
      
      {/* Zombie eyes */}
      <mesh position={[0, 0.5, 0.4]}>
        <sphereGeometry args={[0.05]} />
        <meshStandardMaterial color="#ff0000" />
      </mesh>
      <mesh position={[0.2, 0.5, 0.4]}>
        <sphereGeometry args={[0.05]} />
        <meshStandardMaterial color="#ff0000" />
      </mesh>
      
      {/* Health indicator */}
      {health < 100 && (
        <mesh position={[0, 1.2, 0]}>
          <planeGeometry args={[1, 0.1]} />
          <meshBasicMaterial color={health > 50 ? "#00ff00" : health > 25 ? "#ffff00" : "#ff0000"} />
        </mesh>
      )}
    </mesh>
  );
}
