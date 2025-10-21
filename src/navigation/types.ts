/**
 * Types pour la navigation
 */

import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  WelcomeScreenPremiumPhase3: undefined;
  NewGame: undefined;
  PlayerSetup: undefined;
  Game: { gameId: string };
  History: undefined;
  Stats: undefined;
  Settings: undefined;
  Rules: undefined;
  Achievements: undefined;
  Help: undefined;
  About: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
  Tutorial: undefined;
  TutorialStep: { stepId: string };
  FeatureRequest: undefined;
  Roadmap: undefined;
  Profile: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
