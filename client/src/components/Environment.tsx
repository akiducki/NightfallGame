import { useTexture } from "@react-three/drei";
import { useGameState } from "../lib/stores/useGameState";
import * as THREE from "three";

interface EnvironmentProps {
  phase: string;
}

export default function Environment({ phase }: EnvironmentProps) {
  const grassTexture = useTexture("/textures/grass.png");
  const asphaltTexture = useTexture("/textures/asphalt.png");
  const woodTexture = useTexture("/textures/wood.jpg");

  // Configure texture repeating
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(10, 10);
  
  asphaltTexture.wrapS = asphaltTexture.wrapT = THREE.RepeatWrapping;
  asphaltTexture.repeat.set(5, 20);

  if (phase === 'prologue') {
    // Abandoned room
    return (
      <>
        {/* Floor */}
        <mesh position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial map={woodTexture} />
        </mesh>
        
        {/* Walls */}
        <mesh position={[0, 2.5, -5]} receiveShadow>
          <boxGeometry args={[10, 5, 0.2]} />
          <meshStandardMaterial color="#444444" />
        </mesh>
        <mesh position={[0, 2.5, 5]} receiveShadow>
          <boxGeometry args={[10, 5, 0.2]} />
          <meshStandardMaterial color="#444444" />
        </mesh>
        <mesh position={[-5, 2.5, 0]} receiveShadow>
          <boxGeometry args={[0.2, 5, 10]} />
          <meshStandardMaterial color="#444444" />
        </mesh>
        <mesh position={[5, 2.5, 0]} receiveShadow>
          <boxGeometry args={[0.2, 5, 10]} />
          <meshStandardMaterial color="#444444" />
        </mesh>
        
        {/* Broken furniture */}
        <mesh position={[2, 0.4, 2]} castShadow>
          <boxGeometry args={[1, 0.8, 0.5]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[-2, 0.3, -2]} castShadow>
          <boxGeometry args={[0.8, 0.6, 1.2]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      </>
    );
  }

  if (phase === 'chapter1' || phase === 'chapter2') {
    // City streets
    return (
      <>
        {/* Street */}
        <mesh position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[25, 100]} />
          <meshStandardMaterial map={asphaltTexture} />
        </mesh>
        
        {/* Sidewalks */}
        <mesh position={[-15, 0.1, 0]} receiveShadow>
          <planeGeometry args={[5, 100]} />
          <meshStandardMaterial map={grassTexture} />
        </mesh>
        <mesh position={[15, 0.1, 0]} receiveShadow>
          <planeGeometry args={[5, 100]} />
          <meshStandardMaterial map={grassTexture} />
        </mesh>
        
        {/* Buildings */}
        {Array.from({ length: 8 }, (_, i) => {
          const z = (i - 4) * 12;
          return (
            <group key={`buildings-${i}`}>
              {/* Left building */}
              <mesh position={[-20, 5, z]} castShadow>
                <boxGeometry args={[5, 10, 8]} />
                <meshStandardMaterial color="#333333" />
              </mesh>
              {/* Right building */}
              <mesh position={[20, 5, z]} castShadow>
                <boxGeometry args={[5, 10, 8]} />
                <meshStandardMaterial color="#333333" />
              </mesh>
            </group>
          );
        })}
        
        {/* Abandoned cars */}
        <mesh position={[3, 0.8, 10]} castShadow>
          <boxGeometry args={[2, 1.5, 4]} />
          <meshStandardMaterial color="#ff0000" />
        </mesh>
        <mesh position={[-4, 0.8, -15]} castShadow>
          <boxGeometry args={[2, 1.5, 4]} />
          <meshStandardMaterial color="#0000ff" />
        </mesh>
        <mesh position={[6, 0.8, -30]} castShadow>
          <boxGeometry args={[2, 1.5, 4]} />
          <meshStandardMaterial color="#ffff00" />
        </mesh>
      </>
    );
  }

  if (phase === 'chapter3') {
    // Cave environment
    return (
      <>
        {/* Cave floor */}
        <mesh position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#2F2F2F" />
        </mesh>
        
        {/* Cave walls */}
        <mesh position={[0, 5, -10]} receiveShadow>
          <boxGeometry args={[20, 10, 1]} />
          <meshStandardMaterial color="#1F1F1F" />
        </mesh>
        <mesh position={[0, 5, 10]} receiveShadow>
          <boxGeometry args={[20, 10, 1]} />
          <meshStandardMaterial color="#1F1F1F" />
        </mesh>
        <mesh position={[-10, 5, 0]} receiveShadow>
          <boxGeometry args={[1, 10, 20]} />
          <meshStandardMaterial color="#1F1F1F" />
        </mesh>
        <mesh position={[10, 5, 0]} receiveShadow>
          <boxGeometry args={[1, 10, 20]} />
          <meshStandardMaterial color="#1F1F1F" />
        </mesh>
        
        {/* Stalactites */}
        <mesh position={[3, 8, 3]} castShadow>
          <coneGeometry args={[0.5, 3]} />
          <meshStandardMaterial color="#1F1F1F" />
        </mesh>
        <mesh position={[-4, 8, -2]} castShadow>
          <coneGeometry args={[0.3, 2]} />
          <meshStandardMaterial color="#1F1F1F" />
        </mesh>
        <mesh position={[2, 8, -5]} castShadow>
          <coneGeometry args={[0.4, 2.5]} />
          <meshStandardMaterial color="#1F1F1F" />
        </mesh>
      </>
    );
  }

  return null;
}
