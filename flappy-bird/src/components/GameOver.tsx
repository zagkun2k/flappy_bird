interface GameOverProps {
  score: number;
  onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, onRestart }) => {
  return (
    <div className="absolute bg-white bg-opacity-80 p-6 rounded-lg shadow-lg flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-4">Game Over</h2>
      <p className="text-xl mb-4">Score: {score}</p>
      <button
        onClick={onRestart}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Restart
      </button>
    </div>
  );
};

export default GameOver;