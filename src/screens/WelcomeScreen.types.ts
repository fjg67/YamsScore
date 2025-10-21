/**
 * Types pour WelcomeScreen
 */

import { NavigationProp, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';

export interface WelcomeScreenProps {
  navigation: NavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'Home'>;
}

export interface WelcomeScreenState {
  isLoading: boolean;
  hasOngoingGame: boolean;
  gamesCount: number;
  isFirstLaunch: boolean;
}

export interface OngoingGameInfo {
  id: string;
  players: string[];
  createdAt: Date;
  currentTurn: number;
}

export interface ThemeColors {
  background: string;
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  buttons: {
    primary: {
      background: string;
      text: string;
    };
    secondary: {
      background: string;
      border: string;
      text: string;
    };
    tertiary: {
      background: string;
      text: string;
    };
  };
  illustrations: {
    dice: string[];
    accents: string[];
  };
}
