import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Play, RotateCcw, Apple, Cherry, Grape, Banana, Zap, Star } from 'lucide-react';
import Snake from './Snake';
import Food, { foodPoints, FoodType } from './Food';
import Obstacle from './Obstacle';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const BASE_SPEED = 150;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];

export default function Game() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState<{ type: FoodType; position: { x: number; y: number } } | null>(null);
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [obstacles, setObstacles] = useState<Array<{ x: number; y: number }>>([]);
  const [effects, setEffects] = useState({
    speedBoost: false,
    ghostMode: false,
    doublePoints: false,
    invincible: false,
  });

  const generateFood = useCallback(() => {
    const position = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };

    const types: FoodType[] = ['apple', 'cherry', 'grape', 'banana'];
    const type = types[Math.floor(Math.random() * types.length)];

    setFood({ type, position });
  }, []);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection({ x: 1, y: 0 });
    setScore(0);
    setLevel(1);
    setCombo(0);
    setIsPaused(true);
    setIsGameOver(false);
    setObstacles([]);
    setEffects({
      speedBoost: false,
      ghostMode: false,
      doublePoints: false,
      invincible: false,
    });
    generateFood();
  }, [generateFood]);

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: head.x + direction.x,
        y: head.y + direction.y,
      };

      // Handle ghost mode wrapping
      if (effects.ghostMode) {
        newHead.x = (newHead.x + GRID_SIZE) % GRID_SIZE;
        newHead.y = (newHead.y + GRID_SIZE) % GRID_SIZE;
      }

      // Check collisions
      const hitWall = !effects.ghostMode && (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE
      );

      const hitSelf = !effects.invincible && prevSnake.some(
        (segment, i) => i !== 0 && segment.x === newHead.x && segment.y === newHead.y
      );

      const hitObstacle = !effects.invincible && obstacles.some(
        obs => obs.x === newHead.x && obs.y === newHead.y
      );

      if (hitWall || hitSelf || hitObstacle) {
        setIsGameOver(true);
        if (score > highScore) {
          setHighScore(score);
        }
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Handle food collision
      if (food && newHead.x === food.position.x && newHead.y === food.position.y) {
        const points = foodPoints[food.type] * (effects.doublePoints ? 2 : 1) * Math.min(combo + 1, 5);
        setScore(prev => prev + points);
        setCombo(prev => prev + 1);
        
        // Apply food effect
        const newEffects = { ...effects };
        switch (food.type) {
          case 'apple':
            newEffects.speedBoost = true;
            setTimeout(() => setEffects(prev => ({ ...prev, speedBoost: false })), 5000);
            break;
          case 'cherry':
            newEffects.ghostMode = true;
            setTimeout(() => setEffects(prev => ({ ...prev, ghostMode: false })), 7000);
            break;
          case 'grape':
            newEffects.doublePoints = true;
            setTimeout(() => setEffects(prev => ({ ...prev, doublePoints: false })), 10000);
            break;
          case 'banana':
            newEffects.invincible = true;
            setTimeout(() => setEffects(prev => ({ ...prev, invincible: false })), 8000);
            break;
        }
        setEffects(newEffects);
        generateFood();
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isPaused, isGameOver, effects, obstacles, score, highScore, combo, generateFood]);

  useEffect(() => {
    if (!food) {
      generateFood();
    }
  }, [food, generateFood]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, effects.speedBoost ? BASE_SPEED * 0.6 : BASE_SPEED);
    return () => clearInterval(gameLoop);
  }, [moveSnake, effects.speedBoost]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        setIsPaused(prev => !prev);
        return;
      }

      const keyDirections: { [key: string]: typeof direction } = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
      };

      if (keyDirections[e.key]) {
        const newDirection = keyDirections[e.key];
        setDirection(prevDir => {
          const isOpposite = prevDir.x === -newDirection.x || prevDir.y === -newDirection.y;
          return isOpposite ? prevDir : newDirection;
        });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-emerald-500 to-teal-600 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="text-yellow-500" />
            <span className="text-lg font-bold">High Score: {highScore}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="text-emerald-500" />
            <span className="text-lg font-bold">Level {level}</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="text-emerald-500" />
            <span className="text-lg font-bold">Score: {score}</span>
          </div>
        </div>

        {combo > 0 && (
          <div className="text-center mb-2">
            <span className="inline-block bg-gradient-to-r from-yellow-400 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
              {combo}x Combo!
            </span>
          </div>
        )}

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

        <div 
          className="relative bg-gray-900 rounded-lg overflow-hidden shadow-inner"
          style={{ 
            width: GRID_SIZE * CELL_SIZE, 
            height: GRID_SIZE * CELL_SIZE,
            border: '2px solid rgba(0,0,0,0.1)'
          }}
        >
          <div className="absolute inset-0 grid"
               style={{
                 gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                 gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
                 opacity: 0.15
               }}>
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
              <div key={i} className="border border-white/20" />
            ))}
          </div>

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
          {obstacles.map((obstacle, index) => (
            <Obstacle
              key={`${obstacle.x}-${obstacle.y}-${index}`}
              position={obstacle}
              cellSize={CELL_SIZE}
            />
          ))}
        </div>

        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={() => setIsPaused(prev => !prev)}
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
              <p className="mb-2">Level: {level}</p>
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