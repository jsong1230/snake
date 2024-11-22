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
      className={`absolute ${foodColors[type]} transition-all duration-200`}
      style={{
        left: position.x * cellSize,
        top: position.y * cellSize,
        width: cellSize,
        height: cellSize,
      }}
    >
      <motion.div
        animate={{ y: [0, -2, 0] }}
        transition={{ 
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Icon className="w-full h-full" />
      </motion.div>
    </motion.div>
  );
}