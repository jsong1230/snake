import { Howl } from 'howler';
import { useCallback, useMemo } from 'react';
import { useSettingsStore } from '../store/settingsStore';

const SOUNDS = {
  eat: 'https://assets.codepen.io/21542/pop-down.mp3',
  gameOver: 'https://assets.codepen.io/21542/game-over.mp3',
  powerUp: 'https://assets.codepen.io/21542/power-up.mp3',
  achievement: 'https://assets.codepen.io/21542/achievement.mp3',
} as const;

type SoundType = keyof typeof SOUNDS;

export function useSound() {
  const { soundEnabled } = useSettingsStore();

  const sounds = useMemo(
    () =>
      Object.entries(SOUNDS).reduce((acc, [key, src]) => {
        acc[key as SoundType] = new Howl({ src: [src], volume: 0.5 });
        return acc;
      }, {} as Record<SoundType, Howl>),
    []
  );

  const play = useCallback(
    (type: SoundType) => {
      if (soundEnabled) {
        sounds[type].play();
      }
    },
    [sounds, soundEnabled]
  );

  return { play };
}