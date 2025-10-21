/**
 * Configuration de la navigation principale
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

// Import des écrans
import { WelcomeScreenPremiumPhase3 } from '../screens/WelcomeScreenPremiumPhase3';
import PlayerSetupScreen from '../screens/PlayerSetupScreen';
import GameScreen from '../screens/GameScreen';
import GameScreenPremium from '../screens/GameScreenPremium';
import HistoryScreenPremium from '../screens/HistoryScreenPremium';
import StatsScreen from '../screens/StatsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import RulesScreenPremium from '../screens/RulesScreen';
import AchievementsScreen from '../screens/AchievementsScreen';
import { HelpScreen } from '../screens/HelpScreen/HelpScreen';
import AboutScreen from '../screens/AboutScreen/AboutScreen';
import { PrivacyPolicyScreen } from '../screens/PrivacyScreen';
import { TermsOfServiceScreen } from '../screens/TermsScreen';
import { TutorialAcademyScreen } from '../screens/TutorialScreen/TutorialAcademyScreen';
import { TutorialStepScreen } from '../screens/TutorialScreen/TutorialStepScreen';
import { FeatureRequestScreen } from '../screens/FeatureRequestScreen/FeatureRequestScreen';
import { RoadmapScreen } from '../screens/FeatureRequestScreen/RoadmapScreen';
import { ProfileScreen } from '../screens/FeatureRequestScreen/ProfileScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="Home"
          component={WelcomeScreenPremiumPhase3}
          options={{ title: 'Yams Score' }}
        />
        <Stack.Screen
          name="NewGame"
          component={PlayerSetupScreen}
          options={{ title: 'Nouvelle Partie' }}
        />
        <Stack.Screen
          name="PlayerSetup"
          component={PlayerSetupScreen}
          options={{ title: 'Joueurs' }}
        />
        <Stack.Screen
          name="Game"
          component={GameScreenPremium}
          options={{ title: 'Partie' }}
        />
        <Stack.Screen
          name="History"
          component={HistoryScreenPremium}
          options={{ title: 'Historique' }}
        />
        <Stack.Screen
          name="Stats"
          component={StatsScreen}
          options={{ title: 'Statistiques' }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Paramètres' }}
        />
        <Stack.Screen
          name="Rules"
          component={RulesScreenPremium}
          options={{ title: 'Règles du jeu' }}
        />
        <Stack.Screen
          name="Achievements"
          component={AchievementsScreen}
          options={{ title: 'Achievements' }}
        />
        <Stack.Screen
          name="Help"
          component={HelpScreen}
          options={{ title: 'Centre d\'aide' }}
        />
        <Stack.Screen
          name="About"
          component={AboutScreen}
          options={{ title: 'À propos' }}
        />
        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicyScreen}
          options={{ title: 'Politique de confidentialité' }}
        />
        <Stack.Screen
          name="TermsOfService"
          component={TermsOfServiceScreen}
          options={{ title: 'Conditions d\'utilisation' }}
        />
        <Stack.Screen
          name="Tutorial"
          component={TutorialAcademyScreen}
          options={{
            title: 'Académie Yams Score',
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="TutorialStep"
          component={TutorialStepScreen}
          options={{
            title: 'Étape du tutoriel',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="FeatureRequest"
          component={FeatureRequestScreen}
          options={{
            title: 'Innovation Lab',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="Roadmap"
          component={RoadmapScreen}
          options={{
            title: 'Roadmap',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: 'Profil Contributeur',
            animation: 'slide_from_right',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
