/**
 * Redux slice pour la gestion des paramètres de l'application
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Theme } from '../../constants';

export type ThemeMode = 'light' | 'dark' | 'auto';
export type AccentColor = 'blue' | 'green' | 'purple' | 'red' | 'orange' | 'pink' | 'cyan' | 'gold';
export type DiceStyle = 'classic' | 'modern' | '3d';
export type HapticIntensity = 'light' | 'medium' | 'heavy';
export type CelebrationLevel = 'minimal' | 'normal' | 'epic';

interface SettingsState {
  // Profil
  userName: string;
  userEmoji: string;

  // Apparence
  themeMode: ThemeMode;
  theme: Theme; // Thème réel appliqué (light/dark)
  accentColor: AccentColor;
  diceStyle: DiceStyle;
  animationsEnabled: boolean;
  reduceMotion: boolean;

  // Son et Vibration
  soundEnabled: boolean;
  soundVolume: number; // 0-100
  musicEnabled: boolean;
  musicVolume: number; // 0-100
  vibrationEnabled: boolean;
  hapticIntensity: HapticIntensity;
  voiceFeedbackEnabled: boolean;

  // Jeu
  autoSaveEnabled: boolean;
  confirmActionsEnabled: boolean;
  showHintsEnabled: boolean;
  tutorialModeEnabled: boolean;
  quickInputEnabled: boolean;
  celebrationLevel: CelebrationLevel;

  // Notifications
  notificationsEnabled: boolean;
  streakRemindersEnabled: boolean;
  streakReminderTime: string; // Format "HH:mm"
  achievementUnlocksEnabled: boolean;
  friendChallengesEnabled: boolean;
  weeklyRecapEnabled: boolean;

  // Données et Confidentialité
  analyticsEnabled: boolean;
  crashReportsEnabled: boolean;

  // Système
  language: 'fr' | 'en';
  hasSeenTutorial: boolean;
  debugModeEnabled: boolean;
  performanceStatsEnabled: boolean;
}

const initialState: SettingsState = {
  // Profil
  userName: '',
  userEmoji: '😎',

  // Apparence
  themeMode: 'auto',
  theme: 'light',
  accentColor: 'blue',
  diceStyle: 'classic',
  animationsEnabled: true,
  reduceMotion: false,

  // Son et Vibration
  soundEnabled: true,
  soundVolume: 70,
  musicEnabled: false,
  musicVolume: 30,
  vibrationEnabled: true,
  hapticIntensity: 'medium',
  voiceFeedbackEnabled: false,

  // Jeu
  autoSaveEnabled: true,
  confirmActionsEnabled: true,
  showHintsEnabled: true,
  tutorialModeEnabled: false,
  quickInputEnabled: true,
  celebrationLevel: 'normal',

  // Notifications
  notificationsEnabled: true,
  streakRemindersEnabled: true,
  streakReminderTime: '20:00',
  achievementUnlocksEnabled: true,
  friendChallengesEnabled: true,
  weeklyRecapEnabled: true,

  // Données et Confidentialité
  analyticsEnabled: true,
  crashReportsEnabled: true,

  // Système
  language: 'fr',
  hasSeenTutorial: false,
  debugModeEnabled: false,
  performanceStatsEnabled: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // Profil
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
    },
    setUserEmoji: (state, action: PayloadAction<string>) => {
      state.userEmoji = action.payload;
    },

    // Apparence
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload;
      // Si ce n'est pas auto, appliquer directement
      if (action.payload !== 'auto') {
        state.theme = action.payload;
      }
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      state.themeMode = state.theme;
    },
    setAccentColor: (state, action: PayloadAction<AccentColor>) => {
      state.accentColor = action.payload;
    },
    setDiceStyle: (state, action: PayloadAction<DiceStyle>) => {
      state.diceStyle = action.payload;
    },
    setAnimationsEnabled: (state, action: PayloadAction<boolean>) => {
      state.animationsEnabled = action.payload;
    },
    toggleAnimations: (state) => {
      state.animationsEnabled = !state.animationsEnabled;
    },
    setReduceMotion: (state, action: PayloadAction<boolean>) => {
      state.reduceMotion = action.payload;
    },
    toggleReduceMotion: (state) => {
      state.reduceMotion = !state.reduceMotion;
    },

    // Son et Vibration
    setSoundEnabled: (state, action: PayloadAction<boolean>) => {
      state.soundEnabled = action.payload;
    },
    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
    },
    setSoundVolume: (state, action: PayloadAction<number>) => {
      state.soundVolume = action.payload;
    },
    setMusicEnabled: (state, action: PayloadAction<boolean>) => {
      state.musicEnabled = action.payload;
    },
    toggleMusic: (state) => {
      state.musicEnabled = !state.musicEnabled;
    },
    setMusicVolume: (state, action: PayloadAction<number>) => {
      state.musicVolume = action.payload;
    },
    setVibrationEnabled: (state, action: PayloadAction<boolean>) => {
      state.vibrationEnabled = action.payload;
    },
    toggleVibration: (state) => {
      state.vibrationEnabled = !state.vibrationEnabled;
    },
    setHapticIntensity: (state, action: PayloadAction<HapticIntensity>) => {
      state.hapticIntensity = action.payload;
    },
    setVoiceFeedbackEnabled: (state, action: PayloadAction<boolean>) => {
      state.voiceFeedbackEnabled = action.payload;
    },
    toggleVoiceFeedback: (state) => {
      state.voiceFeedbackEnabled = !state.voiceFeedbackEnabled;
    },

    // Jeu
    setAutoSaveEnabled: (state, action: PayloadAction<boolean>) => {
      state.autoSaveEnabled = action.payload;
    },
    toggleAutoSave: (state) => {
      state.autoSaveEnabled = !state.autoSaveEnabled;
    },
    setConfirmActionsEnabled: (state, action: PayloadAction<boolean>) => {
      state.confirmActionsEnabled = action.payload;
    },
    toggleConfirmActions: (state) => {
      state.confirmActionsEnabled = !state.confirmActionsEnabled;
    },
    setShowHintsEnabled: (state, action: PayloadAction<boolean>) => {
      state.showHintsEnabled = action.payload;
    },
    toggleShowHints: (state) => {
      state.showHintsEnabled = !state.showHintsEnabled;
    },
    setTutorialModeEnabled: (state, action: PayloadAction<boolean>) => {
      state.tutorialModeEnabled = action.payload;
    },
    toggleTutorialMode: (state) => {
      state.tutorialModeEnabled = !state.tutorialModeEnabled;
    },
    setQuickInputEnabled: (state, action: PayloadAction<boolean>) => {
      state.quickInputEnabled = action.payload;
    },
    toggleQuickInput: (state) => {
      state.quickInputEnabled = !state.quickInputEnabled;
    },
    setCelebrationLevel: (state, action: PayloadAction<CelebrationLevel>) => {
      state.celebrationLevel = action.payload;
    },

    // Notifications
    setNotificationsEnabled: (state, action: PayloadAction<boolean>) => {
      state.notificationsEnabled = action.payload;
    },
    toggleNotifications: (state) => {
      state.notificationsEnabled = !state.notificationsEnabled;
    },
    setStreakRemindersEnabled: (state, action: PayloadAction<boolean>) => {
      state.streakRemindersEnabled = action.payload;
    },
    toggleStreakReminders: (state) => {
      state.streakRemindersEnabled = !state.streakRemindersEnabled;
    },
    setStreakReminderTime: (state, action: PayloadAction<string>) => {
      state.streakReminderTime = action.payload;
    },
    setAchievementUnlocksEnabled: (state, action: PayloadAction<boolean>) => {
      state.achievementUnlocksEnabled = action.payload;
    },
    toggleAchievementUnlocks: (state) => {
      state.achievementUnlocksEnabled = !state.achievementUnlocksEnabled;
    },
    setFriendChallengesEnabled: (state, action: PayloadAction<boolean>) => {
      state.friendChallengesEnabled = action.payload;
    },
    toggleFriendChallenges: (state) => {
      state.friendChallengesEnabled = !state.friendChallengesEnabled;
    },
    setWeeklyRecapEnabled: (state, action: PayloadAction<boolean>) => {
      state.weeklyRecapEnabled = action.payload;
    },
    toggleWeeklyRecap: (state) => {
      state.weeklyRecapEnabled = !state.weeklyRecapEnabled;
    },

    // Données et Confidentialité
    setAnalyticsEnabled: (state, action: PayloadAction<boolean>) => {
      state.analyticsEnabled = action.payload;
    },
    toggleAnalytics: (state) => {
      state.analyticsEnabled = !state.analyticsEnabled;
    },
    setCrashReportsEnabled: (state, action: PayloadAction<boolean>) => {
      state.crashReportsEnabled = action.payload;
    },
    toggleCrashReports: (state) => {
      state.crashReportsEnabled = !state.crashReportsEnabled;
    },

    // Système
    setLanguage: (state, action: PayloadAction<'fr' | 'en'>) => {
      state.language = action.payload;
    },
    setHasSeenTutorial: (state, action: PayloadAction<boolean>) => {
      state.hasSeenTutorial = action.payload;
    },
    setDebugModeEnabled: (state, action: PayloadAction<boolean>) => {
      state.debugModeEnabled = action.payload;
    },
    toggleDebugMode: (state) => {
      state.debugModeEnabled = !state.debugModeEnabled;
    },
    setPerformanceStatsEnabled: (state, action: PayloadAction<boolean>) => {
      state.performanceStatsEnabled = action.payload;
    },
    togglePerformanceStats: (state) => {
      state.performanceStatsEnabled = !state.performanceStatsEnabled;
    },

    // Utilitaires
    resetSettings: () => {
      return initialState;
    },
    loadSettings: (state, action: PayloadAction<Partial<SettingsState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  // Profil
  setUserName,
  setUserEmoji,

  // Apparence
  setThemeMode,
  setTheme,
  toggleTheme,
  setAccentColor,
  setDiceStyle,
  setAnimationsEnabled,
  toggleAnimations,
  setReduceMotion,
  toggleReduceMotion,

  // Son et Vibration
  setSoundEnabled,
  toggleSound,
  setSoundVolume,
  setMusicEnabled,
  toggleMusic,
  setMusicVolume,
  setVibrationEnabled,
  toggleVibration,
  setHapticIntensity,
  setVoiceFeedbackEnabled,
  toggleVoiceFeedback,

  // Jeu
  setAutoSaveEnabled,
  toggleAutoSave,
  setConfirmActionsEnabled,
  toggleConfirmActions,
  setShowHintsEnabled,
  toggleShowHints,
  setTutorialModeEnabled,
  toggleTutorialMode,
  setQuickInputEnabled,
  toggleQuickInput,
  setCelebrationLevel,

  // Notifications
  setNotificationsEnabled,
  toggleNotifications,
  setStreakRemindersEnabled,
  toggleStreakReminders,
  setStreakReminderTime,
  setAchievementUnlocksEnabled,
  toggleAchievementUnlocks,
  setFriendChallengesEnabled,
  toggleFriendChallenges,
  setWeeklyRecapEnabled,
  toggleWeeklyRecap,

  // Données et Confidentialité
  setAnalyticsEnabled,
  toggleAnalytics,
  setCrashReportsEnabled,
  toggleCrashReports,

  // Système
  setLanguage,
  setHasSeenTutorial,
  setDebugModeEnabled,
  toggleDebugMode,
  setPerformanceStatsEnabled,
  togglePerformanceStats,

  // Utilitaires
  resetSettings,
  loadSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
