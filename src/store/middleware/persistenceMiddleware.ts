/**
 * Middleware Redux pour la sauvegarde automatique des parties
 */

import { Middleware } from '@reduxjs/toolkit';
import { saveGame, saveCurrentGame, clearCurrentGame } from '../../utils/storage';

/**
 * Middleware qui intercepte les actions Redux et sauvegarde automatiquement
 */
export const persistenceMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);

  // Actions qui déclenchent une sauvegarde
  const saveActions = [
    'game/createGame',
    'game/updateScore',
    'game/clearScore',
    'game/completeGame',
  ];

  if (saveActions.some((type) => (action as any).type === type)) {
    const state = store.getState() as any;
    const currentGame = state.game?.currentGame;
    const autoSaveEnabled = state.settings?.autoSaveEnabled ?? true; // Par défaut activé

    if (currentGame && autoSaveEnabled) {
      // Sauvegarder la partie
      saveGame(currentGame).catch((error) => {
        console.error('Erreur sauvegarde partie:', error);
      });

      // Sauvegarder l'ID de la partie en cours (sauf si terminée)
      if (currentGame.status === 'in_progress') {
        saveCurrentGame(currentGame.id).catch((error) => {
          console.error('Erreur sauvegarde partie en cours:', error);
        });
      } else {
        // Effacer la partie en cours si terminée
        clearCurrentGame().catch((error) => {
          console.error('Erreur effacement partie en cours:', error);
        });
      }
    }
  }

  return result;
};
