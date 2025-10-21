/**
 * Emojis pour avatars joueurs et catégories
 */

export const PLAYER_AVATARS = [
  '😎', '🐶', '🍕', '🎮', '🚀', '🎨', '🎭', '🎪',
  '🎯', '🎲', '🃏', '🎰', '🏆', '⚡', '🌟', '💎',
  '🦁', '🐯', '🦊', '🐼', '🐨', '🐸', '🦄', '🐲',
  '🍀', '🌈', '⭐', '💫', '🔥', '❄️', '🌊', '🌙',
];

export const CATEGORY_EMOJIS: Record<string, string> = {
  ones: '🎲',
  twos: '🎲',
  threes: '🎲',
  fours: '🎲',
  fives: '🎲',
  sixes: '🎲',
  threeOfAKind: '🎯',
  fourOfAKind: '💎',
  fullHouse: '🏠',
  smallStraight: '📊',
  largeStraight: '🚀',
  yams: '👑',
  chance: '🍀',
};

export const PODIUM_EMOJIS = {
  first: '🥇',
  second: '🥈',
  third: '🥉',
};

export const CELEBRATION_EMOJIS = {
  trophy: '🏆',
  crown: '👑',
  star: '⭐',
  fire: '🔥',
  rocket: '🚀',
  sparkles: '✨',
  confetti: '🎉',
  party: '🎊',
};

export const getRandomPlayerAvatar = (): string => {
  return PLAYER_AVATARS[Math.floor(Math.random() * PLAYER_AVATARS.length)];
};

export const getCategoryEmoji = (category: string): string => {
  return CATEGORY_EMOJIS[category] || '🎲';
};
