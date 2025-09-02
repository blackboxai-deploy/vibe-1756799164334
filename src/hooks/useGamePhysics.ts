"use client";

import { useCallback } from 'react';
import { Bird, Pipe, GameCustomization } from '@/types/game';
import { GAME_CONFIG, DIFFICULTY_SETTINGS, BIRD_SIZE_MULTIPLIERS } from '@/lib/gameConstants';

export const useGamePhysics = (customization: GameCustomization) => {
  const difficultySettings = DIFFICULTY_SETTINGS[customization.difficulty];
  
  // Update bird physics
  const updateBird = useCallback((bird: Bird, jump: boolean): Bird => {
    const sizeMultiplier = BIRD_SIZE_MULTIPLIERS[customization.birdSize];
    const gravity = difficultySettings.gravity;
    const jumpStrength = difficultySettings.jumpStrength;
    
    let newVelocity = bird.velocity + gravity;
    
    if (jump) {
      newVelocity = jumpStrength;
    }
    
    // Apply terminal velocity
    const maxVelocity = GAME_CONFIG.bird.physics.maxVelocity;
    newVelocity = Math.max(-maxVelocity, Math.min(maxVelocity, newVelocity));
    
    const newY = Math.max(0, Math.min(
      GAME_CONFIG.canvas.height - GAME_CONFIG.game.groundHeight - (bird.height * sizeMultiplier),
      bird.y + newVelocity
    ));
    
    // Calculate rotation based on velocity
    const rotation = Math.max(-30, Math.min(30, newVelocity * 3));
    
    return {
      ...bird,
      y: newY,
      velocity: newVelocity,
      rotation,
      width: GAME_CONFIG.bird.defaultSize.width * sizeMultiplier,
      height: GAME_CONFIG.bird.defaultSize.height * sizeMultiplier,
    };
  }, [customization.birdSize, customization.difficulty, difficultySettings]);
  
  // Update pipes
  const updatePipes = useCallback((pipes: Pipe[]): Pipe[] => {
    const pipeSpeed = difficultySettings.pipeSpeed;
    
    return pipes
      .map(pipe => ({
        ...pipe,
        x: pipe.x - pipeSpeed,
      }))
      .filter(pipe => pipe.x + pipe.width > -100); // Remove pipes that are off-screen
  }, [difficultySettings.pipeSpeed]);
  
  // Generate new pipe
  const generatePipe = useCallback((lastPipeX: number): Pipe => {
    const pipeGap = difficultySettings.pipeGap;
    const spawnRate = difficultySettings.spawnRate;
    const canvasHeight = GAME_CONFIG.canvas.height;
    const groundHeight = GAME_CONFIG.game.groundHeight;
    const skyHeight = GAME_CONFIG.game.skyHeight;
    
    const minTopHeight = skyHeight + 50;
    const maxTopHeight = canvasHeight - groundHeight - pipeGap - 50;
    const topHeight = Math.random() * (maxTopHeight - minTopHeight) + minTopHeight;
    
    return {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      x: lastPipeX + spawnRate,
      width: GAME_CONFIG.pipes.width,
      topHeight,
      bottomY: topHeight + pipeGap,
      gap: pipeGap,
      passed: false,
    };
  }, [difficultySettings]);
  
  // Check collision between bird and pipe
  const checkCollision = useCallback((bird: Bird, pipe: Pipe): boolean => {
    if (customization.gameMode === 'zen') return false;
    
    const sizeMultiplier = BIRD_SIZE_MULTIPLIERS[customization.birdSize];
    const birdWidth = bird.width * sizeMultiplier;
    const birdHeight = bird.height * sizeMultiplier;
    
    // Check if bird is within pipe's horizontal bounds
    if (bird.x < pipe.x + pipe.width && bird.x + birdWidth > pipe.x) {
      // Check collision with top pipe
      if (bird.y < pipe.topHeight) {
        return true;
      }
      // Check collision with bottom pipe
      if (bird.y + birdHeight > pipe.bottomY) {
        return true;
      }
    }
    return false;
  }, [customization.birdSize, customization.gameMode]);
  
  // Check ground collision
  const checkGroundCollision = useCallback((bird: Bird): boolean => {
    if (customization.gameMode === 'zen') return false;
    
    const sizeMultiplier = BIRD_SIZE_MULTIPLIERS[customization.birdSize];
    const groundY = GAME_CONFIG.canvas.height - GAME_CONFIG.game.groundHeight;
    return bird.y + (bird.height * sizeMultiplier) >= groundY;
  }, [customization.birdSize, customization.gameMode]);
  
  // Check ceiling collision
  const checkCeilingCollision = useCallback((bird: Bird): boolean => {
    if (customization.gameMode === 'zen') return false;
    return bird.y <= GAME_CONFIG.game.skyHeight;
  }, [customization.gameMode]);
  
  // Check if bird passed through pipe for scoring
  const checkPipePass = useCallback((bird: Bird, pipe: Pipe): boolean => {
    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      return true;
    }
    return false;
  }, []);
  
  return {
    updateBird,
    updatePipes,
    generatePipe,
    checkCollision,
    checkGroundCollision,
    checkCeilingCollision,
    checkPipePass,
    difficultySettings,
  };
};