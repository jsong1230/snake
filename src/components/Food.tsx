import React from 'react';
import { Apple, Cherry, Grape, Banana } from 'lucide-react';

export type FoodType = 'apple' | 'cherry' | 'grape' | 'banana';

type FoodProps = {
  type: FoodType;
  position: { x: number; y: number };
  cellSize: number;
};

const foodColors = {
  apple: 'text-red-500',
  cherry: 'text-pink-500',
  grape: 'text-purple-500',
  banana: 'text-yellow-400',
};

const foodPoints = {
  apple: 1,
  cherry: 2,
  grape: 3,
  banana: 5,
};

const FoodIcons = {
  apple: Apple,
  cherry: Cherry,
  grape: Grape,
  banana: Banana,
};

export default function Food({ type, position, cellSize }: FoodProps) {
  const Icon = FoodIcons[type];
  
  return (
    <div
      className={`absolute ${foodColors[type]} transition-all duration-200 animate-bounce`}
      style={{
        left: position.x * cellSize,
        top: position.y * cellSize,
        width: cellSize,
        height: cellSize,
      }}
    >
      <Icon className="w-full h-full" />
    </div>
  );
}

export { foodPoints };