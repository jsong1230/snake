import { create } from 'zustand';
import { FoodType, foodPoints } from '../components/Food';

type Position = {
  x: number;
  y: number;
};

type GameState = {
  snake: Position[];
  food: { type: FoodType; position: Position } | null;
  obstacles: Position[];
  direction: { x: number; y: number };
  score: number;
  highScore: number;
  level: number;
  combo: number;
  isPaused: boolean;
  isGameOver: boolean;
  effects: {
    speedBoost: boolean;
    ghostMode: boolean;
    doublePoints: boolean;
    invincible: boolean;
  };
  achievements: {
    id: string;
    title: string;
    description: string;
    unlocked: boolean;
  }[];
};

type GameActions = {
  moveSnake: () => void;
  setDirection: (direction: { x: number; y: number }) => void;
  togglePause: () => void;
  resetGame: () => void;
  addObstacle: () => void;
  updateScore: (points: number) => void;
  setEffect: (effect: keyof GameState['effects'], value: boolean) => void;
  unlockAchievement: (id: string) => void;
  generateFood: () => void;
};

const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const GRID_SIZE = 20;

const INITIAL_ACHIEVEMENTS = [
  {
    id: 'first-fruit',
    title: 'First Bite',
    description: 'Eat your first fruit',
    unlocked: false,
  },
  {
    id: 'speed-demon',
    title: 'Speed Demon',
    description: 'Collect 3 speed boosts in one game',
    unlocked: false,
  },
  {
    id: 'ghost-master',
    title: 'Ghost Master',
    description: 'Stay in ghost mode for 30 seconds total',
    unlocked: false,
  },
  {
    id: 'combo-king',
    title: 'Combo King',
    description: 'Achieve a 5x combo',
    unlocked: false,
  },
];

const FOOD_TYPES: FoodType[] = ['apple', 'cherry', 'grape', 'banana'];

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  snake: INITIAL_SNAKE,
  food: null,
  obstacles: [],
  direction: { x: 1, y: 0 },
  score: 0,
  highScore: 0,
  level: 1,
  combo: 0,
  isPaused: true,
  isGameOver: false,
  effects: {
    speedBoost: false,
    ghostMode: false,
    doublePoints: false,
    invincible: false,
  },
  achievements: INITIAL_ACHIEVEMENTS,

  generateFood: () => {
    const state = get();
    let position;
    let attempts = 0;
    const maxAttempts = 100;

    do {
      position = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      attempts++;

      // Check if position is valid (not on snake or obstacles)
      const isValidPosition = !state.snake.some(segment => 
        segment.x === position.x && segment.y === position.y
      ) && !state.obstacles.some(obstacle => 
        obstacle.x === position.x && obstacle.y === position.y
      );

      if (isValidPosition || attempts >= maxAttempts) {
        const type = FOOD_TYPES[Math.floor(Math.random() * FOOD_TYPES.length)];
        set({ food: { type, position } });
        break;
      }
    } while (true);
  },

  moveSnake: () => {
    const state = get();
    if (state.isPaused || state.isGameOver) return;

    const head = state.snake[0];
    const newHead = {
      x: head.x + state.direction.x,
      y: head.y + state.direction.y,
    };

    // Handle ghost mode wrapping
    if (state.effects.ghostMode) {
      newHead.x = (newHead.x + GRID_SIZE) % GRID_SIZE;
      newHead.y = (newHead.y + GRID_SIZE) % GRID_SIZE;
    }

    // Check collisions
    const hitWall = !state.effects.ghostMode && (
      newHead.x < 0 || newHead.x >= GRID_SIZE ||
      newHead.y < 0 || newHead.y >= GRID_SIZE
    );

    const hitSelf = !state.effects.invincible && state.snake.some(
      (segment, i) => i !== 0 && segment.x === newHead.x && segment.y === newHead.y
    );

    const hitObstacle = !state.effects.invincible && state.obstacles.some(
      obs => obs.x === newHead.x && obs.y === newHead.y
    );

    if (hitWall || hitSelf || hitObstacle) {
      set({ isGameOver: true });
      return;
    }

    const newSnake = [newHead, ...state.snake];
    
    // Handle food collision
    if (state.food && newHead.x === state.food.position.x && newHead.y === state.food.position.y) {
      const points = foodPoints[state.food.type] * (state.effects.doublePoints ? 2 : 1) * Math.min(state.combo + 1, 5);
      
      // Update score and check achievements
      get().updateScore(points);
      
      // Apply food effect
      switch (state.food.type) {
        case 'apple':
          get().setEffect('speedBoost', true);
          setTimeout(() => get().setEffect('speedBoost', false), 5000);
          break;
        case 'cherry':
          get().setEffect('ghostMode', true);
          setTimeout(() => get().setEffect('ghostMode', false), 7000);
          break;
        case 'grape':
          get().setEffect('doublePoints', true);
          setTimeout(() => get().setEffect('doublePoints', false), 10000);
          break;
        case 'banana':
          get().setEffect('invincible', true);
          setTimeout(() => get().setEffect('invincible', false), 8000);
          break;
      }

      // Generate new food
      get().generateFood();
    } else {
      newSnake.pop();
    }

    set({ snake: newSnake });
  },

  setDirection: (direction) => set({ direction }),
  
  togglePause: () => set(state => ({ isPaused: !state.isPaused })),
  
  resetGame: () => {
    const state = get();
    set({
      snake: INITIAL_SNAKE,
      direction: { x: 1, y: 0 },
      score: 0,
      level: 1,
      combo: 0,
      isPaused: true,
      isGameOver: false,
      obstacles: [],
      effects: {
        speedBoost: false,
        ghostMode: false,
        doublePoints: false,
        invincible: false,
      },
    });
    state.generateFood();
  },

  addObstacle: () => {
    const state = get();
    const newObstacle = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };

    // Ensure obstacle doesn't spawn on snake or food
    const isValidPosition = !state.snake.some(segment => 
      segment.x === newObstacle.x && segment.y === newObstacle.y
    ) && !(state.food && 
      state.food.position.x === newObstacle.x && 
      state.food.position.y === newObstacle.y
    );

    if (isValidPosition) {
      set(state => ({ obstacles: [...state.obstacles, newObstacle] }));
    }
  },

  updateScore: (points) => set(state => {
    const newScore = state.score + points;
    const newHighScore = Math.max(state.highScore, newScore);
    return { score: newScore, highScore: newHighScore };
  }),

  setEffect: (effect, value) => set(state => ({
    effects: { ...state.effects, [effect]: value }
  })),

  unlockAchievement: (id) => set(state => ({
    achievements: state.achievements.map(achievement =>
      achievement.id === id ? { ...achievement, unlocked: true } : achievement
    )
  })),
}));