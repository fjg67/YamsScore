/**
 * Redux slice pour la gestion des parties de Yams
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Game, Player, ScoreCategory, PlayerScore } from '../../types';
import { updatePlayerScoreTotals, isGameComplete, determineWinner } from '../../utils';

interface GameState {
  currentGame: Game | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: GameState = {
  currentGame: null,
  isLoading: false,
  error: null,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    // Créer une nouvelle partie
    createGame: (
      state,
      action: PayloadAction<{ players: Player[]; mode: 'classic' | 'descending' }>
    ) => {
      const { players, mode } = action.payload;

      // Initialiser les scores pour chaque joueur
      const scores: PlayerScore[] = players.map((player) => ({
        playerId: player.id,
        upperTotal: 0,
        upperBonus: 0,
        lowerTotal: 0,
        grandTotal: 0,
      }));

      state.currentGame = {
        id: `game_${Date.now()}`,
        players,
        scores,
        currentTurn: 0,
        status: 'in_progress',
        createdAt: new Date(),
        mode,
      };
      state.error = null;
    },

    // Charger une partie existante
    loadGame: (state, action: PayloadAction<Game>) => {
      state.currentGame = action.payload;
      state.error = null;
    },

    // Mettre à jour un score
    updateScore: (
      state,
      action: PayloadAction<{
        playerId: string;
        category: ScoreCategory;
        value: number;
      }>
    ) => {
      if (!state.currentGame) {
        state.error = 'Aucune partie en cours';
        return;
      }

      const { playerId, category, value } = action.payload;

      // Trouver le score du joueur
      const playerScoreIndex = state.currentGame.scores.findIndex(
        (s) => s.playerId === playerId
      );

      if (playerScoreIndex === -1) {
        state.error = 'Joueur non trouvé';
        return;
      }

      // Vérifier que la catégorie n'est pas déjà remplie
      const currentScore = state.currentGame.scores[playerScoreIndex];
      if (currentScore[category] !== undefined) {
        state.error = 'Cette catégorie est déjà remplie';
        return;
      }

      // Mettre à jour le score
      currentScore[category] = value;

      // Recalculer tous les totaux
      state.currentGame.scores[playerScoreIndex] = updatePlayerScoreTotals(
        currentScore,
        playerId
      );

      // Vérifier si la partie est terminée
      if (isGameComplete(state.currentGame)) {
        state.currentGame.status = 'completed';
        state.currentGame.completedAt = new Date();

        // Déterminer le gagnant
        const winner = determineWinner(state.currentGame);
        if (winner) {
          state.currentGame.winnerId = winner.id;
        }
      }

      // Passer au tour suivant
      state.currentGame.currentTurn += 1;
      state.error = null;
    },

    // Supprimer un score (annuler)
    clearScore: (
      state,
      action: PayloadAction<{
        playerId: string;
        category: ScoreCategory;
      }>
    ) => {
      if (!state.currentGame) {
        state.error = 'Aucune partie en cours';
        return;
      }

      const { playerId, category } = action.payload;

      const playerScoreIndex = state.currentGame.scores.findIndex(
        (s) => s.playerId === playerId
      );

      if (playerScoreIndex === -1) {
        state.error = 'Joueur non trouvé';
        return;
      }

      // Supprimer le score
      const currentScore = state.currentGame.scores[playerScoreIndex];
      delete currentScore[category];

      // Recalculer les totaux
      state.currentGame.scores[playerScoreIndex] = updatePlayerScoreTotals(
        currentScore,
        playerId
      );

      state.error = null;
    },

    // Terminer la partie manuellement
    completeGame: (state) => {
      if (!state.currentGame) {
        state.error = 'Aucune partie en cours';
        return;
      }

      state.currentGame.status = 'completed';
      state.currentGame.completedAt = new Date();

      // Déterminer le gagnant
      const winner = determineWinner(state.currentGame);
      if (winner) {
        state.currentGame.winnerId = winner.id;
      }

      state.error = null;
    },

    // Réinitialiser la partie en cours
    clearCurrentGame: (state) => {
      state.currentGame = null;
      state.error = null;
    },

    // Définir une erreur
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    // Effacer l'erreur
    clearError: (state) => {
      state.error = null;
    },

    // Définir le chargement
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  createGame,
  loadGame,
  updateScore,
  clearScore,
  completeGame,
  clearCurrentGame,
  setError,
  clearError,
  setLoading,
} = gameSlice.actions;

export default gameSlice.reducer;
