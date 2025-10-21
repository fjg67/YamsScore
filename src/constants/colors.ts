/**
 * Palette de couleurs pour l'application Yams Score
 */

export const LightColors = {
  primary: '#4A90E2', // Bleu moderne
  secondary: '#50C878', // Vert émeraude
  accent: '#FF6B6B', // Rouge corail
  background: '#F8F9FA', // Gris très clair
  surface: '#FFFFFF', // Blanc pur
  text: '#2C3E50', // Gris foncé
  textSecondary: '#7F8C8D', // Gris moyen
  border: '#E1E8ED', // Gris clair
  error: '#E74C3C', // Rouge erreur
  success: '#2ECC71', // Vert succès
  warning: '#F39C12', // Orange warning
  disabled: '#BDC3C7', // Gris désactivé
};

export const DarkColors = {
  primary: '#5DADE2', // Bleu plus clair
  secondary: '#58D68D', // Vert plus clair
  accent: '#FF7979', // Rouge corail plus clair
  background: '#1E1E1E', // Gris très foncé
  surface: '#2C2C2C', // Gris foncé
  text: '#ECEFF1', // Blanc cassé
  textSecondary: '#B0BEC5', // Gris clair
  border: '#3A3A3A', // Gris moyen
  error: '#EF5350', // Rouge erreur clair
  success: '#66BB6A', // Vert succès clair
  warning: '#FFA726', // Orange warning clair
  disabled: '#757575', // Gris désactivé
};

/**
 * Couleurs des joueurs (jusqu'à 6 joueurs)
 */
export const PlayerColors = [
  '#FF6B6B', // Rouge corail
  '#4ECDC4', // Turquoise
  '#45B7D1', // Bleu ciel
  '#FFA07A', // Saumon
  '#98D8C8', // Menthe
  '#F7DC6F', // Jaune doux
];

/**
 * Couleurs pour les scores spéciaux
 */
export const ScoreColors = {
  bonus: '#FFD700', // Or pour le bonus
  yams: '#9B59B6', // Violet pour Yams
  fullHouse: '#3498DB', // Bleu pour Full
  straight: '#16A085', // Vert turquoise pour suites
  winner: '#FFD700', // Or pour le gagnant
};

export type Theme = 'light' | 'dark';

export const getColors = (theme: Theme) => {
  return theme === 'light' ? LightColors : DarkColors;
};
