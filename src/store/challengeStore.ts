import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addDays, startOfDay, isSameDay } from 'date-fns';
import { DailyChallenge } from '../types/game';

interface ChallengeState {
  dailyChallenges: DailyChallenge[];
  lastUpdate: string;
  updateProgress: (challengeId: string, progress: number) => void;
  refreshDailyChallenges: () => void;
}

const generateDailyChallenges = (): DailyChallenge[] => [
  {
    id: 'score-challenge',
    title: 'High Scorer',
    description: 'Score 1000 points in a single game',
    requirement: 1000,
    progress: 0,
    completed: false,
    reward: { type: 'points', value: 500 },
  },
  {
    id: 'combo-challenge',
    title: 'Combo Master',
    description: 'Achieve a 10x combo',
    requirement: 10,
    progress: 0,
    completed: false,
    reward: { type: 'points', value: 300 },
  },
  {
    id: 'ghost-challenge',
    title: 'Ghost Runner',
    description: 'Collect 5 ghost power-ups',
    requirement: 5,
    progress: 0,
    completed: false,
    reward: { type: 'skin', value: 'neon' },
  },
];

export const useChallengeStore = create<ChallengeState>()(
  persist(
    (set, get) => ({
      dailyChallenges: generateDailyChallenges(),
      lastUpdate: new Date().toISOString(),
      updateProgress: (challengeId, progress) =>
        set((state) => ({
          dailyChallenges: state.dailyChallenges.map((challenge) =>
            challenge.id === challengeId
              ? {
                  ...challenge,
                  progress: Math.min(challenge.requirement, challenge.progress + progress),
                  completed: challenge.progress + progress >= challenge.requirement,
                }
              : challenge
          ),
        })),
      refreshDailyChallenges: () => {
        const lastUpdate = new Date(get().lastUpdate);
        const today = startOfDay(new Date());
        
        if (!isSameDay(lastUpdate, today)) {
          set({
            dailyChallenges: generateDailyChallenges(),
            lastUpdate: today.toISOString(),
          });
        }
      },
    }),
    {
      name: 'snake-game-challenges',
    }
  )
);