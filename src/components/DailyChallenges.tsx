import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, X, Gift } from 'lucide-react';
import { useChallengeStore } from '../store/challengeStore';

type DailyChallengesProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function DailyChallenges({ isOpen, onClose }: DailyChallengesProps) {
  const { dailyChallenges } = useChallengeStore();

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
                <Target className="w-6 h-6 text-emerald-500" />
                <h2 className="text-2xl font-bold text-gray-900">Daily Challenges</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {dailyChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className={`p-4 rounded-lg border-2 ${
                    challenge.completed
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
                    <div className="flex items-center gap-1 text-emerald-600">
                      <Gift className="w-4 h-4" />
                      <span className="text-sm">
                        {challenge.reward.type === 'points'
                          ? `${challenge.reward.value} points`
                          : `${challenge.reward.value} skin`}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                  <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(challenge.progress / challenge.requirement) * 100}%`,
                      }}
                      className="absolute h-full bg-emerald-500"
                    />
                  </div>
                  <div className="mt-2 text-right text-sm text-gray-600">
                    {challenge.progress} / {challenge.requirement}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}