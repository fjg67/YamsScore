/**
 * Palette de couleurs étendue pour les joueurs - Ultra Premium
 * 12 couleurs vibrantes avec gradients
 */

export interface PlayerColorConfig {
  name: string;
  hex: string;
  gradient: [string, string];
}

/**
 * 12 couleurs premium avec gradients harmonieux
 * Ordre optimisé pour contraste maximal entre joueurs consécutifs
 */
export const PLAYER_COLORS: PlayerColorConfig[] = [
  {
    name: 'Ocean',
    hex: '#4A90E2',
    gradient: ['#4A90E2', '#5DADE2'],
  },
  {
    name: 'Forest',
    hex: '#50C878',
    gradient: ['#50C878', '#58D68D'],
  },
  {
    name: 'Sunset',
    hex: '#FF6B6B',
    gradient: ['#FF6B6B', '#FF8E53'],
  },
  {
    name: 'Purple',
    hex: '#9B59B6',
    gradient: ['#9B59B6', '#BB8FCE'],
  },
  {
    name: 'Gold',
    hex: '#F39C12',
    gradient: ['#F39C12', '#F8C471'],
  },
  {
    name: 'Pink',
    hex: '#E91E63',
    gradient: ['#E91E63', '#F48FB1'],
  },
  {
    name: 'Teal',
    hex: '#1ABC9C',
    gradient: ['#1ABC9C', '#48C9B0'],
  },
  {
    name: 'Orange',
    hex: '#FF5722',
    gradient: ['#FF5722', '#FF7043'],
  },
  {
    name: 'Indigo',
    hex: '#3F51B5',
    gradient: ['#3F51B5', '#5C6BC0'],
  },
  {
    name: 'Lime',
    hex: '#8BC34A',
    gradient: ['#8BC34A', '#AED581'],
  },
  {
    name: 'Crimson',
    hex: '#DC143C',
    gradient: ['#DC143C', '#E57373'],
  },
  {
    name: 'Sky',
    hex: '#00BCD4',
    gradient: ['#00BCD4', '#4DD0E1'],
  },
];

/**
 * Séquence d'attribution optimisée pour contraste maximal
 * Les couleurs sont espacées pour éviter les couleurs similaires côte à côte
 */
export const COLOR_ASSIGNMENT_SEQUENCE = [0, 2, 1, 3, 4, 5];

/**
 * Obtenir la couleur pour un joueur donné
 * @param playerIndex Index du joueur (0-5)
 * @returns Configuration de couleur
 */
export const getPlayerColor = (playerIndex: number): PlayerColorConfig => {
  const sequenceIndex = COLOR_ASSIGNMENT_SEQUENCE[playerIndex % 6];
  return PLAYER_COLORS[sequenceIndex];
};

/**
 * Obtenir toutes les couleurs disponibles pour le picker
 */
export const getAllColors = (): PlayerColorConfig[] => {
  return PLAYER_COLORS;
};

/**
 * Trouver une couleur par son hex
 */
export const findColorByHex = (hex: string): PlayerColorConfig | undefined => {
  return PLAYER_COLORS.find((color) => color.hex === hex);
};
