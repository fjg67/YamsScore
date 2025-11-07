import { PlayerColor } from '../../types';

export const PLAYER_COLORS: PlayerColor[] = [
  { id: 'blue', hex: '#4A90E2', name: 'Bleu Océan', emoji: '🔵' },
  { id: 'green', hex: '#50C878', name: 'Vert Émeraude', emoji: '🟢' },
  { id: 'red', hex: '#FF6B6B', name: 'Rouge Corail', emoji: '🔴' },
  { id: 'yellow', hex: '#FFD93D', name: 'Jaune Soleil', emoji: '🟡' },
  { id: 'orange', hex: '#FF9A3D', name: 'Orange Mandarine', emoji: '🟠' },
  { id: 'purple', hex: '#9B59B6', name: 'Violet Améthyste', emoji: '🟣' },
  { id: 'pink', hex: '#FF79C6', name: 'Rose Bonbon', emoji: '💗' },
  { id: 'teal', hex: '#26C6DA', name: 'Turquoise', emoji: '🩵' },
  { id: 'indigo', hex: '#5C6BC0', name: 'Indigo', emoji: '💜' },
  { id: 'lime', hex: '#9CCC65', name: 'Lime', emoji: '💚' },
  { id: 'amber', hex: '#FFCA28', name: 'Ambre', emoji: '🧡' },
  { id: 'cyan', hex: '#00BCD4', name: 'Cyan', emoji: '🩵' },
];

export const NAME_SUGGESTIONS = [
  // FR
  'Alice', 'Bob', 'Charlie', 'Diana', 'Emma', 'Felix',
  // Courts
  'Max', 'Léa', 'Tom', 'Zoé', 'Lou', 'Sam',
  // Fun
  'Rookie', 'Pro', 'Boss', 'Legend', 'Champ', 'Ace'
];

export const MIN_PLAYERS = 1; // 1 = Solo vs IA, 2+ = Multijoueur
export const MAX_PLAYERS = 6;

export const PLAYER_CARD_HEIGHT = 80;
export const PLAYER_CARD_MARGIN = 16;
