import { useRef, useEffect } from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  BIRD_WIDTH,
  BIRD_HEIGHT,
  PIPE_WIDTH,
  PIPE_GAP,
} from '../utils/constants';

interface GameCanvasProps {
  jump: () => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ jump }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { bird, pipes, isGameOver } = useGameLogic();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw background
    ctx.fillStyle = '#70c5ce';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw bird
    ctx.fillStyle = 'yellow';
    ctx.fillRect(CANVAS_WIDTH / 2, bird.y, BIRD_WIDTH, BIRD_HEIGHT);

    // Draw pipes
    ctx.fillStyle = 'green';
    pipes.forEach((pipe) => {
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.height);
      ctx.fillRect(pipe.x, pipe.height + PIPE_GAP, PIPE_WIDTH, CANVAS_HEIGHT);
    });

    if (isGameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
  }, [bird, pipes, isGameOver]);

  const handleClick = () => {
    jump();
  };

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="border-2 border-black"
      onClick={handleClick}
    />
  );
};

export default GameCanvas;