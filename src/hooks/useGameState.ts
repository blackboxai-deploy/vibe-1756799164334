"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, GameCustomization, Particle, GameStats } from '@/types/game';
import { GAME_CONFIG, STORAGE_KEYS, BIRD_COLORS, PARTICLE_CONFIGS } from '@/lib/gameConstants';
import { useGamePhysics } from './useGamePhysics';

const DEFAULT_CUSTOMIZATION: GameCustomization = {
  birdColor: 'yellow',
  birdShape: 'round',
  birdSize: 'medium',
  backgroundTheme: 'day',
  pipeStyle: 'classic',
  difficulty: 'normal',
  particleEffects: true,
  weatherEffects: false,
  gameMode: 'classic',
};

export const useGameState = (customization: GameCustomization = DEFAULT_CUSTOMIZATION) => {
  const [gameState, setGameState] = useState<GameState>({
    status: 'menu',
    score: 0,
    highScore: 0,
    pipes: [],
    bird: {
      x: 150,
      y: GAME_CONFIG.canvas.height / 2,
      width: GAME_CONFIG.bird.defaultSize.width,
      height: GAME_CONFIG.bird.defaultSize.height,
      velocity: 0,
      rotation: 0,
      color: BIRD_COLORS[customization.birdColor],
      shape: customization.birdShape,
      size: customization.birdSize,
    },
    gameSpeed: 1,
    gravity: GAME_CONFIG.bird.physics.gravity,
    jumpStrength: GAME_CONFIG.bird.physics.jumpStrength,
  });
  
  const [particles, setParticles] = useState<Particle[]>([]);
  const [gameStats, setGameStats] = useState<GameStats>({
    totalGames: 0,
    bestScore: 0,
    totalScore: 0,
    averageScore: 0,
    playtime: 0,
  });
  
  const gameLoopRef = useRef<number | null>(null);
  const lastPipeXRef = useRef<number>(GAME_CONFIG.canvas.width);
  const startTimeRef = useRef<number>(0);
  const timeLeftRef = useRef<number>(0);
  
  const physics = useGamePhysics(customization);
  
  // Load saved data from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem(STORAGE_KEYS.HIGH_SCORE);
    const savedStats = localStorage.getItem(STORAGE_KEYS.STATS);
    
    if (savedHighScore) {
      setGameState(prev => ({ ...prev, highScore: parseInt(savedHighScore) }));
    }
    
    if (savedStats) {
      setGameStats(JSON.parse(savedStats));
    }
  }, []);
  
  // Save high score and stats
  const saveGameData = useCallback((finalScore: number, gameTime: number) => {
    setGameState(prev => {
      const newHighScore = Math.max(prev.highScore, finalScore);
      localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, newHighScore.toString());
      return { ...prev, highScore: newHighScore };
    });
    
    setGameStats(prev => {
      const newStats = {
        totalGames: prev.totalGames + 1,
        bestScore: Math.max(prev.bestScore, finalScore),
        totalScore: prev.totalScore + finalScore,
        averageScore: Math.round((prev.totalScore + finalScore) / (prev.totalGames + 1)),
        playtime: prev.playtime + gameTime,
      };
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(newStats));
      return newStats;
    });
  }, []);
  
  // Create particles
  const createParticles = useCallback((x: number, y: number, type: 'jump' | 'collision' | 'score') => {
    if (!customization.particleEffects) return;
    
    const config = PARTICLE_CONFIGS[type];
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < config.count; i++) {
      const angle = (Math.PI * 2 * i) / config.count;
      newParticles.push({
        x,
        y,
        vx: Math.cos(angle) * config.speed * (0.5 + Math.random() * 0.5),
        vy: Math.sin(angle) * config.speed * (0.5 + Math.random() * 0.5),
        life: config.life,
        maxLife: config.life,
        color: config.colors[Math.floor(Math.random() * config.colors.length)],
        size: 2 + Math.random() * 3,
      });
    }
    
    setParticles(prev => [...prev, ...newParticles]);
  }, [customization.particleEffects]);
  
  // Update particles
  const updateParticles = useCallback(() => {
    setParticles(prev => 
      prev
        .map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vy: particle.vy + 0.1, // gravity
          life: particle.life - 1,
        }))
        .filter(particle => particle.life > 0)
    );
  }, []);
  
  // Jump action
  const jump = useCallback(() => {
    if (gameState.status !== 'playing') return;
    
    setGameState(prev => ({
      ...prev,
      bird: physics.updateBird(prev.bird, true),
    }));
    
    createParticles(gameState.bird.x + gameState.bird.width / 2, gameState.bird.y + gameState.bird.height / 2, 'jump');
  }, [gameState.status, gameState.bird, physics, createParticles]);
  
  // Start game
  const startGame = useCallback(() => {
    lastPipeXRef.current = GAME_CONFIG.canvas.width;
    startTimeRef.current = Date.now();
    timeLeftRef.current = customization.gameMode === 'timeAttack' ? 60 : 0;
    
    setGameState(prev => ({
      ...prev,
      status: 'playing',
      score: 0,
      pipes: [],
      bird: {
        x: 150,
        y: GAME_CONFIG.canvas.height / 2,
        width: GAME_CONFIG.bird.defaultSize.width,
        height: GAME_CONFIG.bird.defaultSize.height,
        velocity: 0,
        rotation: 0,
        color: BIRD_COLORS[customization.birdColor],
        shape: customization.birdShape,
        size: customization.birdSize,
      },
    }));
    
    setParticles([]);
  }, [customization.birdColor, customization.birdShape, customization.birdSize, customization.gameMode]);
  
  // End game
  const endGame = useCallback(() => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    
    const gameTime = Math.round((Date.now() - startTimeRef.current) / 1000);
    saveGameData(gameState.score, gameTime);
    
    createParticles(
      gameState.bird.x + gameState.bird.width / 2,
      gameState.bird.y + gameState.bird.height / 2,
      'collision'
    );
    
    setGameState(prev => ({ ...prev, status: 'gameOver' }));
  }, [gameState.score, gameState.bird, saveGameData, createParticles]);
  
  // Game loop
  const gameLoop = useCallback(() => {
    setGameState(prev => {
      if (prev.status !== 'playing') return prev;
      
      // Update bird
      const updatedBird = physics.updateBird(prev.bird, false);
      
      // Update pipes
      let updatedPipes = physics.updatePipes(prev.pipes);
      
      // Generate new pipes
      if (updatedPipes.length === 0 || updatedPipes[updatedPipes.length - 1].x < lastPipeXRef.current - physics.difficultySettings.spawnRate) {
        const newPipe = physics.generatePipe(lastPipeXRef.current);
        updatedPipes.push(newPipe);
        lastPipeXRef.current = newPipe.x;
      }
      
      // Check collisions
      let collision = false;
      if (physics.checkGroundCollision(updatedBird) || physics.checkCeilingCollision(updatedBird)) {
        collision = true;
      }
      
      for (const pipe of updatedPipes) {
        if (physics.checkCollision(updatedBird, pipe)) {
          collision = true;
          break;
        }
      }
      
      if (collision) {
        setTimeout(endGame, 0);
        return prev;
      }
      
      // Check scoring
      let newScore = prev.score;
      updatedPipes = updatedPipes.map(pipe => {
        if (physics.checkPipePass(updatedBird, pipe)) {
          newScore++;
          createParticles(pipe.x + pipe.width, GAME_CONFIG.canvas.height / 2, 'score');
          return { ...pipe, passed: true };
        }
        return pipe;
      });
      
      // Check time limit for time attack mode
      if (customization.gameMode === 'timeAttack') {
        const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
        timeLeftRef.current = Math.max(0, 60 - elapsed);
        
        if (timeLeftRef.current <= 0) {
          setTimeout(endGame, 0);
          return prev;
        }
      }
      
      return {
        ...prev,
        bird: updatedBird,
        pipes: updatedPipes,
        score: newScore,
      };
    });
    
    updateParticles();
    
    if (gameState.status === 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  }, [physics, endGame, updateParticles, createParticles, gameState.status, customization.gameMode]);
  
  // Start game loop when status changes to playing
  useEffect(() => {
    if (gameState.status === 'playing' && !gameLoopRef.current) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else if (gameState.status !== 'playing' && gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.status, gameLoop]);
  
  // Reset game to menu
  const resetGame = useCallback(() => {
    setGameState(prev => ({ ...prev, status: 'menu' }));
    setParticles([]);
  }, []);
  
  return {
    gameState,
    particles,
    gameStats,
    timeLeft: timeLeftRef.current,
    jump,
    startGame,
    endGame,
    resetGame,
  };
};