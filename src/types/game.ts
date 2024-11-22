export type Position = {
  x: number;
  y: number;
};

export type FoodType = 'apple' | 'cherry' | 'grape' | 'banana' | 'star' | 'rainbow';

export type SnakeSkin = 'default' | 'neon' | 'pixel' | 'rainbow' | 'golden';

export type DailyChallenge = {
  id: string;
  title: string;
  description: string;
  requirement: number;
  progress: number;
  completed: boolean;
  reward: {
    type: 'skin' | 'points';
    value: string | number;
  };
};

export type GameMode = 'classic' | 'timeAttack' | 'zen' | 'challenge';