/**
 * Redux slice pour la gestion de l'historique des parties
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Game } from '../../types';

interface HistoryState {
  games: Game[];
  isLoading: boolean;
  error: string | null;
}

const initialState: HistoryState = {
  games: [],
  isLoading: false,
  error: null,
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    // Charger toutes les parties
    setGames: (state, action: PayloadAction<Game[]>) => {
      state.games = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    // Ajouter une partie à l'historique
    addGame: (state, action: PayloadAction<Game>) => {
      // Vérifier si la partie existe déjà
      const existingIndex = state.games.findIndex((g) => g.id === action.payload.id);

      if (existingIndex !== -1) {
        // Mettre à jour la partie existante
        state.games[existingIndex] = action.payload;
      } else {
        // Ajouter une nouvelle partie
        state.games.unshift(action.payload);
      }
    },

    // Supprimer une partie de l'historique
    removeGame: (state, action: PayloadAction<string>) => {
      state.games = state.games.filter((game) => game.id !== action.payload);
    },

    // Définir le chargement
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Définir une erreur
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Effacer l'erreur
    clearError: (state) => {
      state.error = null;
    },

    // Effacer tout l'historique
    clearHistory: (state) => {
      state.games = [];
      state.error = null;
    },
  },
});

export const {
  setGames,
  addGame,
  removeGame,
  setLoading,
  setError,
  clearError,
  clearHistory,
} = historySlice.actions;

export default historySlice.reducer;
