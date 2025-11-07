import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  useColorScheme,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { Player, GameConfig } from '../../../../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SummaryScreenPremiumProps {
  players: Player[];
  gameConfig: GameConfig;
  onLaunch: () => void;
  onBack: () => void;
}

// Floating particles component for background
const FloatingParticle = ({ delay = 0 }: { delay?: number }) => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const translateX = useRef(new Animated.Value(Math.random() * SCREEN_WIDTH)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5 + Math.random() * 0.5)).current;

  useEffect(() => {
    const animate = () => {
      translateY.setValue(SCREEN_HEIGHT);
      translateX.setValue(Math.random() * SCREEN_WIDTH);
      opacity.setValue(0);

      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -100,
            duration: 8000 + Math.random() * 4000,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.15 + Math.random() * 0.15,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.8 + Math.random() * 0.4,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };

    animate();
  }, [delay, translateY, translateX, opacity, scale]);

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          transform: [
            { translateX },
            { translateY },
            { scale },
          ],
          opacity,
        },
      ]}
    />
  );
};

const SummaryScreenPremium: React.FC<SummaryScreenPremiumProps> = ({
  players,
  gameConfig,
  onLaunch,
  onBack,
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();
  const buttonScale = useRef(new Animated.Value(1)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;
  const confettiScale = useRef(new Animated.Value(1)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const titleScale = useRef(new Animated.Value(0.8)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  // Initialize card animations
  const cardsAnimRef = useRef<Animated.Value[]>([]);
  if (cardsAnimRef.current.length !== players.length) {
    cardsAnimRef.current = players.map(() => new Animated.Value(0));
  }
  const cardsAnim = cardsAnimRef.current;

  useEffect(() => {
    // Glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.6,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse animation pour le bouton
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonScale, {
          toValue: 1.06,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(buttonScale, {
          toValue: 1.0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Confetti rotation
    Animated.loop(
      Animated.timing(confettiAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    // Confetti breathing
    Animated.loop(
      Animated.sequence([
        Animated.timing(confettiScale, {
          toValue: 1.15,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(confettiScale, {
          toValue: 1.0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Title entrance
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(titleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(titleScale, {
          toValue: 1,
          tension: 40,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }, 300);

    // Subtitle entrance
    setTimeout(() => {
      Animated.timing(subtitleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 700);

    // Stagger cards animation
    setTimeout(() => {
      Animated.stagger(
        120,
        cardsAnim.map(anim =>
          Animated.spring(anim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          })
        )
      ).start();
    }, 1000);
  }, []);

  const confettiRotate = confettiAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const renderPlayerCard = (player: Player, index: number) => {
    const cardTranslate = cardsAnim[index].interpolate({
      inputRange: [0, 1],
      outputRange: [50, 0],
    });

    const cardScale = cardsAnim[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0.9, 1],
    });

    return (
      <Animated.View
        key={player.id}
        style={[
          styles.playerCard,
          {
            opacity: cardsAnim[index],
            transform: [
              { translateX: cardTranslate },
              { scale: cardScale },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.2)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.playerCardGradient}
        >
          {/* Position badge */}
          <View style={styles.positionBadge}>
            <LinearGradient
              colors={
                index === 0
                  ? ['#FFD700', '#FFA500']
                  : ['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.25)']
              }
              style={styles.positionBadgeGradient}
            >
              <Text style={[styles.positionNumber, index === 0 && styles.positionNumberFirst]}>
                {index + 1}
              </Text>
            </LinearGradient>
          </View>

          {/* Avatar with gradient */}
          <LinearGradient
            colors={[player.color, adjustColor(player.color, -20)]}
            style={styles.playerAvatar}
          >
            <Text style={styles.playerAvatarText}>
              {player.name[0].toUpperCase()}
            </Text>
          </LinearGradient>

          {/* Player info */}
          <View style={styles.playerInfo}>
            <Text style={styles.playerName}>{player.name}</Text>
            {player.isAI && (
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']}
                style={styles.aiLabel}
              >
                <Text style={styles.aiText}>🤖 IA</Text>
              </LinearGradient>
            )}
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Background gradient */}
      <LinearGradient
        colors={
          isDarkMode
            ? ['#0F0C29', '#302B63', '#24243e']
            : ['#667eea', '#764ba2', '#f093fb', '#4facfe']
        }
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Animated background particles */}
      <View style={styles.particlesContainer}>
        {[...Array(15)].map((_, i) => (
          <FloatingParticle key={i} delay={i * 400} />
        ))}
      </View>

      {/* Glow effect */}
      <Animated.View
        style={[
          styles.glowContainer,
          { opacity: glowAnim }
        ]}
      >
        <LinearGradient
          colors={['rgba(102, 126, 234, 0.4)', 'transparent', 'rgba(118, 75, 162, 0.4)']}
          style={styles.glowGradient}
        />
      </Animated.View>

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
          <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.8}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.2)']}
              style={styles.backButtonInner}
            >
              <Text style={styles.backIcon}>←</Text>
              <Text style={styles.backText}>Modifier</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Title Section with animated confetti */}
          <View style={styles.titleSection}>
            <Animated.Text
              style={[
                styles.confetti,
                {
                  transform: [
                    { rotate: confettiRotate },
                    { scale: confettiScale },
                  ],
                },
              ]}
            >
              🎉
            </Animated.Text>

            <Animated.View
              style={{
                opacity: titleAnim,
                transform: [
                  {
                    translateY: titleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-30, 0],
                    })
                  },
                  { scale: titleScale },
                ],
              }}
            >
              <View style={styles.titleContainer}>
                <Text style={[styles.title, styles.titleGlow]}>Tout est prêt !</Text>
                <Text style={styles.title}>Tout est prêt !</Text>
              </View>
              <Animated.Text
                style={[
                  styles.subtitle,
                  { opacity: subtitleAnim }
                ]}
              >
                ✨ La partie va commencer avec {players.length} joueur{players.length > 1 ? 's' : ''} ✨
              </Animated.Text>
            </Animated.View>
          </View>

          {/* Game Config Card */}
          <View style={styles.configSection}>
            <Text style={styles.sectionTitle}>RÉCAPITULATIF</Text>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.2)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.configCard}
            >
              <View style={styles.configRow}>
                <View style={styles.configIconContainer}>
                  <Text style={styles.configIcon}>👥</Text>
                </View>
                <Text style={styles.configLabel}>{players.length} joueur{players.length > 1 ? 's' : ''}</Text>
              </View>
              <View style={styles.configRow}>
                <View style={styles.configIconContainer}>
                  <Text style={styles.configIcon}>🎮</Text>
                </View>
                <Text style={styles.configLabel}>
                  {gameConfig.mode === 'classic' ? 'Mode Classique' : 'Mode Descendant'}
                </Text>
              </View>
              <View style={styles.configRow}>
                <View style={styles.configIconContainer}>
                  <Text style={styles.configIcon}>📋</Text>
                </View>
                <Text style={styles.configLabel}>
                  {gameConfig.orderType === 'random' ? 'Ordre aléatoire' : 'Ordre manuel'}
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* Players Section */}
          <View style={styles.playersSection}>
            <Text style={styles.sectionTitle}>JOUEURS</Text>
            {players.map((player, index) => renderPlayerCard(player, index))}
          </View>

          {/* Bottom spacing */}
          <View style={{ height: 140 }} />
        </ScrollView>

        {/* Launch Button - Fixed at bottom */}
        <View style={[styles.bottomSection, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              onPress={onLaunch}
              activeOpacity={0.85}
              style={styles.launchButton}
            >
              <LinearGradient
                colors={['#667eea', '#764ba2', '#f093fb']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.launchGradient}
              >
                <View style={styles.launchContent}>
                  <Text style={styles.launchIcon}>🎲</Text>
                  <Text style={styles.launchText}>LANCER LA PARTIE</Text>
                  <Text style={styles.launchIcon}>🎲</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Animated.Text
            style={[
              styles.launchHint,
              { opacity: subtitleAnim }
            ]}
          >
            Que la meilleure chance gagne ! 🍀
          </Animated.Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

// Helper function
const adjustColor = (hex: string, amount: number): string => {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amount));
  const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  particlesContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ffffff',
  },
  glowContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  glowGradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  backIcon: {
    fontSize: 22,
    color: '#FFFFFF',
  },
  backText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  titleSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  confetti: {
    fontSize: 72,
    marginBottom: 20,
  },
  titleContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  titleGlow: {
    position: 'absolute',
    color: '#FFFFFF',
    opacity: 0.5,
    textShadowColor: '#ffffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 1,
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  configSection: {
    marginBottom: 32,
  },
  configCard: {
    padding: 22,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  configRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  configIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  configIcon: {
    fontSize: 26,
  },
  configLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  playersSection: {
    marginBottom: 24,
  },
  playerCard: {
    marginBottom: 14,
  },
  playerCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  positionBadge: {
    marginRight: 16,
  },
  positionBadgeGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  positionNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  positionNumberFirst: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowRadius: 6,
  },
  playerAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  playerAvatarText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  playerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  playerName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  aiLabel: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  aiText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopWidth: 0,
  },
  launchButton: {
    marginBottom: 14,
  },
  launchGradient: {
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...Platform.select({
      ios: {
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.5,
        shadowRadius: 24,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  launchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 22,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 26,
  },
  launchIcon: {
    fontSize: 28,
    marginHorizontal: 10,
  },
  launchText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.2,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  launchHint: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});

export default SummaryScreenPremium;
