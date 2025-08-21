import { useGameState } from "../lib/stores/useGameState";
import { useAudio } from "../lib/stores/useAudio";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Volume2, VolumeX, Home } from "lucide-react";

export default function GameUI() {
  const { gamePhase, playerHealth, zombieKills, currentObjective, restartGame, goToMenu } = useGameState();
  const { isMuted, toggleMute } = useAudio();

  if (gamePhase === 'menu') return null;

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Crosshair cursor */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50">
        <div className="w-8 h-8 relative">
          {/* Horizontal crosshair line */}
          <div className="absolute top-1/2 left-1 right-1 h-0.5 bg-red-400 transform -translate-y-1/2 shadow-lg"></div>
          {/* Vertical crosshair line */}
          <div className="absolute left-1/2 top-1 bottom-1 w-0.5 bg-red-400 transform -translate-x-1/2 shadow-lg"></div>
          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg"></div>
        </div>
      </div>
      {/* Top HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto">
        <div className="bg-black/80 p-4 rounded-lg border border-red-800 min-w-[200px]">
          <div className="text-red-400 text-sm mb-2">Health</div>
          <Progress value={playerHealth} className="w-full h-3 bg-gray-800" />
          <div className="text-white text-xs mt-1">{playerHealth}/100</div>
        </div>

        <div className="bg-black/80 p-4 rounded-lg border border-red-800">
          <div className="text-red-400 text-sm">Kills: <span className="text-white">{zombieKills}</span></div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={toggleMute}
            variant="outline"
            size="sm"
            className="bg-black/80 border-red-800 hover:bg-red-900/50"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Button
            onClick={goToMenu}
            variant="outline"
            size="sm"
            className="bg-black/80 border-red-800 hover:bg-red-900/50"
          >
            <Home className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Objective and Wave Info */}
      {currentObjective && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 pointer-events-auto">
          <div className="bg-black/90 p-4 rounded-lg border border-red-800 text-center">
            <div className="text-red-400 text-sm mb-1">
              {gamePhase === 'prologue' ? 'Survival Room' : 'Objective'}
            </div>
            <div className="text-white">{currentObjective}</div>
            {gamePhase === 'prologue' && (
              <div className="text-yellow-400 text-xs mt-2">
                Clear all zombies to advance to next wave (Survive 5 waves to escape)
              </div>
            )}
          </div>
        </div>
      )}

      {/* Game Over Screens */}
      {(gamePhase === 'victory' || gamePhase === 'defeat') && (
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center pointer-events-auto">
          <div className="bg-black p-8 rounded-lg border-2 border-red-800 text-center max-w-md">
            <h2 className={`text-4xl font-bold mb-4 ${gamePhase === 'victory' ? 'text-green-400' : 'text-red-400'}`}>
              {gamePhase === 'victory' ? 'VICTORY!' : 'DEFEAT!'}
            </h2>
            <p className="text-gray-300 mb-6">
              {gamePhase === 'victory' 
                ? `You survived the nightmare! Zombies killed: ${zombieKills}`
                : `The darkness consumed you... Zombies killed: ${zombieKills}`
              }
            </p>
            <div className="space-y-3">
              <Button 
                onClick={restartGame}
                className="w-full bg-red-700 hover:bg-red-600"
              >
                Try Again
              </Button>
              <Button 
                onClick={goToMenu}
                variant="outline"
                className="w-full border-red-800 hover:bg-red-900/50"
              >
                Main Menu
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Chapter Transitions - Show briefly at top, non-blocking */}
      {gamePhase === 'prologue' && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center pointer-events-none z-10">
          <div className="bg-red-900/80 p-3 rounded-lg border border-red-600 animate-pulse">
            <h3 className="text-lg font-bold text-red-200 mb-1">PROLOGUE - Awakening</h3>
            <p className="text-red-100 text-xs">Break out of the abandoned room</p>
          </div>
        </div>
      )}
      
      {gamePhase === 'chapter1' && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center pointer-events-none z-10">
          <div className="bg-red-900/80 p-3 rounded-lg border border-red-600 animate-pulse">
            <h3 className="text-lg font-bold text-red-200 mb-1">CHAPTER 1 - City Streets</h3>
            <p className="text-red-100 text-xs">Fight through the infected city</p>
          </div>
        </div>
      )}
      
      {gamePhase === 'chapter2' && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center pointer-events-none z-10">
          <div className="bg-red-900/80 p-3 rounded-lg border border-red-600 animate-pulse">
            <h3 className="text-lg font-bold text-red-200 mb-1">CHAPTER 2 - Chaos</h3>
            <p className="text-red-100 text-xs">Survive the overwhelming horde</p>
          </div>
        </div>
      )}
      
      {gamePhase === 'chapter3' && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center pointer-events-none z-10">
          <div className="bg-red-900/80 p-3 rounded-lg border border-red-600 animate-pulse">
            <h3 className="text-lg font-bold text-red-200 mb-1">CHAPTER 3 - Final Stand</h3>
            <p className="text-red-100 text-xs">Face the boss in the cave</p>
          </div>
        </div>
      )}
    </div>
  );
}
