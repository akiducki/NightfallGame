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

      {/* Objective */}
      {currentObjective && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 pointer-events-auto">
          <div className="bg-black/90 p-4 rounded-lg border border-red-800 text-center">
            <div className="text-red-400 text-sm mb-1">Objective</div>
            <div className="text-white">{currentObjective}</div>
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

      {/* Chapter Transitions */}
      {gamePhase === 'prologue' && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="bg-black/90 p-6 rounded-lg border border-red-800">
            <h3 className="text-2xl font-bold text-red-400 mb-2">Awakening</h3>
            <p className="text-gray-300">You wake up in an abandoned room...</p>
          </div>
        </div>
      )}
    </div>
  );
}
