import React from 'react';

interface GameOverProps {
  score: number;
  onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, onRestart }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 rounded-3xl shadow-2xl transform animate-pulse max-w-md mx-4">
        <div className="text-center text-white">
          <div className="mb-6">
            <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Game Over!
            </h2>
            <div className="text-6xl mb-4">💥</div>
          </div>
          
          <div className="mb-6 p-4 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
            <p className="text-lg mb-2">Final Score</p>
            <p className="text-3xl font-bold text-yellow-300">{score}</p>
          </div>
          
          <button
            onClick={onRestart}
            className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span className="flex items-center justify-center space-x-2">
              <span>🚀</span>
              <span>Play Again</span>
              <span>🚀</span>
            </span>
          </button>
          
          <p className="text-sm mt-4 opacity-80">
            Click the button or tap the screen to restart!
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full opacity-70 animate-bounce"></div>
        <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-pink-400 rounded-full opacity-70 animate-bounce delay-150"></div>
        <div className="absolute top-1/2 -left-2 w-4 h-4 bg-blue-400 rounded-full opacity-70 animate-bounce delay-300"></div>
      </div>
    </div>
  );
};

export default GameOver;