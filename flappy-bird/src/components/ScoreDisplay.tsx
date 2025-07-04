import React from 'react';

interface ScoreDisplayProps {
  score: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => {
  return (
    <div className="relative mb-6">
      <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white text-3xl font-bold px-8 py-4 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-yellow-200">⭐</span>
          <span>Score: {score}</span>
          <span className="text-yellow-200">⭐</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 rounded-2xl transform -skew-x-12"></div>
      </div>
      <div className="absolute -top-1 -left-1 -right-1 -bottom-1 bg-gradient-to-r from-yellow-500 via-orange-600 to-red-600 rounded-2xl -z-10 opacity-50 blur-sm"></div>
    </div>
  );
};

export default ScoreDisplay;