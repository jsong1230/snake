import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SnakeSkin } from '../types/game';

interface SkinState {
  currentSkin: SnakeSkin;
  unlockedSkins: SnakeSkin[];
  points: number;
  setSkin: (skin: SnakeSkin) => void;
  unlockSkin: (skin: SnakeSkin) => void;
  addPoints: (amount: number) => void;
}

const SKIN_PRICES = {
  neon: 1000,
  pixel: 2000,
  rainbow: 5000,
  golden: 10000,
};

export const useSkinStore = create<SkinState>()(
  persist(
    (set) => ({
      currentSkin: 'default',
      unlockedSkins: ['default'],
      points: 0,
      setSkin: (skin) => set({ currentSkin: skin }),
      unlockSkin: (skin) =>
        set((state) => ({
          unlockedSkins: [...state.unlockedSkins, skin],
        })),
      addPoints: (amount) =>
        set((state) => ({
          points: state.points + amount,
        })),
    }),
    {
      name: 'snake-game-skins',
    }
  )
);