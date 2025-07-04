import { useRef, useEffect, useState } from 'react';
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

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ jump }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { bird, pipes, isGameOver } = useGameLogic();
  const [particles, setParticles] = useState<Particle[]>([]);
  const [birdRotation, setBirdRotation] = useState(0);
  const [wingPhase, setWingPhase] = useState(0);
  const frameCount = useRef(0);

  // Create flap particles
  const createFlapParticles = (x: number, y: number) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 8; i++) {
      newParticles.push({
        x: x + Math.random() * 20 - 10,
        y: y + Math.random() * 20 - 10,
        vx: Math.random() * 4 - 2,
        vy: Math.random() * 2 - 1,
        life: 30,
        maxLife: 30,
        color: `hsl(${200 + Math.random() * 60}, 70%, 80%)`,
        size: Math.random() * 3 + 2,
      });
    }
    setParticles((prev: Particle[]) => [...prev, ...newParticles]);
  };

  // Update particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev: Particle[]) => 
        prev.map((p: Particle) => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.1,
          life: p.life - 1,
        })).filter((p: Particle) => p.life > 0)
      );
    }, 16);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    frameCount.current++;
    setWingPhase(frameCount.current * 0.3);
    setBirdRotation(Math.max(-0.5, Math.min(0.5, bird.velocity * 0.05)));

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw animated background with gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(0.7, '#98D8E8');
    gradient.addColorStop(1, '#B0E0E6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw clouds
    const cloudOffset = (frameCount.current * 0.5) % (CANVAS_WIDTH + 100);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 3; i++) {
      const x = (i * 150 - cloudOffset) % (CANVAS_WIDTH + 100) - 50;
      const y = 50 + i * 30;
      drawCloud(ctx, x, y);
    }

    // Draw pipes with 3D effect
    ctx.save();
    pipes.forEach((pipe) => {
      drawPipe(ctx, pipe.x, 0, pipe.height, true); // Top pipe
      drawPipe(ctx, pipe.x, pipe.height + PIPE_GAP, CANVAS_HEIGHT - pipe.height - PIPE_GAP, false); // Bottom pipe
    });
    ctx.restore();

    // Draw particles
    particles.forEach((particle: Particle) => {
      const alpha = particle.life / particle.maxLife;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw modern bird with SVG-like graphics
    ctx.save();
    ctx.translate(CANVAS_WIDTH / 2 + BIRD_WIDTH / 2, bird.y + BIRD_HEIGHT / 2);
    ctx.rotate(birdRotation);
    drawModernBird(ctx, wingPhase);
    ctx.restore();

    // Draw game over overlay
    if (isGameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      ctx.font = '16px Arial';
      ctx.fillText('Click to restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
    }
  }, [bird, pipes, isGameOver, particles, birdRotation, wingPhase]);

  const drawCloud = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.arc(x + 15, y, 20, 0, Math.PI * 2);
    ctx.arc(x + 30, y, 15, 0, Math.PI * 2);
    ctx.arc(x + 15, y - 15, 18, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawPipe = (ctx: CanvasRenderingContext2D, x: number, y: number, height: number, isTop: boolean) => {
    // Main pipe body with gradient
    const gradient = ctx.createLinearGradient(x, 0, x + PIPE_WIDTH, 0);
    gradient.addColorStop(0, '#228B22');
    gradient.addColorStop(0.3, '#32CD32');
    gradient.addColorStop(0.7, '#228B22');
    gradient.addColorStop(1, '#006400');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, PIPE_WIDTH, height);
    
    // Pipe cap
    const capHeight = 30;
    const capWidth = PIPE_WIDTH + 10;
    const capX = x - 5;
    const capY = isTop ? y + height - capHeight : y;
    
    const capGradient = ctx.createLinearGradient(capX, 0, capX + capWidth, 0);
    capGradient.addColorStop(0, '#32CD32');
    capGradient.addColorStop(0.5, '#3CB371');
    capGradient.addColorStop(1, '#228B22');
    
    ctx.fillStyle = capGradient;
    ctx.fillRect(capX, capY, capWidth, capHeight);
    
    // Pipe highlights and shadows
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(x + 2, y, 3, height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(x + PIPE_WIDTH - 3, y, 3, height);
  };

  const drawModernBird = (ctx: CanvasRenderingContext2D, phase: number) => {
    const wingOffset = Math.sin(phase) * 5;
    
    // Bird shadow
    ctx.save();
    ctx.translate(2, 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(0, 0, BIRD_WIDTH / 2, BIRD_HEIGHT / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    // Bird body gradient
    const bodyGradient = ctx.createRadialGradient(-5, -5, 5, 0, 0, BIRD_WIDTH / 2);
    bodyGradient.addColorStop(0, '#FFD700');
    bodyGradient.addColorStop(0.7, '#FFA500');
    bodyGradient.addColorStop(1, '#FF8C00');
    
    ctx.fillStyle = bodyGradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, BIRD_WIDTH / 2, BIRD_HEIGHT / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Wing
    ctx.fillStyle = '#FF6347';
    ctx.beginPath();
    ctx.ellipse(-8, wingOffset, 12, 8, -0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // Wing detail
    ctx.fillStyle = '#DC143C';
    ctx.beginPath();
    ctx.ellipse(-8, wingOffset, 8, 5, -0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // Beak
    ctx.fillStyle = '#FF4500';
    ctx.beginPath();
    ctx.moveTo(BIRD_WIDTH / 2 - 5, -3);
    ctx.lineTo(BIRD_WIDTH / 2 + 8, 0);
    ctx.lineTo(BIRD_WIDTH / 2 - 5, 3);
    ctx.closePath();
    ctx.fill();
    
    // Eye
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(5, -8, 6, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(7, -8, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Eye shine
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(8, -9, 1, 0, Math.PI * 2);
    ctx.fill();
  };

  const handleClick = () => {
    createFlapParticles(CANVAS_WIDTH / 2, bird.y + BIRD_HEIGHT / 2);
    jump();
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-4 border-amber-600 rounded-lg shadow-2xl cursor-pointer"
        onClick={handleClick}
      />
      <div className="absolute bottom-4 left-4 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
        Click or tap to flap!
      </div>
    </div>
  );
};

export default GameCanvas;