import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGameState } from "../lib/stores/useGameState";
import { useGameLoop } from "../hooks/useGameLoop";
import Player from "./Player";
import Environment from "./Environment";
import Zombie from "./Zombie";
import Bullet from "./Bullet";
import Boss from "./Boss";
import FirstPersonWeapon from "./FirstPersonWeapon";
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

  // First-person camera logic with fixed forward view
  useFrame(({ camera }) => {
    if (playerPosition) {
      // Position camera at player's eye level for first-person view
      const eyeHeight = 1.7; // Player eye height
      camera.position.set(playerPosition[0], playerPosition[1] + eyeHeight, playerPosition[2]);
      
      // Fixed forward-looking direction (no mouse look)
      camera.rotation.set(0, 0, 0);
      camera.lookAt(playerPosition[0], playerPosition[1] + eyeHeight, playerPosition[2] - 10);
      
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
      
      {/* First-person weapon view */}
      <FirstPersonWeapon />
    </>
  );
}
