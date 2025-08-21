import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGameState } from "../lib/stores/useGameState";
import * as THREE from "three";

interface BulletProps {
  id: string;
  position: [number, number, number];
  direction: [number, number, number];
  speed: number;
}

export default function Bullet({ id, position, direction, speed }: BulletProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { removeBullet, zombies, damageZombie, bossHealth, damageBoss } = useGameState();
  const startTime = useRef(Date.now());
  const maxLifetime = 3000; // 3 seconds

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Move bullet
    const newX = position[0] + direction[0] * speed * delta;
    const newY = position[1] + direction[1] * speed * delta;
    const newZ = position[2] + direction[2] * speed * delta;

    meshRef.current.position.set(newX, newY, newZ);

    // Update bullet position for collision checking
    position[0] = newX;
    position[1] = newY;
    position[2] = newZ;

    // Check collision with zombies
    zombies.forEach((zombie) => {
      const distance = Math.sqrt(
        Math.pow(zombie.position[0] - newX, 2) +
        Math.pow(zombie.position[1] - newY, 2) +
        Math.pow(zombie.position[2] - newZ, 2)
      );

      if (distance < 1.0) {
        damageZombie(zombie.id, 50);
        removeBullet(id);
        console.log("Bullet", id, "hit zombie", zombie.id);
        return;
      }
    });

    // Check collision with boss (chapter 3)
    if (bossHealth > 0) {
      const bossPosition = [0, 2, -5]; // Boss position
      const distanceToBoss = Math.sqrt(
        Math.pow(bossPosition[0] - newX, 2) +
        Math.pow(bossPosition[1] - newY, 2) +
        Math.pow(bossPosition[2] - newZ, 2)
      );

      if (distanceToBoss < 2.0) {
        damageBoss(25);
        removeBullet(id);
        console.log("Bullet", id, "hit boss");
        return;
      }
    }

    // Remove bullet after lifetime or if it goes too far
    if (Date.now() - startTime.current > maxLifetime || 
        Math.abs(newX) > 50 || Math.abs(newZ) > 50) {
      removeBullet(id);
      console.log("Bullet", id, "expired");
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.1]} />
      <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.5} />
    </mesh>
  );
}
