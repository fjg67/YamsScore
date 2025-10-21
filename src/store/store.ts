/**
 * Configuration du store Redux
 */

import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './slices/gameSlice';
import settingsReducer from './slices/settingsSlice';
import historyReducer from './slices/historySlice';
import tutorialReducer from './slices/tutorialSlice';
import { persistenceMiddleware } from './middleware/persistenceMiddleware';

export const store = configureStore({
  reducer: {
    game: gameReducer,
    settings: settingsReducer,
    history: historyReducer,
    tutorial: tutorialReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignorer les erreurs de sérialisation pour les dates
        ignoredActions: [
          'game/createGame',
          'game/loadGame',
          'game/completeGame',
          'tutorial/startStep',
          'tutorial/completeStep',
          'tutorial/resetProgress',
          'tutorial/completeTutorial',
        ],
        ignoredPaths: [
          'game.currentGame.createdAt',
          'game.currentGame.completedAt',
          'tutorial.progress.startedAt',
          'tutorial.progress.lastPlayedAt',
          'tutorial.progress.completedAt',
        ],
      },
    }).concat(persistenceMiddleware),
});

// Types pour TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
