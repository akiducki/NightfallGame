import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { KeyboardControls, Environment } from "@react-three/drei";
import { useAudio } from "./lib/stores/useAudio";
import { useGameState } from "./lib/stores/useGameState";
import "@fontsource/inter";

// Import game components
import StartScreen from "./components/StartScreen";
import Game from "./components/Game";
import GameUI from "./components/GameUI";

// Define control keys for the game
export enum Controls {
  forward = 'forward',
  backward = 'backward',
  leftward = 'leftward',
  rightward = 'rightward',
  shoot = 'shoot',
  reload = 'reload'
}

const controls = [
  { name: Controls.forward, keys: ["KeyW", "ArrowUp"] },
  { name: Controls.backward, keys: ["KeyS", "ArrowDown"] },
  { name: Controls.leftward, keys: ["KeyA", "ArrowLeft"] },
  { name: Controls.rightward, keys: ["KeyD", "ArrowRight"] },
  { name: Controls.shoot, keys: ["Space", "Mouse0"] },
  { name: Controls.reload, keys: ["KeyR"] },
];

function App() {
  const { gamePhase } = useGameState();
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();
  const [showCanvas, setShowCanvas] = useState(false);

  // Initialize audio
  useEffect(() => {
    const bgMusic = new Audio("/sounds/background.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    setBackgroundMusic(bgMusic);

    const hitAudio = new Audio("/sounds/hit.mp3");
    hitAudio.volume = 0.5;
    setHitSound(hitAudio);

    const successAudio = new Audio("/sounds/success.mp3");
    successAudio.volume = 0.7;
    setSuccessSound(successAudio);

    setShowCanvas(true);
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {showCanvas && (
        <>
          {gamePhase === 'menu' && <StartScreen />}
          
          {(gamePhase === 'prologue' || gamePhase === 'chapter1' || gamePhase === 'chapter2' || gamePhase === 'chapter3' || gamePhase === 'victory' || gamePhase === 'defeat') && (
            <KeyboardControls map={controls}>
              <Canvas
                shadows
                camera={{
                  position: [0, 2.7, 0],
                  fov: 75,
                  near: 0.01,
                  far: 1000
                }}
                gl={{
                  antialias: true,
                  powerPreference: "high-performance"
                }}
              >
                <color attach="background" args={["#0a0a0a"]} />
                
                {/* Lighting */}
                <ambientLight intensity={0.2} />
                <directionalLight
                  position={[10, 10, 5]}
                  intensity={0.5}
                  castShadow
                  shadow-mapSize-width={2048}
                  shadow-mapSize-height={2048}
                />
                <pointLight position={[0, 10, 0]} intensity={0.3} color="#ff4444" />

                <Suspense fallback={null}>
                  <Game />
                </Suspense>
              </Canvas>
              <GameUI />
            </KeyboardControls>
          )}
        </>
      )}
    </div>
  );
}

export default App;
