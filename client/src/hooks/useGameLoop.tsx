import { useEffect, useRef } from "react";
import { useGameState } from "../lib/stores/useGameState";
import { useAudio } from "../lib/stores/useAudio";
import { generateZombieId, getRandomSpawnPosition } from "../lib/gameUtils";

export function useGameLoop() {
  const { 
    gamePhase, 
    playerHealth,
    zombies,
    addZombie,
    nextChapter,
    endGame,
    setCurrentObjective,
    bossHealth
  } = useGameState();
  
  const { backgroundMusic, isMuted } = useAudio();
  
  const lastZombieSpawn = useRef(0);
  const zombieSpawnInterval = useRef(2000); // Start with 2 seconds
  const chapterStartTime = useRef(Date.now());

  // Background music management
  useEffect(() => {
    if (backgroundMusic && gamePhase !== 'menu') {
      if (!isMuted) {
        backgroundMusic.play().catch(console.log);
      } else {
        backgroundMusic.pause();
      }
    }
    
    return () => {
      if (backgroundMusic) {
        backgroundMusic.pause();
      }
    };
  }, [backgroundMusic, gamePhase, isMuted]);

  // Game over condition
  useEffect(() => {
    if (playerHealth <= 0) {
      endGame('defeat');
    }
  }, [playerHealth, endGame]);

  // Chapter progression and objectives
  useEffect(() => {
    chapterStartTime.current = Date.now();
    
    switch (gamePhase) {
      case 'prologue':
        setCurrentObjective("Survive the zombie attack and escape the room");
        zombieSpawnInterval.current = 3000;
        break;
      case 'chapter1':
        setCurrentObjective("Fight through the city streets");
        zombieSpawnInterval.current = 2000;
        break;
      case 'chapter2':
        setCurrentObjective("Survive the chaos and reach the hill");
        zombieSpawnInterval.current = 1500;
        break;
      case 'chapter3':
        setCurrentObjective("Defeat the boss by hitting its weak spot");
        zombieSpawnInterval.current = 4000; // Fewer zombies during boss fight
        break;
    }
  }, [gamePhase, setCurrentObjective]);

  // Zombie spawning logic
  useEffect(() => {
    if (gamePhase === 'menu' || gamePhase === 'victory' || gamePhase === 'defeat') {
      return;
    }

    const spawnTimer = setInterval(() => {
      const now = Date.now();
      
      if (now - lastZombieSpawn.current > zombieSpawnInterval.current) {
        lastZombieSpawn.current = now;
        
        // Don't spawn too many zombies
        if (zombies.length < 8) {
          const spawnPosition = getRandomSpawnPosition(gamePhase);
          const zombieId = generateZombieId();
          
          addZombie({
            id: zombieId,
            position: spawnPosition,
            health: 100
          });
          
          console.log("Spawned zombie", zombieId, "at position", spawnPosition);
        }
      }
    }, 100);

    return () => clearInterval(spawnTimer);
  }, [gamePhase, zombies.length, addZombie]);

  // Chapter progression logic
  useEffect(() => {
    const progressTimer = setInterval(() => {
      const timeInChapter = Date.now() - chapterStartTime.current;
      
      // Auto-progress after certain conditions
      if (gamePhase === 'prologue' && timeInChapter > 30000) { // 30 seconds
        nextChapter();
      } else if (gamePhase === 'chapter1' && timeInChapter > 45000) { // 45 seconds
        nextChapter();
      } else if (gamePhase === 'chapter2' && timeInChapter > 60000) { // 1 minute
        nextChapter();
      } else if (gamePhase === 'chapter3' && bossHealth <= 0) {
        endGame('victory');
      }
    }, 1000);

    return () => clearInterval(progressTimer);
  }, [gamePhase, nextChapter, endGame, bossHealth]);

  // Difficulty scaling
  useEffect(() => {
    const difficultyTimer = setInterval(() => {
      // Gradually increase spawn rate
      if (zombieSpawnInterval.current > 1000) {
        zombieSpawnInterval.current -= 50;
      }
    }, 10000); // Every 10 seconds

    return () => clearInterval(difficultyTimer);
  }, []);
}
