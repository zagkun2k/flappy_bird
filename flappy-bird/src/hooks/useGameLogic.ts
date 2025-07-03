import { useState, useEffect, useCallback } from 'react';
import { Bird, Pipe } from '../types/game';
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  BIRD_HEIGHT,
  BIRD_WIDTH,
  PIPE_WIDTH,
  PIPE_GAP,
  GRAVITY,
  JUMP_FORCE,
  PIPE_SPEED,
  PIPE_INTERVAL,
} from '../utils/constants';

export const useGameLogic = () => {
  const [bird, setBird] = useState<Bird>({ y: CANVAS_HEIGHT / 2, velocity: 0 });
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);

  const jump = useCallback(() => {
    if (!isGameOver) {
      setBird((prev) => ({ ...prev, velocity: JUMP_FORCE }));
      if (!isGameStarted) {
        setIsGameStarted(true);
      }
    }
  }, [isGameOver, isGameStarted]);

  const startGame = useCallback(() => {
    setBird({ y: CANVAS_HEIGHT / 2, velocity: 0 });
    setPipes([]);
    setScore(0);
    setIsGameOver(false);
    setIsGameStarted(false);
  }, []);

  useEffect(() => {
    if (!isGameStarted || isGameOver) return;

    const gameLoop = setInterval(() => {
      setBird((prev) => {
        const newY = prev.y + prev.velocity;
        const newVelocity = prev.velocity + GRAVITY;

        if (newY > CANVAS_HEIGHT - BIRD_HEIGHT || newY < 0) {
          setIsGameOver(true);
          return prev;
        }

        return { y: newY, velocity: newVelocity };
      });

      setPipes((prev) => {
        const newPipes = prev
          .map((pipe) => ({ ...pipe, x: pipe.x - PIPE_SPEED }))
          .filter((pipe) => pipe.x > -PIPE_WIDTH);

        return newPipes;
      });

      setScore((prev) => prev + 0.1);
    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [isGameStarted, isGameOver]);

  useEffect(() => {
    if (!isGameStarted || isGameOver) return;

    const pipeGenerator = setInterval(() => {
      const pipeHeight = Math.random() * (CANVAS_HEIGHT - PIPE_GAP - 100) + 50;
      setPipes((prev) => [...prev, { x: CANVAS_WIDTH, height: pipeHeight }]);
    }, PIPE_INTERVAL);

    return () => clearInterval(pipeGenerator);
  }, [isGameStarted, isGameOver]);

  useEffect(() => {
    pipes.forEach((pipe) => {
      const birdLeft = CANVAS_WIDTH / 2;
      const birdRight = birdLeft + BIRD_WIDTH;
      const birdTop = bird.y;
      const birdBottom = bird.y + BIRD_HEIGHT;
      const pipeLeft = pipe.x;
      const pipeRight = pipe.x + PIPE_WIDTH;
      const pipeTop = pipe.height;
      const pipeBottom = pipe.height + PIPE_GAP;

      if (
        birdRight > pipeLeft &&
        birdLeft < pipeRight &&
        (birdTop < pipeTop || birdBottom > pipeBottom)
      ) {
        setIsGameOver(true);
      }
    });
  }, [bird, pipes]);

  return { bird, pipes, score: Math.floor(score), isGameOver, startGame, jump };
};