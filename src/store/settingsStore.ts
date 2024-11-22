import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  soundEnabled: boolean;
  particlesEnabled: boolean;
  difficulty: 'easy' | 'normal' | 'hard';
  toggleSound: () => void;
  toggleParticles: () => void;
  setDifficulty: (difficulty: SettingsState['difficulty']) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      soundEnabled: true,
      particlesEnabled: true,
      difficulty: 'normal',
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      toggleParticles: () => set((state) => ({ particlesEnabled: !state.particlesEnabled })),
      setDifficulty: (difficulty) => set({ difficulty }),
    }),
    {
      name: 'snake-game-settings',
    }
  )
);