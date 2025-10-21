/**
 * Redux slice pour la gestion de la progression du tutoriel
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TutorialProgress, TutorialMode, TutorialSettings } from '../../screens/TutorialScreen/types';
import { LEVEL_THRESHOLDS } from '../../screens/TutorialScreen/data/constants';
import { getTotalSteps } from '../../screens/TutorialScreen/data/steps';

const initialState: {
  progress: TutorialProgress;
  settings: TutorialSettings;
  analyticsEnabled: boolean;
} = {
  progress: {
    totalXP: 0,
    level: 1,
    levelName: 'Novice',
    beginnerProgress: 0,
    intermediateProgress: 0,
    expertProgress: 0,
    completedSteps: [],
    currentStepId: null,
    totalSteps: getTotalSteps(),
    unlockedBadges: [],
    totalBadges: 36,
    totalPlayTime: 0,
    fastestCompletion: 0,
    perfectRuns: 0,
    preferredMode: 'guided',
    unlockedModes: ['guided', 'express', 'free'],
    secretsFound: [],
    startedAt: new Date(),
    lastPlayedAt: new Date(),
  },
  settings: {
    animationSpeed: 'normal',
    hapticEnabled: true,
    soundVolume: 'medium',
    subtitlesEnabled: true,
    reducedMotion: false,
    colorBlindMode: 'none',
  },
  analyticsEnabled: true,
};

const tutorialSlice = createSlice({
  name: 'tutorial',
  initialState,
  reducers: {
    // Gestion des étapes
    startStep: (state, action: PayloadAction<string>) => {
      state.progress.currentStepId = action.payload;
      state.progress.lastPlayedAt = new Date();
    },

    completeStep: (
      state,
      action: PayloadAction<{
        stepId: string;
        xpGained: number;
        perfect: boolean;
        time: number;
      }>
    ) => {
      const { stepId, xpGained, perfect, time } = action.payload;

      // Ajouter aux étapes complétées si pas déjà fait
      if (!state.progress.completedSteps.includes(stepId)) {
        state.progress.completedSteps.push(stepId);
      }

      // Ajouter l'XP
      state.progress.totalXP += xpGained;

      // Mettre à jour le niveau
      const newLevel = calculateLevel(state.progress.totalXP);
      state.progress.level = newLevel.level;
      state.progress.levelName = newLevel.name;

      // Stats
      if (perfect) {
        state.progress.perfectRuns += 1;
      }

      // Fastest completion
      if (
        state.progress.fastestCompletion === 0 ||
        time < state.progress.fastestCompletion
      ) {
        state.progress.fastestCompletion = time;
      }

      state.progress.lastPlayedAt = new Date();
    },

    updateLevelProgress: (
      state,
      action: PayloadAction<{
        level: 'beginner' | 'intermediate' | 'expert';
        progress: number;
      }>
    ) => {
      const { level, progress } = action.payload;
      if (level === 'beginner') {
        state.progress.beginnerProgress = progress;
      } else if (level === 'intermediate') {
        state.progress.intermediateProgress = progress;
      } else if (level === 'expert') {
        state.progress.expertProgress = progress;
      }
    },

    // Gestion des badges
    unlockBadge: (state, action: PayloadAction<string>) => {
      if (!state.progress.unlockedBadges.includes(action.payload)) {
        state.progress.unlockedBadges.push(action.payload);
      }
    },

    // Gestion des secrets
    foundSecret: (state, action: PayloadAction<string>) => {
      if (!state.progress.secretsFound.includes(action.payload)) {
        state.progress.secretsFound.push(action.payload);
      }
    },

    // Gestion du temps
    addPlayTime: (state, action: PayloadAction<number>) => {
      state.progress.totalPlayTime += action.payload;
    },

    // Gestion des modes
    setPreferredMode: (state, action: PayloadAction<TutorialMode>) => {
      state.progress.preferredMode = action.payload;
    },

    unlockMode: (state, action: PayloadAction<TutorialMode>) => {
      if (!state.progress.unlockedModes.includes(action.payload)) {
        state.progress.unlockedModes.push(action.payload);
      }
    },

    // Gestion des paramètres
    updateSettings: (state, action: PayloadAction<Partial<TutorialSettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },

    // Réinitialisation
    resetProgress: state => {
      state.progress = initialState.progress;
      state.progress.startedAt = new Date();
      state.progress.lastPlayedAt = new Date();
    },

    resetStep: (state, action: PayloadAction<string>) => {
      const index = state.progress.completedSteps.indexOf(action.payload);
      if (index > -1) {
        state.progress.completedSteps.splice(index, 1);
      }
    },

    // Complétion totale
    completeTutorial: state => {
      state.progress.completedAt = new Date();
    },

    // Analytics
    toggleAnalytics: (state, action: PayloadAction<boolean>) => {
      state.analyticsEnabled = action.payload;
    },
  },
});

// Fonction helper pour calculer le niveau basé sur l'XP
function calculateLevel(xp: number): { level: number; name: string } {
  let currentLevel = 1;
  let currentName = 'Novice';

  Object.entries(LEVEL_THRESHOLDS).forEach(([level, data]) => {
    const levelNum = parseInt(level);
    if (xp >= data.xp) {
      currentLevel = levelNum;
      currentName = data.name;
    }
  });

  return { level: currentLevel, name: currentName };
}

export const {
  startStep,
  completeStep,
  updateLevelProgress,
  unlockBadge,
  foundSecret,
  addPlayTime,
  setPreferredMode,
  unlockMode,
  updateSettings,
  resetProgress,
  resetStep,
  completeTutorial,
  toggleAnalytics,
} = tutorialSlice.actions;

export default tutorialSlice.reducer;
