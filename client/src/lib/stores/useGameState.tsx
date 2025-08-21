import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GamePhase = "menu" | "prologue" | "chapter1" | "chapter2" | "chapter3" | "victory" | "defeat";

interface Zombie {
  id: string;
  position: [number, number, number];
  health: number;
}

interface Bullet {
  id: string;
  position: [number, number, number];
  direction: [number, number, number];
  speed: number;
}

interface GameState {
  // Game state
  gamePhase: GamePhase;
  playerHealth: number;
  playerPosition: [number, number, number] | null;
  cameraPosition: [number, number, number] | null;
  zombieKills: number;
  currentObjective: string | null;
  
  // Game entities
  zombies: Zombie[];
  bullets: Bullet[];
  bossHealth: number;
  
  // Actions
  startGame: () => void;
  restartGame: () => void;
  goToMenu: () => void;
  nextChapter: () => void;
  endGame: (result: 'victory' | 'defeat') => void;
  
  // Player actions
  setPlayerPosition: (position: [number, number, number]) => void;
  setCameraPosition: (position: [number, number, number]) => void;
  damagePlayer: (damage: number) => void;
  healPlayer: (amount: number) => void;
  
  // Zombie actions
  addZombie: (zombie: Zombie) => void;
  removeZombie: (id: string) => void;
  damageZombie: (id: string, damage: number) => void;
  
  // Bullet actions
  fireBullet: (position: [number, number, number], direction: [number, number, number]) => void;
  removeBullet: (id: string) => void;
  
  // Boss actions
  damageBoss: (damage: number) => void;
  
  // UI actions
  setCurrentObjective: (objective: string | null) => void;
}

export const useGameState = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    gamePhase: "menu",
    playerHealth: 100,
    playerPosition: null,
    cameraPosition: null,
    zombieKills: 0,
    currentObjective: null,
    zombies: [],
    bullets: [],
    bossHealth: 600,
    
    // Game flow actions
    startGame: () => {
      set({
        gamePhase: "prologue",
        playerHealth: 100,
        playerPosition: [0, 1, 0],
        zombieKills: 0,
        zombies: [],
        bullets: [],
        bossHealth: 600,
        currentObjective: null
      });
      console.log("Game started - Prologue phase");
    },
    
    restartGame: () => {
      get().startGame();
    },
    
    goToMenu: () => {
      set({
        gamePhase: "menu",
        playerHealth: 100,
        playerPosition: null,
        zombieKills: 0,
        zombies: [],
        bullets: [],
        bossHealth: 600,
        currentObjective: null
      });
      console.log("Returned to menu");
    },
    
    nextChapter: () => {
      const { gamePhase } = get();
      let newPhase: GamePhase = gamePhase;
      
      switch (gamePhase) {
        case "prologue":
          newPhase = "chapter1";
          break;
        case "chapter1":
          newPhase = "chapter2";
          break;
        case "chapter2":
          newPhase = "chapter3";
          break;
      }
      
      set({
        gamePhase: newPhase,
        playerPosition: [0, 1, 0], // Reset position for new chapter
        zombies: [], // Clear zombies
        bullets: [] // Clear bullets
      });
      console.log("Advanced to", newPhase);
    },
    
    endGame: (result) => {
      set({
        gamePhase: result,
        zombies: [],
        bullets: [],
        currentObjective: null
      });
      console.log("Game ended:", result);
    },
    
    // Player actions
    setPlayerPosition: (position) => set({ playerPosition: position }),
    setCameraPosition: (position) => set({ cameraPosition: position }),
    
    damagePlayer: (damage) => {
      set((state) => ({
        playerHealth: Math.max(0, state.playerHealth - damage)
      }));
      console.log("Player took", damage, "damage. Health:", get().playerHealth);
    },
    
    healPlayer: (amount) => {
      set((state) => ({
        playerHealth: Math.min(100, state.playerHealth + amount)
      }));
      console.log("Player healed for", amount, ". Health:", get().playerHealth);
    },
    
    // Zombie actions
    addZombie: (zombie) => {
      set((state) => ({
        zombies: [...state.zombies, zombie]
      }));
    },
    
    removeZombie: (id) => {
      set((state) => ({
        zombies: state.zombies.filter(z => z.id !== id),
        zombieKills: state.zombieKills + 1
      }));
      
      // Heal player for killing zombie
      get().healPlayer(10);
      console.log("Zombie removed. Total kills:", get().zombieKills);
    },
    
    damageZombie: (id, damage) => {
      set((state) => ({
        zombies: state.zombies.map(zombie =>
          zombie.id === id
            ? { ...zombie, health: Math.max(0, zombie.health - damage) }
            : zombie
        )
      }));
      console.log("Zombie", id, "took", damage, "damage");
    },
    
    // Bullet actions
    fireBullet: (position, direction) => {
      const bulletId = `bullet_${Date.now()}_${Math.random()}`;
      const bullet: Bullet = {
        id: bulletId,
        position: [...position],
        direction: [...direction],
        speed: 20
      };
      
      set((state) => ({
        bullets: [...state.bullets, bullet]
      }));
      console.log("Fired bullet:", bulletId);
    },
    
    removeBullet: (id) => {
      set((state) => ({
        bullets: state.bullets.filter(b => b.id !== id)
      }));
    },
    
    // Boss actions
    damageBoss: (damage) => {
      set((state) => ({
        bossHealth: Math.max(0, state.bossHealth - damage)
      }));
      console.log("Boss took", damage, "damage. Health:", get().bossHealth);
    },
    
    // UI actions
    setCurrentObjective: (objective) => set({ currentObjective: objective })
  }))
);
