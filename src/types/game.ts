export interface Bird {
  x: number;
  y: number;
  width: number;
  height: number;
  velocity: number;
  rotation: number;
  color: string;
  shape: BirdShape;
  size: BirdSize;
}

export interface Pipe {
  x: number;
  topHeight: number;
  bottomY: number;
  width: number;
  gap: number;
  passed: boolean;
  id: string;
}

export interface GameState {
  status: 'menu' | 'playing' | 'paused' | 'gameOver';
  score: number;
  highScore: number;
  pipes: Pipe[];
  bird: Bird;
  gameSpeed: number;
  gravity: number;
  jumpStrength: number;
}

export interface GameCustomization {
  birdColor: BirdColor;
  birdShape: BirdShape;
  birdSize: BirdSize;
  backgroundTheme: BackgroundTheme;
  pipeStyle: PipeStyle;
  difficulty: DifficultyLevel;
  particleEffects: boolean;
  weatherEffects: boolean;
  gameMode: GameMode;
}

export type BirdColor = 
  | 'yellow' | 'blue' | 'red' | 'green' 
  | 'purple' | 'orange' | 'pink' | 'white' | 'black';

export type BirdShape = 'round' | 'square' | 'triangle';

export type BirdSize = 'small' | 'medium' | 'large';

export type BackgroundTheme = 
  | 'day' | 'night' | 'sunset' | 'space' | 'underwater' | 'forest';

export type PipeStyle = 'classic' | 'metal' | 'candy' | 'neon' | 'stone';

export type DifficultyLevel = 'easy' | 'normal' | 'hard' | 'expert';

export type GameMode = 'classic' | 'timeAttack' | 'survival' | 'zen';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface GameStats {
  totalGames: number;
  bestScore: number;
  totalScore: number;
  averageScore: number;
  playtime: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface GameConfig {
  canvas: Size;
  bird: {
    defaultSize: Size;
    physics: {
      gravity: number;
      jumpStrength: number;
      maxVelocity: number;
      terminal: number;
    };
  };
  pipes: {
    width: number;
    gap: number;
    speed: number;
    spawnDistance: number;
  };
  game: {
    groundHeight: number;
    skyHeight: number;
  };
}