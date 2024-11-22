import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Sparkles, Settings as SettingsIcon, X } from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';

type SettingsProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Settings({ isOpen, onClose }: SettingsProps) {
  const { soundEnabled, particlesEnabled, difficulty, toggleSound, toggleParticles, setDifficulty } =
    useSettingsStore();

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
                <SettingsIcon className="w-6 h-6 text-gray-700" />
                <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Sound</span>
                <button
                  onClick={toggleSound}
                  className={`p-2 rounded-lg transition-colors ${
                    soundEnabled ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-700">Particle Effects</span>
                <button
                  onClick={toggleParticles}
                  className={`p-2 rounded-lg transition-colors ${
                    particlesEnabled ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <Sparkles className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-2">
                <span className="text-gray-700">Difficulty</span>
                <div className="grid grid-cols-3 gap-2">
                  {(['easy', 'normal', 'hard'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`py-2 px-4 rounded-lg capitalize transition-colors ${
                        difficulty === level
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}