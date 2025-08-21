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
  
  // Mouse look state - must be before useGameLoop
  const mouseRotation = useRef({ x: 0, y: 0 });

  // Initialize game loop
  useGameLoop();

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (document.pointerLockElement) {
        const sensitivity = 0.002;
        mouseRotation.current.y -= event.movementX * sensitivity;
        mouseRotation.current.x -= event.movementY * sensitivity;
        
        // Limit vertical rotation
        mouseRotation.current.x = Math.max(-Math.PI/3, Math.min(Math.PI/3, mouseRotation.current.x));
      }
    };

    const handleClick = () => {
      if (gamePhase !== 'menu') {
        document.body.requestPointerLock();
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
    };
  }, [gamePhase]);

  // First-person camera logic with mouse look
  useFrame(({ camera }) => {
    if (playerPosition) {
      // Position camera at player's eye level for first-person view
      const eyeHeight = 1.7; // Player eye height
      camera.position.set(playerPosition[0], playerPosition[1] + eyeHeight, playerPosition[2]);
      
      // Apply mouse rotation
      camera.rotation.x = mouseRotation.current.x;
      camera.rotation.y = mouseRotation.current.y;
      camera.rotation.order = 'YXZ'; // Proper rotation order for FPS controls
      
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
