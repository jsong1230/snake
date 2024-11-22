import React from 'react';
import { motion } from 'framer-motion';

type PowerUpEffectProps = {
  type: 'speedBoost' | 'ghostMode' | 'doublePoints' | 'invincible';
};

const effectColors = {
  speedBoost: 'from-yellow-400 to-orange-500',
  ghostMode: 'from-blue-400 to-purple-500',
  doublePoints: 'from-green-400 to-emerald-500',
  invincible: 'from-pink-400 to-red-500',
};

export default function PowerUpEffect({ type }: PowerUpEffectProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: [1, 1.2, 1],
        opacity: [0.8, 0.6, 0],
      }}
      transition={{ duration: 0.5 }}
      className={`absolute inset-0 bg-gradient-radial ${effectColors[type]} pointer-events-none`}
    />
  );
}