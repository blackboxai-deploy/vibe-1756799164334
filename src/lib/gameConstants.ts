import { GameConfig, BirdColor, BackgroundTheme, PipeStyle } from '@/types/game';

export const GAME_CONFIG: GameConfig = {
  canvas: {
    width: 800,
    height: 600,
  },
  bird: {
    defaultSize: {
      width: 32,
      height: 24,
    },
    physics: {
      gravity: 0.5,
      jumpStrength: -8.5,
      maxVelocity: 10,
      terminal: 8,
    },
  },
  pipes: {
    width: 80,
    gap: 150,
    speed: 2,
    spawnDistance: 300,
  },
  game: {
    groundHeight: 80,
    skyHeight: 50,
  },
};

export const BIRD_COLORS: Record<BirdColor, string> = {
  yellow: '#FFD700',
  blue: '#1E90FF',
  red: '#FF4444',
  green: '#32CD32',
  purple: '#9370DB',
  orange: '#FF8C00',
  pink: '#FF69B4',
  white: '#FFFFFF',
  black: '#333333',
};

export const BACKGROUND_THEMES: Record<BackgroundTheme, {
  sky: string;
  skyGradient: string[];
  ground: string;
  accent: string;
}> = {
  day: {
    sky: '#87CEEB',
    skyGradient: ['#87CEEB', '#98D8E8'],
    ground: '#DEB887',
    accent: '#228B22',
  },
  night: {
    sky: '#191970',
    skyGradient: ['#191970', '#000080'],
    ground: '#2F4F4F',
    accent: '#FFD700',
  },
  sunset: {
    sky: '#FF6B47',
    skyGradient: ['#FF6B47', '#FF8E53'],
    ground: '#8B4513',
    accent: '#FF4500',
  },
  space: {
    sky: '#0B0B2F',
    skyGradient: ['#0B0B2F', '#1A1A3A'],
    ground: '#36454F',
    accent: '#9370DB',
  },
  underwater: {
    sky: '#006994',
    skyGradient: ['#006994', '#0080B3'],
    ground: '#8B7D6B',
    accent: '#20B2AA',
  },
  forest: {
    sky: '#228B22',
    skyGradient: ['#228B22', '#32CD32'],
    ground: '#8B4513',
    accent: '#556B2F',
  },
};

export const PIPE_STYLES: Record<PipeStyle, {
  color: string;
  borderColor: string;
  pattern: 'solid' | 'gradient' | 'stripes';
}> = {
  classic: {
    color: '#32CD32',
    borderColor: '#228B22',
    pattern: 'solid',
  },
  metal: {
    color: '#C0C0C0',
    borderColor: '#808080',
    pattern: 'gradient',
  },
  candy: {
    color: '#FF69B4',
    borderColor: '#FF1493',
    pattern: 'stripes',
  },
  neon: {
    color: '#00FFFF',
    borderColor: '#0080FF',
    pattern: 'gradient',
  },
  stone: {
    color: '#696969',
    borderColor: '#2F4F4F',
    pattern: 'solid',
  },
};

export const DIFFICULTY_SETTINGS = {
  easy: {
    gravity: 0.4,
    jumpStrength: -7.5,
    pipeSpeed: 1.5,
    pipeGap: 180,
    spawnRate: 350,
  },
  normal: {
    gravity: 0.5,
    jumpStrength: -8.5,
    pipeSpeed: 2,
    pipeGap: 150,
    spawnRate: 300,
  },
  hard: {
    gravity: 0.6,
    jumpStrength: -9,
    pipeSpeed: 2.5,
    pipeGap: 120,
    spawnRate: 280,
  },
  expert: {
    gravity: 0.7,
    jumpStrength: -9.5,
    pipeSpeed: 3,
    pipeGap: 100,
    spawnRate: 250,
  },
};

export const BIRD_SIZE_MULTIPLIERS = {
  small: 0.8,
  medium: 1.0,
  large: 1.2,
};

export const GAME_MODES = {
  classic: {
    name: 'Classic',
    description: 'Traditional Flappy Bird gameplay',
    hasTimeLimit: false,
    hasLives: false,
  },
  timeAttack: {
    name: 'Time Attack',
    description: 'Score as much as possible in 60 seconds',
    hasTimeLimit: true,
    timeLimit: 60,
    hasLives: false,
  },
  survival: {
    name: 'Survival',
    description: '3 lives, increasing difficulty',
    hasTimeLimit: false,
    hasLives: true,
    lives: 3,
  },
  zen: {
    name: 'Zen Mode',
    description: 'Relaxed gameplay with no collisions',
    hasTimeLimit: false,
    hasLives: false,
    noCollisions: true,
  },
};

export const STORAGE_KEYS = {
  HIGH_SCORE: 'flappybird_highscore',
  CUSTOMIZATION: 'flappybird_customization',
  STATS: 'flappybird_stats',
  SETTINGS: 'flappybird_settings',
};

export const SOUNDS = {
  JUMP: 'jump',
  SCORE: 'score',
  COLLISION: 'collision',
  MENU: 'menu',
};

export const PARTICLE_CONFIGS = {
  jump: {
    count: 8,
    colors: ['#FFD700', '#FFA500', '#FF6347'],
    life: 30,
    speed: 2,
  },
  collision: {
    count: 15,
    colors: ['#FF4444', '#FF6B47', '#FFD700'],
    life: 45,
    speed: 4,
  },
  score: {
    count: 12,
    colors: ['#32CD32', '#00FF00', '#ADFF2F'],
    life: 60,
    speed: 1.5,
  },
};