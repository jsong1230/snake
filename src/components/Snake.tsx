import React from 'react';
import { motion } from 'framer-motion';
import { useSkinStore } from '../store/skinStore';
import { SnakeSkin } from '../types/game';

type SnakeProps = {
  segments: Array<{ x: number; y: number }>;
  cellSize: number;
  ghostMode: boolean;
  invincible: boolean;
};

const skinStyles: Record<SnakeSkin, (index: number, total: number) => string> = {
  default: () => 'bg-emerald-500',
  neon: () => 'bg-emerald-400',
  pixel: () => 'bg-emerald-600',
  rainbow: (index, total) => {
    const hue = (index / total) * 360;
    return `bg-[hsl(${hue},70%,60%)]`;
  },
  golden: () => 'bg-gradient-to-r from-yellow-400 to-yellow-500',
};

export default function Snake({ segments, cellSize, ghostMode, invincible }: SnakeProps) {
  const { currentSkin } = useSkinStore();

  return (
    <>
      {segments.map((segment, index) => {
        const isHead = index === 0;
        const isTail = index === segments.length - 1;
        const skinStyle = skinStyles[currentSkin](index, segments.length);
        
        return (
          <motion.div
            key={`${segment.x}-${segment.y}-${index}`}
            initial={{ scale: isHead ? 1.1 : 1 }}
            animate={{ 
              scale: isHead ? 1.1 : 1,
            }}
            transition={{
              duration: 0.2
            }}
            className={`absolute rounded-lg ${skinStyle} ${
              ghostMode ? 'opacity-75' : 'opacity-100'
            } ${invincible ? 'animate-pulse' : ''}`}
            style={{
              left: segment.x * cellSize,
              top: segment.y * cellSize,
              width: cellSize - 1,
              height: cellSize - 1,
              zIndex: segments.length - index,
              boxShadow: isHead 
                ? '0 0 15px rgba(52, 211, 153, 0.8), inset 0 0 10px rgba(255, 255, 255, 0.5)' 
                : isTail 
                ? '0 0 10px rgba(52, 211, 153, 0.6), inset 0 0 5px rgba(255, 255, 255, 0.3)'
                : '0 0 8px rgba(52, 211, 153, 0.4), inset 0 0 3px rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            {isHead && (
              <>
                <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full shadow-lg" />
                <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full shadow-lg" />
              </>
            )}
            {isTail && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-20 rounded-lg"
                animate={{
                  opacity: [0.2, 0.1, 0.2],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
          </motion.div>
        );
      })}
    </>
  );
}