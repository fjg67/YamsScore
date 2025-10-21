/**
 * Système d'avatars emoji pour personnalisation des joueurs
 * 40+ emojis organisés par catégories
 */

export interface EmojiCategory {
  name: string;
  emojis: string[];
}

/**
 * Collection complète d'emojis pour avatars
 */
export const EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    name: 'Classiques',
    emojis: ['😀', '😎', '🤓', '😇', '🤩', '😈', '🥳', '🤡'],
  },
  {
    name: 'Animaux',
    emojis: ['🐶', '🐱', '🦊', '🦁', '🐻', '🐼', '🐨', '🐯'],
  },
  {
    name: 'Fantasy',
    emojis: ['👑', '🧙', '🧛', '🦸', '🦹', '🧚', '🧜', '🧞'],
  },
  {
    name: 'Food',
    emojis: ['🍕', '🍔', '🌮', '🍣', '🍩', '🍪', '🎂', '🍉'],
  },
  {
    name: 'Sports',
    emojis: ['⚽', '🏀', '🎾', '⚾', '🏈', '🎱', '🎯', '🎳'],
  },
];

/**
 * Emojis par défaut pour les nouveaux joueurs
 */
export const DEFAULT_EMOJIS = ['😀', '😎', '🤓', '😇', '🤩', '😈'];

/**
 * Obtenir un emoji par défaut pour un joueur
 * @param playerIndex Index du joueur (0-5)
 */
export const getDefaultEmoji = (playerIndex: number): string => {
  return DEFAULT_EMOJIS[playerIndex % DEFAULT_EMOJIS.length];
};

/**
 * Obtenir tous les emojis disponibles (version flat)
 */
export const getAllEmojis = (): string[] => {
  return EMOJI_CATEGORIES.flatMap((category) => category.emojis);
};

/**
 * Vérifier si un emoji est valide
 */
export const isValidEmoji = (emoji: string): boolean => {
  return getAllEmojis().includes(emoji);
};
