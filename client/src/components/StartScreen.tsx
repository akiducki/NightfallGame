import { useGameState } from "../lib/stores/useGameState";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

export default function StartScreen() {
  const { startGame } = useGameState();

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-red-900 via-gray-900 to-black"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ff0000' fill-opacity='0.1'%3E%3Cpath d='M10 10h80v80H10z'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '100px 100px'
      }}
    >
      <Card className="w-full max-w-2xl mx-4 bg-black/80 border-red-800 shadow-2xl">
        <CardContent className="pt-8 pb-6 text-center">
          <h1 className="text-6xl font-bold text-red-500 mb-4 tracking-wider">
            NIGHTFALL
          </h1>
          <h2 className="text-3xl font-semibold text-red-300 mb-8">
            Last Stand
          </h2>
          
          <div className="space-y-4 max-w-md mx-auto text-gray-300 mb-8">
            <p className="text-lg">
              The city has fallen. Zombies roam the streets.
            </p>
            <p className="text-sm">
              You must survive the night and reach the cave at the hilltop.
            </p>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={startGame}
              className="w-full max-w-xs bg-red-700 hover:bg-red-600 text-white font-bold py-3 px-6 text-lg border-2 border-red-500"
            >
              START GAME
            </Button>
            
            <div className="text-sm text-gray-400 space-y-1">
              <p>Controls: WASD or Arrow Keys to move</p>
              <p>Space or Mouse to shoot</p>
              <p>VR Compatible - Enter VR mode in supported browsers</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
