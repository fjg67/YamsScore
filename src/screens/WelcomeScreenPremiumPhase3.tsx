/**
 * Welcome Screen Premium - Phase 3: Gamification & Delight
 * Version finale avec tous les systèmes d'engagement
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { AnimatedBackground } from '../components/AnimatedBackground/AnimatedBackground';
import { DiceyMascot } from '../components/DiceyMascot/DiceyMascot';
import { ShimmerText } from '../components/ShimmerText/ShimmerText';
import { TypewriterText } from '../components/TypewriterText/TypewriterText';
import { QuickActionCard } from '../components/QuickActionCard/QuickActionCard';
import { HeroCTA } from '../components/HeroCTA/HeroCTA';
import { MiniCard } from '../components/MiniCard/MiniCard';
import { PremiumFooter } from '../components/PremiumFooter/PremiumFooter';
import { FloatingParticles } from '../components/FloatingParticles/FloatingParticles';
import { ConfettiExplosion } from '../components/ConfettiExplosion/ConfettiExplosion';
import { ThemeTransition } from '../components/ThemeTransition/ThemeTransition';
import { StreakBadge } from '../components/StreakBadge/StreakBadge';
import { SoundToggle } from '../components/SoundToggle/SoundToggle';
import { LiveActivity } from '../components/LiveActivity/LiveActivity';
import { AchievementPopup } from '../components/AchievementPopup/AchievementPopup';
import { haptics, HapticType } from '../utils/haptics';
import { streaks } from '../utils/streaks';
import { achievements, type Achievement } from '../utils/achievements';
import { easterEggs } from '../utils/easterEggs';
import { analytics, AnalyticsEvent } from '../utils/analytics';
import { useABTest, ABTests } from '../hooks/useABTest';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

const { width } = Dimensions.get('window');

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'WelcomeScreenPremiumPhase3'>;
}

export const WelcomeScreenPremiumPhase3: React.FC<Props> = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();

  // Toggle theme simple (TODO: implémenter proprement dans le thème Redux)
  const toggleTheme = () => {
    // Placeholder pour l'instant
    console.log('Toggle theme');
  };

  // Animations refs
  const diceyOpacity = useRef(new Animated.Value(0)).current;
  const diceyTranslateY = useRef(new Animated.Value(-50)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const cardsOpacity = useRef(new Animated.Value(0)).current;
  const ctaOpacity = useRef(new Animated.Value(0)).current;

  // State
  const [screenReady, setScreenReady] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [streakMessage, setStreakMessage] = useState('');
  const [streakEmoji, setStreakEmoji] = useState('🔥');
  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null);

  // A/B Testing
  const ctaTest = useABTest(ABTests.WELCOME_CTA_TEXT);

  // Initialisation de l'écran
  useEffect(() => {
    initializeScreen();
  }, []);

  const initializeScreen = useCallback(async () => {
    // Track page view
    analytics.trackPageView('welcome_screen_phase3', ctaTest.variant);

    // Vérifier et mettre à jour le streak
    const streakData = await streaks.checkAndUpdateStreak();
    setCurrentStreak(streakData.currentStreak);
    setStreakMessage(streaks.getStreakMessage(streakData.currentStreak));
    setStreakEmoji(streaks.getStreakEmoji(streakData.currentStreak));

    // Vérifier les achievements liés au streak
    const newAchievements = await achievements.checkStreakAchievements(streakData.currentStreak);
    if (newAchievements.length > 0) {
      // Afficher le premier achievement débloqué
      setTimeout(() => {
        setUnlockedAchievement(newAchievements[0]);
        analytics.trackAchievement(newAchievements[0].id);
      }, 2500);
    }

    // Lancer l'animation cinématique
    playCinematicEntry();
  }, [ctaTest.variant]);

  const playCinematicEntry = useCallback(() => {
    Animated.sequence([
      // Délai initial
      Animated.delay(200),

      // 1. Dicey entre en scène (0.5s)
      Animated.parallel([
        Animated.timing(diceyOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(diceyTranslateY, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),

      Animated.delay(100),

      // 2. Titre apparaît (0.6s)
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

      Animated.delay(200),

      // 3. Sous-titre typewriter commence (géré par le composant)
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),

      Animated.delay(300),

      // 4. Cartes apparaissent (0.5s)
      Animated.timing(cardsOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),

      Animated.delay(100),

      // 5. CTA apparaît (0.6s)
      Animated.timing(ctaOpacity, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setScreenReady(true);
    });
  }, [diceyOpacity, diceyTranslateY, titleOpacity, subtitleOpacity, cardsOpacity, ctaOpacity]);

  // Handlers
  const handleStartGame = () => {
    haptics.trigger(HapticType.SUCCESS);
    analytics.trackConversion('start_game', ctaTest.variant);

    setShowConfetti(true);

    setTimeout(() => {
      navigation.navigate('NewGame');
    }, 1000);
  };

  const handleMascotTap = () => {
    const easterEgg = easterEggs.registerTap();
    if (easterEgg) {
      setUnlockedAchievement({
        id: 'easter_egg_triple_tap' as any,
        title: easterEgg.title,
        description: easterEgg.message,
        emoji: easterEgg.emoji,
        unlocked: true,
      });
      analytics.trackEasterEgg(easterEgg.type);
    }
  };

  const handleMascotShake = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  const handleQuickAction = (action: string) => {
    haptics.trigger(HapticType.MEDIUM);
    analytics.track(AnalyticsEvent.QUICK_ACTION_CLICKED, { action });

    if (action === 'new_game') {
      navigation.navigate('NewGame');
    } else if (action === 'history') {
      navigation.navigate('History');
    } else if (action === 'stats') {
      navigation.navigate('Stats');
    }
  };

  return (
    <ThemeTransition isDarkMode={isDarkMode}>
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#0A0A0A' : '#FFFFFF' }]}>
        {/* Background animé */}
        <AnimatedBackground isDarkMode={isDarkMode} />

        {/* Particules flottantes */}
        <FloatingParticles
          count={12}
          colors={['#4A90E2', '#50C878', '#FF6B6B', '#FFD700']}
          minSize={4}
          maxSize={12}
          speed={8000}
        />

        {/* Achievement popup */}
        {unlockedAchievement && (
          <AchievementPopup
            achievement={unlockedAchievement}
            onClose={() => setUnlockedAchievement(null)}
          />
        )}

        {/* Confettis */}
        {showConfetti && (
          <ConfettiExplosion
            count={40}
            origin={{ x: width / 2, y: 200 }}
            colors={['#FF6B6B', '#4A90E2', '#50C878', '#FFD700', '#9B59B6', '#FF8C00']}
            duration={2000}
            spread={250}
            onComplete={() => setShowConfetti(false)}
          />
        )}

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header simplifié - contrôles supprimés */}
          <View style={styles.header}>
            {/* Header vide pour l'espace safe area */}
          </View>

          {/* Mascotte */}
          <Animated.View
            style={{
              opacity: diceyOpacity,
              transform: [{ translateY: diceyTranslateY }],
              alignItems: 'center',
              marginTop: 20,
            }}
          >
            <DiceyMascot
              size={140}
              onTap={handleMascotTap}
              onShake={handleMascotShake}
            />
          </Animated.View>

          {/* Titre avec shimmer */}
          <Animated.View style={{ opacity: titleOpacity, marginTop: 24 }}>
            <ShimmerText style={{ fontSize: 42, fontWeight: '800' }}>
              Yams Score
            </ShimmerText>
          </Animated.View>

          {/* Sous-titre avec typewriter */}
          <Animated.View style={{ opacity: subtitleOpacity, marginTop: 12 }}>
            <TypewriterText
              text="Suivez vos scores, défiez vos amis !"
              style={{ fontSize: 16, color: theme.text.secondary }}
              delay={500}
              speed={50}
            />
          </Animated.View>

          {/* Streak Badge (grande version) - Désactivé */}
          {/* {currentStreak > 0 && (
            <View style={styles.streakContainer}>
              <StreakBadge
                streak={currentStreak}
                emoji={streakEmoji}
                message={streakMessage}
                compact={false}
              />
            </View>
          )} */}

          {/* Quick Actions */}
          <Animated.View style={{ opacity: cardsOpacity, width: '100%', marginTop: 32 }}>
            <View style={styles.quickActions}>
              <QuickActionCard
                icon="🎲"
                label="Nouvelle Partie"
                gradientColors={['#4A90E2', '#357ABD']}
                onPress={() => handleQuickAction('new_game')}
              />
              <QuickActionCard
                icon="📊"
                label="Statistiques"
                gradientColors={['#50C878', '#3DA05F']}
                onPress={() => handleQuickAction('stats')}
              />
              <QuickActionCard
                icon="📜"
                label="Historique"
                gradientColors={['#FF6B6B', '#CC5555']}
                onPress={() => handleQuickAction('history')}
              />
            </View>
          </Animated.View>

          {/* Hero CTA avec A/B testing */}
          <Animated.View style={{ opacity: ctaOpacity, width: '100%', marginTop: 32 }}>
            <HeroCTA
              title={ctaTest.isVariantA ? 'Commencer' : 'Jouer maintenant'}
              icon="🚀"
              onPress={handleStartGame}
              badge={currentStreak > 2 ? `${currentStreak} 🔥` : undefined}
            />
          </Animated.View>

          {/* Mini Cards */}
          <View style={styles.miniCards}>
            <MiniCard
              emoji="📈"
              title="Statistiques"
              subtitle="Suivez votre progression"
              accentColor="#4A90E2"
              onPress={() => handleQuickAction('stats')}
            />
            <MiniCard
              emoji="📚"
              title="Règles"
              subtitle="Apprenez les règles du Yams"
              accentColor="#50C878"
              onPress={() => navigation.navigate('Rules')}
            />
          </View>

          {/* Footer */}
          <PremiumFooter
            onSettingsPress={() => navigation.navigate('Settings')}
            onHelpPress={() => navigation.navigate('Help')}
            onAboutPress={() => navigation.navigate('About')}
            isDarkMode={isDarkMode}
          />
        </ScrollView>
      </View>
    </ThemeTransition>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themeButton: {
    padding: 8,
  },
  themeIcon: {
    fontSize: 20,
  },
  liveActivityContainer: {
    width: '100%',
    marginTop: 12,
  },
  streakContainer: {
    marginTop: 24,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  miniCards: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 20,
  },
});
