/**
 * Configuration des étapes du tutoriel interactif
 */

import { TutorialStepConfig } from '../types/tutorial.types';

export const TUTORIAL_STEPS: Record<string, TutorialStepConfig> = {
  welcome: {
    id: 'welcome',
    title: 'Bienvenue dans YamsScore Premium ! 🎲',
    message: 'Découvrez une expérience de jeu révolutionnaire avec des animations époustouflantes, des célébrations dynamiques et un système de score intelligent.\n\nCommençons le tutoriel interactif !',
    position: 'center',
    actionButton: 'Commencer',
    skipButton: true,
    illustration: '🎮',
  },

  player_badges: {
    id: 'player_badges',
    title: 'Badges Joueurs 3D 👥',
    message: 'Les badges des joueurs affichent en temps réel :\n• Avatar emoji personnalisé\n• Score actuel\n• Position dans le classement\n• Couronne pour le leader 👑',
    highlightComponent: 'player_badges',
    position: 'top',
    actionButton: 'Suivant',
    skipButton: true,
    illustration: '👥',
  },

  leaderboard: {
    id: 'leaderboard',
    title: 'Classement en Direct 🏆',
    message: 'Le mini-podium affiche les 3 premiers joueurs avec des médailles :\n🥇 Or pour le 1er\n🥈 Argent pour le 2ème\n🥉 Bronze pour le 3ème\n\nMis à jour après chaque score !',
    highlightComponent: 'leaderboard',
    position: 'top',
    actionButton: 'Suivant',
    skipButton: true,
    illustration: '🏆',
  },

  score_grid: {
    id: 'score_grid',
    title: 'Grille de Score Premium 📊',
    message: 'Chaque cellule change de couleur selon la qualité du score :\n🟢 Excellent (90%+ du max)\n🔵 Bon (70-90%)\n🟡 Moyen (50-70%)\n🔴 Faible (< 50%)\n\nTapez sur une cellule pour saisir un score !',
    highlightComponent: 'score_grid',
    position: 'center',
    actionButton: 'Suivant',
    skipButton: true,
    illustration: '📊',
  },

  category_selection: {
    id: 'category_selection',
    title: 'Sélection Intelligente 🎯',
    message: 'Tapez sur une catégorie pour ouvrir le NumPad intelligent.\n\nChaque catégorie a des valeurs rapides pré-configurées pour réduire les taps de 70% !',
    highlightComponent: 'score_cell',
    position: 'center',
    actionButton: 'Suivant',
    skipButton: true,
    illustration: '🎯',
  },

  numpad_input: {
    id: 'numpad_input',
    title: 'NumPad Révolutionnaire ⚡',
    message: 'Le NumPad s\'adapte à chaque catégorie :\n• Valeurs fréquentes en 1 tap\n• Validation en temps réel\n• Aide contextuelle\n• Exemples de combinaisons\n\nPlus besoin de calculer !',
    highlightComponent: 'numpad',
    position: 'bottom',
    actionButton: 'Suivant',
    skipButton: true,
    illustration: '⚡',
  },

  bonus_explanation: {
    id: 'bonus_explanation',
    title: 'Bonus +35 Points ⭐',
    message: 'Atteignez 63 points ou plus dans la section supérieure (1 à 6) pour débloquer le bonus de 35 points !\n\nUne barre de progression vous guide en temps réel.',
    highlightComponent: 'bonus_row',
    position: 'center',
    actionButton: 'Suivant',
    skipButton: true,
    illustration: '⭐',
  },

  strategies: {
    id: 'strategies',
    title: 'Conseils Stratégiques 💡',
    message: 'Astuce pro :\n• Visez 3+ de chaque chiffre pour le bonus\n• Gardez le Yams pour la fin\n• N\'hésitez pas à barrer (0) si mauvais lancé\n• Le Brelan/Carré peut sauver un mauvais coup',
    position: 'center',
    actionButton: 'Suivant',
    skipButton: true,
    illustration: '💡',
  },

  celebrations: {
    id: 'celebrations',
    title: 'Célébrations Épiques 🎉',
    message: 'Préparez-vous à des célébrations spectaculaires :\n👑 Yams (50 pts) → Confettis dorés\n🚀 Grande Suite → Animation fusée\n🏠 Full House → Construction\n🔥 Comeback → Explosion de feu\n\nChaque exploit est récompensé !',
    position: 'center',
    actionButton: 'Suivant',
    skipButton: true,
    illustration: '🎉',
  },

  complete: {
    id: 'complete',
    title: 'Prêt à Jouer ! 🚀',
    message: 'Vous maîtrisez maintenant YamsScore Premium !\n\nProfitez de l\'expérience de jeu la plus aboutie du Yams.\n\nBon jeu et que le meilleur gagne ! 🎲',
    position: 'center',
    actionButton: 'Commencer à Jouer',
    skipButton: false,
    illustration: '🚀',
  },
};

export const TUTORIAL_ORDER: string[] = [
  'welcome',
  'player_badges',
  'leaderboard',
  'score_grid',
  'category_selection',
  'numpad_input',
  'bonus_explanation',
  'strategies',
  'celebrations',
  'complete',
];
