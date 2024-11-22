import React from 'react';
import { motion } from 'framer-motion';

type ObstacleProps = {
  position: { x: number; y: number };
  cellSize: number;
};

export default function Obstacle({ position, cellSize }: ObstacleProps) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="absolute bg-red-500"
      style={{
        left: position.x * cellSize,
        top: position.y * cellSize,
        width: cellSize - 1,
        height: cellSize - 1,
        boxShadow: '0 0 10px rgba(239, 68, 68, 0.7)',
        clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)',
      }}
    >
      <motion.div
        className="absolute inset-0 bg-red-400"
        animate={{
          opacity: [0.6, 0.3, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
}