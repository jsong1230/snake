import React from 'react';

type ObstacleProps = {
  position: { x: number; y: number };
  cellSize: number;
};

export default function Obstacle({ position, cellSize }: ObstacleProps) {
  return (
    <div
      className="absolute bg-red-500 rounded-sm"
      style={{
        left: position.x * cellSize,
        top: position.y * cellSize,
        width: cellSize - 1,
        height: cellSize - 1,
        boxShadow: '0 0 5px rgba(239, 68, 68, 0.5)',
      }}
    />
  );
}