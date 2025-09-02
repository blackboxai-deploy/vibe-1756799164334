"use client";

import React, { useRef, useEffect, useCallback } from 'react';
import { GameState, Particle, GameCustomization, Bird, Pipe } from '@/types/game';
import { GAME_CONFIG, BACKGROUND_THEMES, PIPE_STYLES, BIRD_COLORS, BIRD_SIZE_MULTIPLIERS } from '@/lib/gameConstants';

interface FlappyBirdGameProps {
  gameState: GameState;
  particles: Particle[];
  customization: GameCustomization;
  onJump: () => void;
  onStart: () => void;
  onReset: () => void;
  className?: string;
}

export const FlappyBirdGame: React.FC<FlappyBirdGameProps> = ({
  gameState,
  particles,
  customization,
  onJump,
  onStart,
  onReset,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Handle keyboard and mouse inputs
  const handleInput = useCallback((event: KeyboardEvent | MouseEvent) => {
    if (event instanceof KeyboardEvent) {
      if (event.code === 'Space' || event.code === 'ArrowUp') {
        event.preventDefault();
        if (gameState.status === 'playing') {
          onJump();
        } else if (gameState.status === 'menu' || gameState.status === 'gameOver') {
          onStart();
        }
      } else if (event.code === 'Escape') {
        if (gameState.status === 'playing') {
          // Could add pause functionality here
        } else if (gameState.status === 'gameOver') {
          onReset();
        }
      }
    }
  }, [gameState.status, onJump, onStart, onReset]);

  const handleCanvasClick = useCallback(() => {
    if (gameState.status === 'playing') {
      onJump();
    } else if (gameState.status === 'menu' || gameState.status === 'gameOver') {
      onStart();
    }
  }, [gameState.status, onJump, onStart]);

  // Setup event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleInput);
    return () => window.removeEventListener('keydown', handleInput);
  }, [handleInput]);

  // Draw bird
  const drawBird = useCallback((ctx: CanvasRenderingContext2D, bird: Bird) => {
    const sizeMultiplier = BIRD_SIZE_MULTIPLIERS[customization.birdSize];
    const width = bird.width * sizeMultiplier;
    const height = bird.height * sizeMultiplier;
    
    ctx.save();
    ctx.translate(bird.x + width / 2, bird.y + height / 2);
    ctx.rotate((bird.rotation * Math.PI) / 180);
    
    ctx.fillStyle = BIRD_COLORS[customization.birdColor];
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    
    switch (customization.birdShape) {
      case 'round':
        ctx.beginPath();
        ctx.ellipse(0, 0, width / 2, height / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Eye
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.ellipse(width / 6, -height / 6, width / 8, height / 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.ellipse(width / 6, -height / 6, width / 16, height / 16, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Beak
        ctx.fillStyle = '#FFA500';
        ctx.beginPath();
        ctx.moveTo(width / 2, 0);
        ctx.lineTo(width / 2 + width / 4, 0);
        ctx.lineTo(width / 2, height / 8);
        ctx.closePath();
        ctx.fill();
        break;
        
      case 'square':
        ctx.fillRect(-width / 2, -height / 2, width, height);
        ctx.strokeRect(-width / 2, -height / 2, width, height);
        
        // Eye
        ctx.fillStyle = '#fff';
        ctx.fillRect(width / 8, -height / 4, width / 6, height / 6);
        ctx.fillStyle = '#000';
        ctx.fillRect(width / 6, -height / 6, width / 12, height / 12);
        break;
        
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(0, -height / 2);
        ctx.lineTo(-width / 2, height / 2);
        ctx.lineTo(width / 2, height / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Eye
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.ellipse(0, 0, width / 8, height / 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.ellipse(0, 0, width / 16, height / 16, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
    }
    
    ctx.restore();
  }, [customization.birdColor, customization.birdShape, customization.birdSize]);

  // Draw pipe
  const drawPipe = useCallback((ctx: CanvasRenderingContext2D, pipe: Pipe) => {
    const pipeStyle = PIPE_STYLES[customization.pipeStyle];
    
    ctx.fillStyle = pipeStyle.color;
    ctx.strokeStyle = pipeStyle.borderColor;
    ctx.lineWidth = 3;
    
    // Top pipe
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
    ctx.strokeRect(pipe.x, 0, pipe.width, pipe.topHeight);
    
    // Bottom pipe
    const bottomHeight = GAME_CONFIG.canvas.height - GAME_CONFIG.game.groundHeight - pipe.bottomY;
    ctx.fillRect(pipe.x, pipe.bottomY, pipe.width, bottomHeight);
    ctx.strokeRect(pipe.x, pipe.bottomY, pipe.width, bottomHeight);
    
    // Pipe caps
    const capHeight = 30;
    const capWidth = pipe.width + 10;
    const capX = pipe.x - 5;
    
    // Top cap
    ctx.fillRect(capX, pipe.topHeight - capHeight, capWidth, capHeight);
    ctx.strokeRect(capX, pipe.topHeight - capHeight, capWidth, capHeight);
    
    // Bottom cap
    ctx.fillRect(capX, pipe.bottomY, capWidth, capHeight);
    ctx.strokeRect(capX, pipe.bottomY, capWidth, capHeight);
    
    // Add pattern based on style
    if (pipeStyle.pattern === 'stripes') {
      ctx.strokeStyle = pipeStyle.borderColor;
      ctx.lineWidth = 2;
      const stripeSpacing = 8;
      
      for (let y = 0; y < pipe.topHeight; y += stripeSpacing) {
        ctx.beginPath();
        ctx.moveTo(pipe.x, y);
        ctx.lineTo(pipe.x + pipe.width, y);
        ctx.stroke();
      }
      
      for (let y = pipe.bottomY; y < GAME_CONFIG.canvas.height - GAME_CONFIG.game.groundHeight; y += stripeSpacing) {
        ctx.beginPath();
        ctx.moveTo(pipe.x, y);
        ctx.lineTo(pipe.x + pipe.width, y);
        ctx.stroke();
      }
    }
  }, [customization.pipeStyle]);

  // Draw background
  const drawBackground = useCallback((ctx: CanvasRenderingContext2D) => {
    const theme = BACKGROUND_THEMES[customization.backgroundTheme];
    const canvasWidth = GAME_CONFIG.canvas.width;
    const canvasHeight = GAME_CONFIG.canvas.height;
    const groundHeight = GAME_CONFIG.game.groundHeight;
    
    // Sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight - groundHeight);
    theme.skyGradient.forEach((color, index) => {
      gradient.addColorStop(index / (theme.skyGradient.length - 1), color);
    });
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight - groundHeight);
    
    // Ground
    ctx.fillStyle = theme.ground;
    ctx.fillRect(0, canvasHeight - groundHeight, canvasWidth, groundHeight);
    
    // Ground line
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, canvasHeight - groundHeight);
    ctx.lineTo(canvasWidth, canvasHeight - groundHeight);
    ctx.stroke();
    
    // Add theme-specific details
    if (customization.backgroundTheme === 'night') {
      // Stars
      ctx.fillStyle = '#FFD700';
      for (let i = 0; i < 20; i++) {
        const x = (i * 137) % canvasWidth;
        const y = (i * 71) % (canvasHeight - groundHeight - 100);
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (customization.backgroundTheme === 'space') {
      // Nebula effect
      ctx.fillStyle = 'rgba(147, 112, 219, 0.3)';
      for (let i = 0; i < 10; i++) {
        const x = (i * 173) % canvasWidth;
        const y = (i * 89) % (canvasHeight - groundHeight);
        const radius = 20 + (i % 3) * 15;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [customization.backgroundTheme]);

  // Draw particles
  const drawParticles = useCallback((ctx: CanvasRenderingContext2D) => {
    particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = alpha;
      
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }, [particles]);

  // Draw UI overlay
  const drawUI = useCallback((ctx: CanvasRenderingContext2D) => {
    const canvasWidth = GAME_CONFIG.canvas.width;
    const canvasHeight = GAME_CONFIG.canvas.height;
    
    // Score
    if (gameState.status === 'playing' || gameState.status === 'gameOver') {
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 4;
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      
      const scoreText = gameState.score.toString();
      const x = canvasWidth / 2;
      const y = 80;
      
      ctx.strokeText(scoreText, x, y);
      ctx.fillText(scoreText, x, y);
    }
    
    // Game over screen
    if (gameState.status === 'gameOver') {
      // Semi-transparent overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      
      // Game Over text
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.font = 'bold 36px Arial';
      ctx.textAlign = 'center';
      
      ctx.strokeText('GAME OVER', canvasWidth / 2, canvasHeight / 2 - 50);
      ctx.fillText('GAME OVER', canvasWidth / 2, canvasHeight / 2 - 50);
      
      // Final score
      ctx.font = 'bold 24px Arial';
      ctx.strokeText(`Final Score: ${gameState.score}`, canvasWidth / 2, canvasHeight / 2 + 10);
      ctx.fillText(`Final Score: ${gameState.score}`, canvasWidth / 2, canvasHeight / 2 + 10);
      
      // High score
      if (gameState.score === gameState.highScore && gameState.score > 0) {
        ctx.fillStyle = '#FFD700';
        ctx.strokeText('NEW HIGH SCORE!', canvasWidth / 2, canvasHeight / 2 + 50);
        ctx.fillText('NEW HIGH SCORE!', canvasWidth / 2, canvasHeight / 2 + 50);
      } else {
        ctx.fillStyle = '#ccc';
        ctx.strokeText(`Best: ${gameState.highScore}`, canvasWidth / 2, canvasHeight / 2 + 50);
        ctx.fillText(`Best: ${gameState.highScore}`, canvasWidth / 2, canvasHeight / 2 + 50);
      }
      
      // Instructions
      ctx.fillStyle = '#fff';
      ctx.font = '18px Arial';
      ctx.strokeText('Click or press SPACE to play again', canvasWidth / 2, canvasHeight / 2 + 100);
      ctx.fillText('Click or press SPACE to play again', canvasWidth / 2, canvasHeight / 2 + 100);
    }
    
    // Menu screen
    if (gameState.status === 'menu') {
      // Semi-transparent overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      
      // Title
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 4;
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      
      ctx.strokeText('FLAPPY BIRD', canvasWidth / 2, canvasHeight / 2 - 50);
      ctx.fillText('FLAPPY BIRD', canvasWidth / 2, canvasHeight / 2 - 50);
      
      // Instructions
      ctx.font = '24px Arial';
      ctx.lineWidth = 2;
      ctx.strokeText('Click or press SPACE to start', canvasWidth / 2, canvasHeight / 2 + 20);
      ctx.fillText('Click or press SPACE to start', canvasWidth / 2, canvasHeight / 2 + 20);
      
      // High score
      if (gameState.highScore > 0) {
        ctx.fillStyle = '#FFD700';
        ctx.font = '20px Arial';
        ctx.strokeText(`High Score: ${gameState.highScore}`, canvasWidth / 2, canvasHeight / 2 + 60);
        ctx.fillText(`High Score: ${gameState.highScore}`, canvasWidth / 2, canvasHeight / 2 + 60);
      }
    }
  }, [gameState]);

  // Main render function
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, GAME_CONFIG.canvas.width, GAME_CONFIG.canvas.height);
    
    // Draw everything
    drawBackground(ctx);
    
    // Draw pipes
    gameState.pipes.forEach(pipe => drawPipe(ctx, pipe));
    
    // Draw bird
    drawBird(ctx, gameState.bird);
    
    // Draw particles
    drawParticles(ctx);
    
    // Draw UI
    drawUI(ctx);
  }, [gameState, drawBackground, drawPipe, drawBird, drawParticles, drawUI]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      render();
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [render]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={GAME_CONFIG.canvas.width}
        height={GAME_CONFIG.canvas.height}
        onClick={handleCanvasClick}
        className="border border-gray-300 rounded-lg cursor-pointer bg-sky-100"
        style={{ 
          maxWidth: '100%', 
          height: 'auto',
          aspectRatio: `${GAME_CONFIG.canvas.width} / ${GAME_CONFIG.canvas.height}`
        }}
      />
      
      {/* Touch controls for mobile */}
      <div className="md:hidden mt-4 text-center text-sm text-gray-600">
        Tap the game area to jump!
      </div>
    </div>
  );
};