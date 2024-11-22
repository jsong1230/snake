import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Play, RotateCcw, Apple, Cherry, Grape, Banana, Zap } from 'lucide-react';
import Snake from './Snake';
import Food, { foodPoints, FoodType } from './Food';

type Position = {
  x: number;
  y: number;
};

type FoodItem = {
  type: FoodType;
  position: Position;
};

type GameEffects = {
  speedBoost: boolean;
  ghostMode: boolean;
  doublePoints: boolean;
  invincible: boolean;
};

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const BASE_SPEED = 150;
const BOOST_SPEED = 80;
const INITIAL_SNAKE: Position[] = [{ x: 10, y: 10 }];
const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

const INITIAL_EFFECTS: GameEffects = {
  speedBoost: false,
  ghostMode: false,
  doublePoints: false,
  invincible: false,
};

export default function Game() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<FoodItem | null>(null);
  const [direction, setDirection] = useState(DIRECTIONS.RIGHT);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [effects, setEffects] = useState<GameEffects>(INITIAL_EFFECTS);
  const [effectTimers, setEffectTimers] = useState<{ [key: string]: NodeJS.Timeout }>();

  const generateFood = useCallback(() => {
    const position = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    const types: FoodType[] = ['apple', 'cherry', 'grape', 'banana'];
    const type = types[Math.floor(Math.random() * types.length)];
    return { position, type };
  }, []);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood());
    setDirection(DIRECTIONS.RIGHT);
    setIsGameOver(false);
    setIsPaused(true);
    setScore(0);
    setEffects(INITIAL_EFFECTS);
    Object.values(effectTimers || {}).forEach(timer => clearTimeout(timer));
  }, [generateFood, effectTimers]);

  useEffect(() => {
    if (!food) {
      setFood(generateFood());
    }
  }, [food, generateFood]);

  const applyFoodEffect = useCallback((foodType: FoodType) => {
    const newEffects = { ...INITIAL_EFFECTS };
    let duration = 0;

    switch (foodType) {
      case 'apple': // Speed boost
        newEffects.speedBoost = true;
        duration = 5000;
        break;
      case 'cherry': // Ghost mode (pass through walls)
        newEffects.ghostMode = true;
        duration = 7000;
        break;
      case 'grape': // Double points
        newEffects.doublePoints = true;
        duration = 10000;
        break;
      case 'banana': // Invincibility
        newEffects.invincible = true;
        duration = 8000;
        break;
    }

    setEffects(newEffects);

    // Clear existing timer for this effect
    if (effectTimers?.[foodType]) {
      clearTimeout(effectTimers[foodType]);
    }

    // Set new timer
    const timer = setTimeout(() => {
      setEffects(prev => ({ ...prev, [Object.keys(newEffects)[0]]: false }));
    }, duration);

    setEffectTimers(prev => ({ ...prev, [foodType]: timer }));
  }, [effectTimers]);

  const checkCollision = useCallback((pos: Position) => {
    if (effects.ghostMode) {
      // Wrap around the grid
      pos.x = (pos.x + GRID_SIZE) % GRID_SIZE;
      pos.y = (pos.y + GRID_SIZE) % GRID_SIZE;
      return false;
    }
    return pos.x < 0 || pos.x >= GRID_SIZE || pos.y < 0 || pos.y >= GRID_SIZE;
  }, [effects.ghostMode]);

  const checkSelfCollision = useCallback((head: Position, snakeBody: Position[]) => {
    if (effects.invincible) return false;
    return snakeBody.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y);
  }, [effects.invincible]);

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      let newHead = {
        x: head.x + direction.x,
        y: head.y + direction.y,
      };

      if (effects.ghostMode) {
        newHead.x = (newHead.x + GRID_SIZE) % GRID_SIZE;
        newHead.y = (newHead.y + GRID_SIZE) % GRID_SIZE;
      }

      if (checkCollision(newHead) || checkSelfCollision(newHead, prevSnake)) {
        setIsGameOver(true);
        if (score > highScore) {
          setHighScore(score);
        }
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (food && newHead.x === food.position.x && newHead.y === food.position.y) {
        const points = foodPoints[food.type] * (effects.doublePoints ? 2 : 1);
        setScore(prev => prev + points);
        applyFoodEffect(food.type);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isPaused, isGameOver, checkCollision, checkSelfCollision, generateFood, score, highScore, effects.doublePoints, applyFoodEffect]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        setIsPaused((prev) => !prev);
        return;
      }

      const keyDirections: { [key: string]: typeof DIRECTIONS[keyof typeof DIRECTIONS] } = {
        ArrowUp: DIRECTIONS.UP,
        ArrowDown: DIRECTIONS.DOWN,
        ArrowLeft: DIRECTIONS.LEFT,
        ArrowRight: DIRECTIONS.RIGHT,
      };

      if (keyDirections[e.key]) {
        const newDirection = keyDirections[e.key];
        setDirection((prevDir) => {
          const isOpposite = prevDir.x === -newDirection.x || prevDir.y === -newDirection.y;
          return isOpposite ? prevDir : newDirection;
        });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, effects.speedBoost ? BOOST_SPEED : BASE_SPEED);
    return () => clearInterval(gameLoop);
  }, [moveSnake, effects.speedBoost]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-emerald-500 to-teal-600 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="text-yellow-500" />
            <span className="text-lg font-bold">High Score: {highScore}</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="text-emerald-500" />
            <span className="text-lg font-bold">Score: {score}</span>
          </div>
        </div>

        {/* Active Effects Display */}
        <div className="flex gap-2 mb-2">
          {Object.entries(effects).map(([effect, active]) => 
            active && (
              <div key={effect} className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                <Zap className="w-3 h-3" />
                {effect.replace(/([A-Z])/g, ' $1').trim()}
              </div>
            )
          )}
        </div>

        <div className="relative bg-gray-100 rounded-lg overflow-hidden"
             style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}>
          <Snake 
            segments={snake} 
            cellSize={CELL_SIZE} 
            ghostMode={effects.ghostMode}
            invincible={effects.invincible}
          />
          {food && (
            <Food
              type={food.type}
              position={food.position}
              cellSize={CELL_SIZE}
            />
          )}
        </div>

        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={() => setIsPaused((prev) => !prev)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <Play className="w-4 h-4" />
            {isPaused ? 'Start' : 'Pause'}
          </button>
          <button
            onClick={resetGame}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        {isGameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg text-center">
              <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
              <p className="mb-4">Final Score: {score}</p>
              <button
                onClick={resetGame}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 text-white text-center">
        <p className="text-sm">Use arrow keys to move • Space to pause</p>
        <div className="mt-2 flex gap-4 justify-center">
          <div className="flex items-center gap-1">
            <Apple className="text-red-500 w-4 h-4" /> Speed Boost
          </div>
          <div className="flex items-center gap-1">
            <Cherry className="text-pink-500 w-4 h-4" /> Ghost Mode
          </div>
          <div className="flex items-center gap-1">
            <Grape className="text-purple-500 w-4 h-4" /> Double Points
          </div>
          <div className="flex items-center gap-1">
            <Banana className="text-yellow-400 w-4 h-4" /> Invincible
          </div>
        </div>
      </div>
    </div>
  );
}