import React from 'react';
import { motion } from 'framer-motion';
import { Apple, Cherry, Grape, Banana } from 'lucide-react';

export type FoodType = 'apple' | 'cherry' | 'grape' | 'banana';

type FoodProps = {
  type: FoodType;
  position: { x: number; y: number };
  cellSize: number;
};

const foodIcons = {
  apple: Apple,
  cherry: Cherry,
  grape: Grape,
  banana: Banana,
};

const foodColors = {
  apple: 'text-red-500',
  cherry: 'text-pink-500',
  grape: 'text-purple-500',
  banana: 'text-yellow-400',
};

const foodGlow = {
  apple: 'shadow-[0_0_15px_rgba(239,68,68,0.5)]',
  cherry: 'shadow-[0_0_15px_rgba(236,72,153,0.5)]',
  grape: 'shadow-[0_0_15px_rgba(168,85,247,0.5)]',
  banana: 'shadow-[0_0_15px_rgba(250,204,21,0.5)]',
};

export const foodPoints = {
  apple: 1,
  cherry: 2,
  grape: 3,
  banana: 5,
};

export default function Food({ type, position, cellSize }: FoodProps) {
  const Icon = foodIcons[type];
  
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      className={`absolute ${foodColors[type]} ${foodGlow[type]} transition-all duration-200`}
      style={{
        left: position.x * cellSize,
        top: position.y * cellSize,
        width: cellSize,
        height: cellSize,
        filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.5))',
      }}
    >
      <motion.div
        animate={{ 
          y: [0, -2, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="bg-gray-800/20 rounded-full p-1"
      >
        <Icon className="w-full h-full" strokeWidth={2.5} />
      </motion.div>
    </motion.div>
  );
}