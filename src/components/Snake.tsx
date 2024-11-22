import React from 'react';

type SnakeProps = {
  segments: Array<{ x: number; y: number }>;
  cellSize: number;
  ghostMode: boolean;
  invincible: boolean;
};

export default function Snake({ segments, cellSize, ghostMode, invincible }: SnakeProps) {
  return (
    <>
      {segments.map((segment, index) => {
        const isHead = index === 0;
        const tailPosition = index / segments.length;
        
        return (
          <div
            key={index}
            className={`absolute rounded-lg transition-all duration-100 ${
              isHead ? 'bg-emerald-400' : 'bg-emerald-500'
            } ${ghostMode ? 'opacity-50' : ''} ${invincible ? 'animate-pulse' : ''}`}
            style={{
              left: segment.x * cellSize,
              top: segment.y * cellSize,
              width: cellSize - 1,
              height: cellSize - 1,
              opacity: ghostMode ? 0.5 : (isHead ? 1 : 0.8 - tailPosition * 0.3),
              transform: isHead ? 'scale(1.1)' : 'scale(1)',
              boxShadow: isHead ? '0 0 10px rgba(52, 211, 153, 0.5)' : 'none',
              filter: invincible ? 'drop-shadow(0 0 8px rgb(52, 211, 153))' : 'none',
            }}
          >
            {isHead && (
              <>
                <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full" />
                <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full" />
              </>
            )}
          </div>
        );
      })}
    </>
  );
}