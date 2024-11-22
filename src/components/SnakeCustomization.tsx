import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, X, Lock, Check } from 'lucide-react';
import { useSkinStore } from '../store/skinStore';
import { SnakeSkin } from '../types/game';

type SnakeCustomizationProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SKINS: Array<{ id: SnakeSkin; name: string; price: number }> = [
  { id: 'default', name: 'Classic', price: 0 },
  { id: 'neon', name: 'Neon Glow', price: 1000 },
  { id: 'pixel', name: 'Pixel Art', price: 2000 },
  { id: 'rainbow', name: 'Rainbow', price: 5000 },
  { id: 'golden', name: 'Golden', price: 10000 },
];

export default function SnakeCustomization({ isOpen, onClose }: SnakeCustomizationProps) {
  const { currentSkin, unlockedSkins, points, setSkin, unlockSkin } = useSkinStore();

  const handleSkinSelect = (skin: SnakeSkin, price: number) => {
    if (unlockedSkins.includes(skin)) {
      setSkin(skin);
    } else if (points >= price) {
      unlockSkin(skin);
      setSkin(skin);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Palette className="w-6 h-6 text-emerald-500" />
                <h2 className="text-2xl font-bold text-gray-900">Snake Skins</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-600">Points: {points}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {SKINS.map((skin) => {
                const isUnlocked = unlockedSkins.includes(skin.id);
                const isSelected = currentSkin === skin.id;
                const canAfford = points >= skin.price;

                return (
                  <motion.button
                    key={skin.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 rounded-lg border-2 relative ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50'
                        : isUnlocked
                        ? 'border-gray-200 bg-white hover:border-emerald-200'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                    onClick={() => handleSkinSelect(skin.id, skin.price)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{skin.name}</span>
                      {!isUnlocked && (
                        <span className="flex items-center gap-1 text-sm text-gray-600">
                          {skin.price} <Lock className="w-4 h-4" />
                        </span>
                      )}
                      {isSelected && <Check className="w-5 h-5 text-emerald-500" />}
                    </div>
                    <div
                      className={`h-2 rounded-full ${
                        skin.id === 'default'
                          ? 'bg-emerald-500'
                          : skin.id === 'neon'
                          ? 'bg-emerald-400 shadow-lg'
                          : skin.id === 'pixel'
                          ? 'bg-emerald-600'
                          : skin.id === 'rainbow'
                          ? 'bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500'
                          : 'bg-gradient-to-r from-yellow-300 to-yellow-500'
                      }`}
                    />
                    {!isUnlocked && !canAfford && (
                      <div className="absolute inset-0 bg-gray-900 bg-opacity-50 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">Not enough points</span>
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}