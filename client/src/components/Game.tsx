import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGameState } from "../lib/stores/useGameState";
import { useGameLoop } from "../hooks/useGameLoop";
import Player from "./Player";
import Environment from "./Environment";
import Zombie from "./Zombie";
import Bullet from "./Bullet";
import Boss from "./Boss";
import * as THREE from "three";

export default function Game() {
  const { 
    gamePhase, 
    zombies, 
    bullets, 
    bossHealth,
    playerPosition,
    cameraPosition,
    setCameraPosition 
  } = useGameState();
  
  // Initialize game loop
  useGameLoop();

  // Camera follow logic
  useFrame(({ camera }) => {
    if (playerPosition) {
      const targetX = playerPosition[0];
      const targetZ = playerPosition[2] + 10;
      const targetY = 8;

      // Smooth camera movement
      camera.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.05);
      camera.lookAt(playerPosition[0], playerPosition[1], playerPosition[2]);
      
      setCameraPosition([camera.position.x, camera.position.y, camera.position.z]);
    }
  });

  return (
    <>
      {/* Environment based on current phase */}
      <Environment phase={gamePhase} />
      
      {/* Player */}
      <Player />
      
      {/* Zombies */}
      {zombies.map((zombie) => (
        <Zombie
          key={zombie.id}
          id={zombie.id}
          position={zombie.position}
          health={zombie.health}
          targetPosition={playerPosition}
        />
      ))}
      
      {/* Bullets */}
      {bullets.map((bullet) => (
        <Bullet
          key={bullet.id}
          id={bullet.id}
          position={bullet.position}
          direction={bullet.direction}
          speed={bullet.speed}
        />
      ))}
      
      {/* Boss (only in chapter 3) */}
      {gamePhase === 'chapter3' && bossHealth > 0 && (
        <Boss health={bossHealth} />
      )}
    </>
  );
}
