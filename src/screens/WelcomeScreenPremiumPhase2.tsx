/**
 * Welcome Screen Premium - Phase 2 : Interactions & Polish
 * Version ultra-polished avec haptics, particules et confettis
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Animated,
  ScrollView,
  Modal,
  TouchableOpacity,
  Text,
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
import { haptics } from '../utils/haptics';

// Import des composants premium
import { AnimatedBackground } from '../components/AnimatedBackground';
import { DiceyMascot } from '../components/DiceyMascot';
import { ShimmerText } from '../components/ShimmerText';
import { TypewriterText } from '../components/TypewriterText';
import { QuickActionCard } from '../components/QuickActionCard';
import { HeroCTA } from '../components/HeroCTA';
import { MiniCard } from '../components/MiniCard';
import { PremiumFooter } from '../components/PremiumFooter';
import { FloatingParticles } from '../components/FloatingParticles';
import { ConfettiExplosion } from '../components/ConfettiExplosion';
import { ThemeTransition } from '../components/ThemeTransition';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface WelcomeState {
  isLoading: boolean;
  hasOngoingGame: boolean;
  gamesCount: number;
  showModal: boolean;
  showConfetti: boolean;
  confettiOrigin: { x: number; y: number };
}

const WelcomeScreenPremiumPhase2: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const { theme, isDarkMode } = useTheme();

  const [state, setState] = useState<WelcomeState>({
    isLoading: true,
    hasOngoingGame: false,
    gamesCount: 0,
    showModal: false,
    showConfetti: false,
    confettiOrigin: { x: 200, y: 400 },
  });

  // Animations refs
  const mascotOpacity = React.useRef(new Animated.Value(0)).current;
  const mascotTranslateY = React.useRef(new Animated.Value(-200)).current;
  const titleOpacity = React.useRef(new Animated.Value(0)).current;
  const quickActionsOpacity = React.useRef(new Animated.Value(0)).current;
  const quickActionsScale = React.useRef(new Animated.Value(0)).current;
  const ctaOpacity = React.useRef(new Animated.Value(0)).current;
  const ctaTranslateY = React.useRef(new Animated.Value(40)).current;
  const miniCardsOpacity = React.useRef(new Animated.Value(0)).current;
  const footerOpacity = React.useRef(new Animated.Value(0)).current;

  // Animation d'entrée cinématique (2.2 secondes)
  const playCinematicEntry = useCallback(() => {
    Animated.sequence([
      // 1. Dicey tombe du ciel avec bounce (200-800ms)
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(mascotOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(mascotTranslateY, {
          toValue: 0,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),

      // 2. Titre avec shimmer (500-900ms)
      Animated.delay(100),
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),

      // 3. Quick actions en cascade (1000-1500ms)
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(quickActionsOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(quickActionsScale, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),

      // 4. CTA hero (1300-1700ms)
      Animated.delay(100),
      Animated.parallel([
        Animated.timing(ctaOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(ctaTranslateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),

      // 5. Mini-cards (1500-2000ms)
      Animated.delay(100),
      Animated.timing(miniCardsOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),

      // 6. Footer (1800-2200ms)
      Animated.delay(100),
      Animated.timing(footerOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [mascotOpacity, mascotTranslateY, titleOpacity, quickActionsOpacity, quickActionsScale, ctaOpacity, ctaTranslateY, miniCardsOpacity, footerOpacity]);

  // Charger les données
  const initializeScreen = useCallback(async () => {
    try {
      const [currentGameId, allGames] = await Promise.all([
        loadCurrentGameId(),
        loadAllGames(),
      ]);

      let hasOngoing = false;
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
      playCinematicEntry();
    } catch (error) {
      console.error('Error initializing welcome screen:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [playCinematicEntry]);

  useEffect(() => {
    initializeScreen();
  }, [initializeScreen]);

  // Handlers avec haptic feedback
  const handleNewGame = () => {
    haptics.success();

    // Confettis !
    setState(prev => ({
      ...prev,
      showConfetti: true,
      confettiOrigin: { x: 200, y: 400 },
    }));

    setTimeout(() => {
      navigation.navigate('PlayerSetup');
    }, 300);
  };

  const handleContinue = async () => {
    haptics.light();
    const currentGameId = await loadCurrentGameId();
    if (currentGameId) {
      const game = await loadGameFromStorage(currentGameId);
      if (game) {
        dispatch(loadGameAction(game));
        navigation.navigate('Game', { gameId: currentGameId });
      }
    }
  };

  const handleStats = () => {
    haptics.light();
    navigation.navigate('History');
  };

  const handleRules = () => {
    haptics.light();
    navigation.navigate('Rules');
  };

  const handleSettings = () => {
    haptics.light();
    navigation.navigate('Settings');
  };

  const handleAbout = () => {
    haptics.light();
    setState(prev => ({ ...prev, showModal: true }));
  };

  const handleDiceyTap = () => {
    console.log('Dicey tapped! 🎲');
    // Confettis depuis Dicey !
    setState(prev => ({
      ...prev,
      showConfetti: true,
      confettiOrigin: { x: 200, y: 200 },
    }));
  };

  const handleDiceyShake = () => {
    console.log('Dicey shaken! 🎲');
  };

  if (state.isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <AnimatedBackground isDarkMode={isDarkMode} />
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor="transparent"
          translucent
        />
        <View style={styles.loadingContainer}>
          <DiceyMascot size={100} />
        </View>
      </View>
    );
  }

  return (
    <ThemeTransition isDarkMode={isDarkMode}>
      <View style={styles.container}>
        {/* Background animé */}
        <AnimatedBackground isDarkMode={isDarkMode} />

        {/* Particules flottantes */}
        <FloatingParticles
          count={12}
          colors={isDarkMode
            ? ['#5DADE2', '#58D68D', '#FFB74D', '#BA68C8']
            : ['#4A90E2', '#50C878', '#FFD700', '#9B59B6']
          }
        />

        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor="transparent"
          translucent
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Mascotte Dicey */}
          <Animated.View
            style={[
              styles.mascotContainer,
              {
                opacity: mascotOpacity,
                transform: [{ translateY: mascotTranslateY }],
              },
            ]}
          >
            <DiceyMascot
              size={140}
              onTap={handleDiceyTap}
              onShake={handleDiceyShake}
            />
          </Animated.View>

          {/* Titre avec shimmer */}
          <Animated.View
            style={[
              styles.titleContainer,
              { opacity: titleOpacity },
            ]}
          >
            <ShimmerText
              style={{ ...styles.title, color: theme.text.primary }}
            >
              Yams Score
            </ShimmerText>
          </Animated.View>

          {/* Baseline avec typewriter */}
          <View style={styles.baselineContainer}>
            <TypewriterText
              text="Lancez les dés, on s'occupe du reste ✨"
              style={{ ...styles.baseline, color: theme.text.secondary }}
              delay={800}
              speed={50}
            />
          </View>

          {/* Quick Actions */}
          <Animated.View
            style={[
              styles.quickActions,
              {
                opacity: quickActionsOpacity,
                transform: [{ scale: quickActionsScale }],
              },
            ]}
          >
            <QuickActionCard
              icon="🎲"
              label="Jouer"
              gradientColors={['#4A90E2', '#5DADE2']}
              onPress={handleNewGame}
              testID="quick-action-play"
            />

            <QuickActionCard
              icon="👥"
              label="Amis"
              gradientColors={['#50C878', '#58D68D']}
              onPress={handleNewGame}
              testID="quick-action-friends"
            />

            <QuickActionCard
              icon="🏆"
              label="Scores"
              gradientColors={['#FFD700', '#FFA500']}
              onPress={handleStats}
              testID="quick-action-scores"
            />
          </Animated.View>

          {/* Hero CTA */}
          <Animated.View
            style={[
              styles.ctaContainer,
              {
                opacity: ctaOpacity,
                transform: [{ translateY: ctaTranslateY }],
              },
            ]}
          >
            <HeroCTA
              title="Nouvelle Partie"
              subtitle="2-6 joueurs • 15 min"
              icon="🎲"
              badge="Populaire 🔥"
              onPress={handleNewGame}
              testID="hero-cta"
            />

            {state.hasOngoingGame && (
              <View style={styles.continueCTA}>
                <HeroCTA
                  title="Reprendre"
                  subtitle="Partie en cours"
                  icon="▶️"
                  onPress={handleContinue}
                  testID="continue-cta"
                />
              </View>
            )}
          </Animated.View>

          {/* Section Explorer */}
          <Animated.View
            style={[
              styles.exploreSection,
              { opacity: miniCardsOpacity },
            ]}
          >
            <Text style={[styles.exploreTitle, { color: theme.text.secondary }]}>
              Ou explorer...
            </Text>

            <View style={styles.miniCardsRow}>
              <MiniCard
                emoji="📊"
                title="Statistiques"
                subtitle={`${state.gamesCount} parties`}
                accentColor="#9B59B6"
                onPress={handleStats}
                testID="mini-card-stats"
              />

              <MiniCard
                emoji="🎓"
                title="Apprendre"
                subtitle="Guide complet"
                accentColor="#FF8C00"
                onPress={handleRules}
                testID="mini-card-rules"
              />
            </View>
          </Animated.View>

          {/* Footer Premium */}
          <Animated.View style={{ opacity: footerOpacity }}>
            <PremiumFooter
              rating={4.9}
              userCount="10K+"
              onSettingsPress={handleSettings}
              onHelpPress={handleRules}
              onAboutPress={handleAbout}
              isDarkMode={isDarkMode}
            />
          </Animated.View>
        </ScrollView>

        {/* Confettis */}
        {state.showConfetti && (
          <ConfettiExplosion
            count={40}
            origin={state.confettiOrigin}
            duration={2500}
            spread={250}
            onComplete={() => setState(prev => ({ ...prev, showConfetti: false }))}
          />
        )}

        {/* Modal À propos */}
        <Modal
          visible={state.showModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setState(prev => ({ ...prev, showModal: false }))}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
              <Text style={[styles.modalTitle, { color: theme.text.primary }]}>
                À propos
              </Text>
              <Text style={[styles.modalText, { color: theme.text.secondary }]}>
                Yams Score - Version Premium Phase 2{'\n'}
                La meilleure façon de jouer au Yams !{'\n\n'}
                ✨ Avec haptic feedback{'\n'}
                🎨 Particules flottantes{'\n'}
                🎉 Confettis interactifs{'\n'}
                🎭 Mascotte vivante
              </Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  haptics.light();
                  setState(prev => ({ ...prev, showModal: false }));
                }}
              >
                <Text style={styles.modalButtonText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ThemeTransition>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingTop: 80,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  mascotContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -1.5,
    textAlign: 'center',
  },
  baselineContainer: {
    alignItems: 'center',
    marginBottom: 32,
    minHeight: 30,
  },
  baseline: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  ctaContainer: {
    marginBottom: 24,
  },
  continueCTA: {
    marginTop: 12,
  },
  exploreSection: {
    marginBottom: 24,
  },
  exploreTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  miniCardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 16,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WelcomeScreenPremiumPhase2;
