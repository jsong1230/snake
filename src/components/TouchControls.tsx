import React from 'react';
import { useGesture } from '@use-gesture/react';

type TouchControlsProps = {
  onDirectionChange: (direction: { x: number; y: number }) => void;
};

export default function TouchControls({ onDirectionChange }: TouchControlsProps) {
  const bind = useGesture({
    onDrag: ({ movement: [mx, my], first, last }) => {
      if (first || last) return;

      const threshold = 30;
      const absX = Math.abs(mx);
      const absY = Math.abs(my);

      if (absX > absY && absX > threshold) {
        onDirectionChange({ x: Math.sign(mx), y: 0 });
      } else if (absY > absX && absY > threshold) {
        onDirectionChange({ x: 0, y: Math.sign(my) });
      }
    },
  });

  return (
    <div
      {...bind()}
      className="fixed inset-0 touch-none z-10"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    />
  );
}