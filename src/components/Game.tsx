import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Play, RotateCcw, Apple, Cherry, Grape, Banana, Zap, Star } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import Snake from './Snake';
import Food from './Food';
import Obstacle from './Obstacle';
import Achievement from './Achievement';
import PowerUpEffect from './PowerUpEffect';

const GRID_SIZE = 20;
const CELL_SIZE = 20;

export default function Game() {
  const {
    snake,
    food,
    obstacles,
    direction,
    score,
    highScore,
    level,
    combo,
    isPaused,
    isGameOver,
    effects,
    achievements,
    moveSnake,
    setDirection,
    togglePause,
    resetGame,
    addObstacle,
    generateFood,
  } = useGameStore();

  // Initialize food when game starts
  useEffect(() => {
    if (!food) {
      generateFood();
    }
  }, [food, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        togglePause();
        return;
      }

      const keyDirections: { [key: string]: { x: number; y: number } } = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
      };

      if (keyDirections[e.key]) {
        const newDirection = keyDirections[e.key];
        const isOpposite = 
          direction.x === -newDirection.x || 
          direction.y === -newDirection.y;
        
        if (!isOpposite) {
          setDirection(newDirection);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, setDirection, togglePause]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      const gameLoop = setInterval(moveSnake, effects.speedBoost ? 80 : 150);
      return () => clearInterval(gameLoop);
    }
  }, [isPaused, isGameOver, moveSnake, effects.speedBoost]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-emerald-500 to-teal-600 p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-4">
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <Trophy className="text-yellow-500" />
            <span className="text-lg font-bold">High Score: {highScore}</span>
          </motion.div>
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <Star className="text-emerald-500" />
            <span className="text-lg font-bold">Level {level}</span>
          </motion.div>
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <Trophy className="text-emerald-500" />
            <span className="text-lg font-bold">Score: {score}</span>
          </motion.div>
        </div>

        <AnimatePresence>
          {combo > 0 && (
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="text-center mb-2"
            >
              <span className="inline-block bg-gradient-to-r from-yellow-400 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                {combo}x Combo!
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-2 mb-2">
          {Object.entries(effects).map(([effect, active]) => 
            active && (
              <motion.div
                key={effect}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs flex items-center gap-1"
              >
                <Zap className="w-3 h-3" />
                {effect.replace(/([A-Z])/g, ' $1').trim()}
              </motion.div>
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
          {obstacles.map((obstacle, index) => (
            <Obstacle
              key={`${obstacle.x}-${obstacle.y}-${index}`}
              position={obstacle}
              cellSize={CELL_SIZE}
            />
          ))}
          {Object.entries(effects).map(([effect, active]) => 
            active && (
              <PowerUpEffect 
                key={effect} 
                type={effect as keyof typeof effects} 
              />
            )
          )}
        </div>

        <div className="mt-4 flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePause}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <Play className="w-4 h-4" />
            {isPaused ? 'Start' : 'Pause'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetGame}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </motion.button>
        </div>

        <AnimatePresence>
          {isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white p-6 rounded-lg text-center"
              >
                <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
                <p className="mb-2">Level: {level}</p>
                <p className="mb-4">Final Score: {score}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetGame}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  Play Again
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="mt-6 text-white text-center">
        <p className="text-sm">Use arrow keys to move • Space to pause</p>
        <div className="mt-2 flex gap-4 justify-center">
          <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-1">
            <Apple className="text-red-500 w-4 h-4" /> Speed Boost
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-1">
            <Cherry className="text-pink-500 w-4 h-4" /> Ghost Mode
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-1">
            <Grape className="text-purple-500 w-4 h-4" /> Double Points
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-1">
            <Banana className="text-yellow-400 w-4 h-4" /> Invincible
          </motion.div>
        </div>
      </div>

      {/* Achievement notifications */}
      {achievements.map(achievement => (
        <Achievement
          key={achievement.id}
          title={achievement.title}
          description={achievement.description}
          isVisible={achievement.unlocked}
        />
      ))}
    </div>
  );
}