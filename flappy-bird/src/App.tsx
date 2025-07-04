import React from 'react';
import GameCanvas from './components/GameCanvas';
import ScoreDisplay from './components/ScoreDisplay';
import GameOver from './components/GameOver';
import { useGameLogic } from './hooks/useGameLogic';

const App: React.FC = () => {
  const { score, isGameOver, startGame, jump } = useGameLogic();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex flex-col items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-bounce"></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-yellow-300 bg-opacity-20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-pink-300 bg-opacity-20 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-blue-300 bg-opacity-10 rounded-full animate-pulse delay-500"></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Modern title */}
        <div className="mb-8 text-center">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 bg-clip-text text-transparent mb-2 drop-shadow-lg">
            🐦 Flappy Bird
          </h1>
          <p className="text-white text-lg font-medium opacity-90 max-w-md">
            Navigate through the pipes and beat your high score!
          </p>
        </div>
        
        {/* Score display */}
        <ScoreDisplay score={score} />
        
        {/* Game canvas */}
        <div className="mb-6">
          <GameCanvas jump={jump} />
        </div>
        
        {/* Instructions */}
        <div className="text-center text-white bg-black bg-opacity-20 rounded-xl p-4 backdrop-blur-sm max-w-md">
          <h3 className="font-semibold mb-2">🎮 How to Play</h3>
          <p className="text-sm opacity-90">
            Click or tap to make the bird flap its wings. Avoid the pipes and try to get the highest score possible!
          </p>
        </div>
        
        {/* Modern footer */}
        <div className="mt-8 text-center text-white opacity-70">
          <p className="text-sm">
            Built with ❤️ using React + TypeScript + Canvas
          </p>
        </div>
      </div>
      
      {/* Game Over Modal */}
      {isGameOver && <GameOver score={score} onRestart={startGame} />}
    </div>
  );
};

export default App;