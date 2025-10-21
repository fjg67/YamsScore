/**
 * Hook pour gérer le thème de l'application
 */

import { useAppSelector } from '../store/hooks';
import { ThemeColors } from '../screens/WelcomeScreen.types';

export const useTheme = (): { theme: ThemeColors; isDarkMode: boolean } => {
  const themeMode = useAppSelector((state) => state.settings.theme);
  const isDarkMode = themeMode === 'dark';

  const lightTheme: ThemeColors = {
    background: '#F8F9FA',
    text: {
      primary: '#2C3E50',
      secondary: '#7F8C8D',
      tertiary: '#BDC3C7',
    },
    buttons: {
      primary: {
        background: '#4A90E2',
        text: '#FFFFFF',
      },
      secondary: {
        background: 'transparent',
        border: '#4A90E2',
        text: '#4A90E2',
      },
      tertiary: {
        background: '#FFFFFF',
        text: '#2C3E50',
      },
    },
    illustrations: {
      dice: ['#4A90E2', '#5DADE2', '#AED6F1'],
      accents: ['#50C878', '#FF6B6B'],
    },
  };

  const darkTheme: ThemeColors = {
    background: '#1E1E1E',
    text: {
      primary: '#ECEFF1',
      secondary: '#A0A0A0',
      tertiary: '#707070',
    },
    buttons: {
      primary: {
        background: '#5DADE2',
        text: '#FFFFFF',
      },
      secondary: {
        background: 'transparent',
        border: '#5DADE2',
        text: '#5DADE2',
      },
      tertiary: {
        background: '#2A2A2A',
        text: '#ECEFF1',
      },
    },
    illustrations: {
      dice: ['#5DADE2', '#7BC1E8', '#B3D9F2'],
      accents: ['#58D68D', '#FF7979'],
    },
  };

  return {
    theme: isDarkMode ? darkTheme : lightTheme,
    isDarkMode,
  };
};
