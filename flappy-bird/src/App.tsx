import GameCanvas from './components/GameCanvas';
import ScoreDisplay from './components/ScoreDisplay';
import GameOver from './components/GameOver';
import { useGameLogic } from './hooks/useGameLogic';

const App: React.FC = () => {
  const { score, isGameOver, startGame, jump } = useGameLogic();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-200">
      <h1 className="text-4xl font-bold mb-4">Flappy Bird</h1>
      <ScoreDisplay score={score} />
      <GameCanvas jump={jump} />
      {isGameOver && <GameOver score={score} onRestart={startGame} />}
    </div>
  );
};

export default App;