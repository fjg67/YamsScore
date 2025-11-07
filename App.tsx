/**
 * Yams Score - React Native App
 * @format
 */

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import WelcomeScreen from './src/screens/WelcomeScreen';
import PlayerSetupScreen from './src/screens/PlayerSetup';
import GameScreen from './src/screens/GameScreen';
import HistoryScreenPremium from './screens/HistoryScreen/HistoryScreenPremium';
import { Player } from './src/types/game';

// Système d'apprentissage
import { LearningCenterScreen } from './screens/LearningCenterScreen';
import { TutorialLevelsScreen } from './screens/TutorialLevelsScreen';
import { TutorialScreen } from './screens/TutorialScreen';
import { PracticeModeScreen } from './screens/PracticeModeScreen';
import { PracticeExerciseScreen } from './screens/PracticeExerciseScreen';
import { StrategyLibraryScreen } from './screens/StrategyLibraryScreen';
import { TutorialLevel, PracticeCategoryType } from './src/types/learning';

// Système de progression
import { ProgressionScreen } from './src/screens/Progression/ProgressionScreen';
import { QuestsScreen } from './src/screens/Progression/QuestsScreen';
import { AchievementsScreen } from './src/screens/Progression/AchievementsScreen';
import { BattlePassScreen } from './src/screens/Progression/BattlePassScreen';
import { BadgesScreen } from './src/screens/Progression/BadgesScreen';
import { PrestigeScreen } from './src/screens/Progression/PrestigeScreen';
import { StatsScreen } from './src/screens/Progression/StatsScreen';

type Screen =
  | 'welcome'
  | 'playerSetup'
  | 'game'
  | 'history'
  | 'learning'
  | 'tutorial_levels'
  | 'tutorial'
  | 'practice'
  | 'practice_exercise'
  | 'strategies'
  | 'progression'
  | 'quests'
  | 'achievements'
  | 'battlepass'
  | 'badges'
  | 'prestige'
  | 'stats';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [gamePlayers, setGamePlayers] = useState<Player[]>([]);
  const [selectedPracticeCategory, setSelectedPracticeCategory] = useState<PracticeCategoryType>('upper_section');

  useEffect(() => {
    // Masquer la barre de statut et la barre de navigation Android
    StatusBar.setHidden(true);
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return (
          <WelcomeScreen
            onStartGame={() => setCurrentScreen('playerSetup')}
            onShowHistory={() => setCurrentScreen('history')}
            onShowLearning={() => setCurrentScreen('learning')}
            onShowProgression={() => setCurrentScreen('progression')}
          />
        );
      case 'playerSetup':
        return (
          <PlayerSetupScreen
            onGameStart={(players) => {
              console.log('Game started with players:', players);
              setGamePlayers(players);
              setCurrentScreen('game');
            }}
          />
        );
      case 'game':
        return (
          <GameScreen
            players={gamePlayers}
            onBack={() => setCurrentScreen('welcome')}
            onNavigateToHistory={() => setCurrentScreen('history')}
            onGameEnd={(gameState) => {
              console.log('Game ended:', gameState);
              // TODO: Show results screen
              setCurrentScreen('welcome');
            }}
          />
        );
      case 'history':
        return (
          <HistoryScreenPremium
            onBack={() => setCurrentScreen('welcome')}
            onStartNewGame={() => setCurrentScreen('playerSetup')}
          />
        );
      case 'learning':
        return (
          <LearningCenterScreen
            onBack={() => setCurrentScreen('welcome')}
            onNavigateToTutorials={() => setCurrentScreen('tutorial_levels')}
            onNavigateToPractice={() => setCurrentScreen('practice')}
            onNavigateToStrategies={() => setCurrentScreen('strategies')}
            onNavigateToReplays={() => setCurrentScreen('history')}
          />
        );
      case 'tutorial_levels':
        return (
          <TutorialLevelsScreen
            onBack={() => setCurrentScreen('learning')}
            onSelectLevel={(level: TutorialLevel) => {
              setCurrentScreen('tutorial');
            }}
          />
        );
      case 'tutorial':
        return (
          <TutorialScreen
            onBack={() => setCurrentScreen('tutorial_levels')}
            onComplete={() => setCurrentScreen('learning')}
          />
        );
      case 'practice':
        return (
          <PracticeModeScreen
            onBack={() => setCurrentScreen('learning')}
            onSelectCategory={(category) => {
              setSelectedPracticeCategory(category);
              setCurrentScreen('practice_exercise');
            }}
          />
        );
      case 'practice_exercise':
        return (
          <PracticeExerciseScreen
            category={selectedPracticeCategory}
            onBack={() => setCurrentScreen('practice')}
            onComplete={() => setCurrentScreen('practice')}
          />
        );
      case 'strategies':
        return (
          <StrategyLibraryScreen
            onBack={() => setCurrentScreen('learning')}
          />
        );
      case 'progression':
        return (
          <ProgressionScreen
            navigation={{
              navigate: (screen: string) => {
                if (screen === 'Quests') setCurrentScreen('quests');
                if (screen === 'Achievements') setCurrentScreen('achievements');
                if (screen === 'BattlePass') setCurrentScreen('battlepass');
                if (screen === 'Badges') setCurrentScreen('badges');
                if (screen === 'Prestige') setCurrentScreen('prestige');
                if (screen === 'Stats') setCurrentScreen('stats');
              },
            }}
            onBack={() => setCurrentScreen('welcome')}
          />
        );
      case 'quests':
        return <QuestsScreen onBack={() => setCurrentScreen('progression')} />;
      case 'achievements':
        return <AchievementsScreen onBack={() => setCurrentScreen('progression')} />;
      case 'battlepass':
        return <BattlePassScreen onBack={() => setCurrentScreen('progression')} />;
      case 'badges':
        return <BadgesScreen onBack={() => setCurrentScreen('progression')} />;
      case 'prestige':
        return <PrestigeScreen onBack={() => setCurrentScreen('progression')} />;
      case 'stats':
        return <StatsScreen onBack={() => setCurrentScreen('progression')} />;
      default:
        return <WelcomeScreen onStartGame={() => setCurrentScreen('playerSetup')} />;
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {renderScreen()}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
