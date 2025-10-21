/**
 * Page de bienvenue (Welcome Screen)
 * Nouvelle version avec animations et design moderne
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAppDispatch } from '../store/hooks';
import { loadGame as loadGameAction } from '../store/slices/gameSlice';
import {
  loadCurrentGameId,
  loadGame as loadGameFromStorage,
  loadAllGames,
} from '../utils/storage';
import { useTheme } from '../hooks/useTheme';
import { WelcomeScreenState } from './WelcomeScreen.types';
import { Logo } from '../components/Logo/Logo';
import { PrimaryButton } from '../components/Buttons/PrimaryButton';
import { SecondaryButton } from '../components/Buttons/SecondaryButton';
import { TertiaryButton } from '../components/Buttons/TertiaryButton';
import { DiceIllustration } from '../components/DiceIllustration/DiceIllustration';
import { FooterLinks } from '../components/FooterLinks/FooterLinks';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const { theme, isDarkMode } = useTheme();

  const [state, setState] = useState<WelcomeScreenState>({
    isLoading: true,
    hasOngoingGame: false,
    gamesCount: 0,
    isFirstLaunch: false,
  });

  // Animations
  const titleOpacity = React.useRef(new Animated.Value(0)).current;
  const titleTranslateY = React.useRef(new Animated.Value(20)).current;
  const baselineOpacity = React.useRef(new Animated.Value(0)).current;
  const heroOpacity = React.useRef(new Animated.Value(0)).current;
  const heroScale = React.useRef(new Animated.Value(0.9)).current;
  const buttonsOpacity = React.useRef(new Animated.Value(0)).current;
  const buttonsTranslateY = React.useRef(new Animated.Value(30)).current;
  const footerOpacity = React.useRef(new Animated.Value(0)).current;

  const playWelcomeAnimation = React.useCallback(() => {
    // Animation orchestrée en séquence
    Animated.sequence([
      // Logo déjà animé dans son composant (delay: 0)
      Animated.delay(200), // Attendre le logo

      // Titre
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),

      // Baseline
      Animated.delay(200),
      Animated.timing(baselineOpacity, {
        toValue: 0.8,
        duration: 400,
        useNativeDriver: true,
      }),

      // Hero illustration
      Animated.delay(100),
      Animated.parallel([
        Animated.timing(heroOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(heroScale, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),

      // Boutons
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(buttonsOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(buttonsTranslateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),

      // Footer
      Animated.delay(400),
      Animated.timing(footerOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [titleOpacity, titleTranslateY, baselineOpacity, heroOpacity, heroScale, buttonsOpacity, buttonsTranslateY, footerOpacity]);

  const initializeScreen = React.useCallback(async () => {
    try {
      // Charger les données en parallèle
      const [currentGameId, allGames] = await Promise.all([
        loadCurrentGameId(),
        loadAllGames(),
      ]);

      let hasOngoing = false;

      // Vérifier si la partie en cours existe et est toujours active
      if (currentGameId) {
        const game = await loadGameFromStorage(currentGameId);
        hasOngoing = game !== null && game.status === 'in_progress';
      }

      setState(prev => ({
        ...prev,
        hasOngoingGame: hasOngoing,
        gamesCount: allGames.length,
        isLoading: false,
      }));

      // Lancer les animations d'entrée
      playWelcomeAnimation();
    } catch (error) {
      console.error('Error initializing welcome screen:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      playWelcomeAnimation();
    }
  }, [playWelcomeAnimation]);

  useEffect(() => {
    initializeScreen();
  }, [initializeScreen]);

  const handleNewGame = () => {
    navigation.navigate('PlayerSetup');
  };

  const handleContinue = async () => {
    const currentGameId = await loadCurrentGameId();
    if (currentGameId) {
      try {
        const game = await loadGameFromStorage(currentGameId);
        if (game) {
          dispatch(loadGameAction(game));
          navigation.navigate('Game', { gameId: currentGameId });
        }
      } catch (error) {
        console.error('Error loading game:', error);
      }
    }
  };

  const handleHistory = () => {
    navigation.navigate('History');
  };

  const handleRules = () => {
    navigation.navigate('Rules');
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  const handleAbout = () => {
    navigation.navigate('About');
  };

  if (state.isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={theme.background}
        />
        <Logo size={80} animated={false} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      {/* Header Zone */}
      <View style={styles.header}>
        <Logo size={80} animated={true} />

        <Animated.Text
          style={[
            styles.title,
            {
              color: theme.text.primary,
              opacity: titleOpacity,
              transform: [{ translateY: titleTranslateY }],
            },
          ]}
        >
          Yams Score
        </Animated.Text>

        <Animated.Text
          style={[
            styles.baseline,
            {
              color: theme.text.secondary,
              opacity: baselineOpacity,
            },
          ]}
        >
          Votre feuille de score digitale
        </Animated.Text>
      </View>

      {/* Hero Zone */}
      <Animated.View
        style={[
          styles.hero,
          {
            opacity: heroOpacity,
            transform: [{ scale: heroScale }],
          },
        ]}
      >
        <DiceIllustration animated={!state.isFirstLaunch} />
      </Animated.View>

      {/* Actions Zone */}
      <Animated.View
        style={[
          styles.actions,
          {
            opacity: buttonsOpacity,
            transform: [{ translateY: buttonsTranslateY }],
          },
        ]}
      >
        <PrimaryButton
          title="Nouvelle Partie"
          icon="🎲"
          onPress={handleNewGame}
          testID="new-game-button"
        />

        {state.hasOngoingGame && (
          <SecondaryButton
            title="Continuer"
            icon="▶️"
            onPress={handleContinue}
            badge="En cours"
            testID="continue-button"
          />
        )}

        <TertiaryButton
          title="Historique"
          icon="📋"
          onPress={handleHistory}
          badge={state.gamesCount > 0 ? `${state.gamesCount} parties` : undefined}
          testID="history-button"
          isDarkMode={isDarkMode}
        />
      </Animated.View>

      {/* Footer Zone */}
      <Animated.View
        style={[
          styles.footer,
          { opacity: footerOpacity },
        ]}
      >
        <FooterLinks
          onRulesPress={handleRules}
          onSettingsPress={handleSettings}
          onAboutPress={handleAbout}
          textColor={theme.text.secondary}
        />
        <Text style={[styles.version, { color: theme.text.tertiary }]}>
          v1.0.0
        </Text>
      </Animated.View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 16,
    letterSpacing: -0.5,
  },
  baseline: {
    fontSize: 16,
    marginTop: 8,
  },
  hero: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    marginBottom: 40,
  },
  actions: {
    gap: 16,
    marginBottom: 40,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  version: {
    fontSize: 12,
    marginTop: 16,
  },
});

export default WelcomeScreen;
