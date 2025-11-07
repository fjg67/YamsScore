import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  useColorScheme,
  Dimensions,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { LuckyMascot } from '../../../components/Lucky';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface WelcomeScreenProps {
  onStartGame?: () => void;
  onShowHistory?: () => void;
  onShowLearning?: () => void;
  onShowProgression?: () => void;
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

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartGame,
  onShowHistory,
  onShowLearning,
  onShowProgression
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [pressedCard, setPressedCard] = useState<number | null>(null);

  // Animation values
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(50)).current;
  const titleScale = useRef(new Animated.Value(0.8)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const featuresOpacity = useRef(new Animated.Value(0)).current;
  const featuresY = useRef(new Animated.Value(60)).current;
  const ctaOpacity = useRef(new Animated.Value(0)).current;
  const ctaScale = useRef(new Animated.Value(0.8)).current;
  const glowOpacity = useRef(new Animated.Value(0.3)).current;

  // Gradient animation
  const gradientAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Gradient loop animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(gradientAnim, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: false,
        }),
        Animated.timing(gradientAnim, {
          toValue: 0,
          duration: 8000,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 0.6,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Logo entrance animation
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Logo continuous rotation
      Animated.loop(
        Animated.timing(logoRotate, {
          toValue: 1,
          duration: 20000,
          useNativeDriver: true,
        })
      ).start();

      // Logo breathing effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(logoScale, {
            toValue: 1.1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(logoScale, {
            toValue: 1.0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    // Title animation
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(titleY, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(titleScale, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }, 300);

    // Subtitle
    setTimeout(() => {
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 700);

    // Features
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(featuresOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(featuresY, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }, 1000);

    // CTA
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(ctaOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(ctaScale, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // CTA continuous pulse
        Animated.loop(
          Animated.sequence([
            Animated.timing(ctaScale, {
              toValue: 1.05,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(ctaScale, {
              toValue: 1.0,
              duration: 1500,
              useNativeDriver: true,
            }),
          ])
        ).start();
      });
    }, 1400);
  }, [
    logoScale,
    logoOpacity,
    logoRotate,
    titleOpacity,
    titleY,
    titleScale,
    subtitleOpacity,
    featuresOpacity,
    featuresY,
    ctaOpacity,
    ctaScale,
    glowOpacity,
    gradientAnim
  ]);

  const logoRotateInterpolate = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleStartGame = () => {
    if (onStartGame) {
      onStartGame();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <LinearGradient
        colors={
          isDarkMode
            ? ['#0F0C29', '#302B63', '#24243e']
            : ['#667eea', '#764ba2', '#f093fb', '#4facfe']
        }
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
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
            { opacity: glowOpacity }
          ]}
        >
          <LinearGradient
            colors={['rgba(102, 126, 234, 0.4)', 'transparent', 'rgba(118, 75, 162, 0.4)']}
            style={styles.glowGradient}
          />
        </Animated.View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <Animated.View
              style={[
                styles.logoContainer,
                {
                  transform: [
                    { scale: logoScale },
                    { rotate: logoRotateInterpolate },
                  ],
                  opacity: logoOpacity,
                },
              ]}
            >
              <View style={styles.logoBackdrop}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.1)']}
                  style={styles.logoGlassEffect}
                >
                  <LuckyMascot
                    size={140}
                    initialExpression="happy"
                    initialAnimation="enter_pop"
                    context={{ screen: 'home' }}
                    position={{ x: 0, y: 0, placement: 'center' }}
                    interactions={{
                      onTap: () => console.log('Lucky tapped!'),
                      onDoubleTap: () => console.log('Lucky double-tapped!'),
                    }}
                  />
                </LinearGradient>
              </View>
            </Animated.View>

            {/* Title with glow */}
            <Animated.View
              style={{
                opacity: titleOpacity,
                transform: [
                  { translateY: titleY },
                  { scale: titleScale },
                ],
              }}
            >
              <View style={styles.titleContainer}>
                <Text style={[styles.title, styles.titleGlow]}>Yams Score</Text>
                <Text style={styles.title}>Yams Score</Text>
              </View>
              <Animated.Text
                style={[styles.subtitle, { opacity: subtitleOpacity }]}
              >
                ✨ La feuille de marque réinventée ✨
              </Animated.Text>
            </Animated.View>
          </View>

          {/* Stats Banner */}
          <Animated.View
            style={[
              styles.statsContainer,
              {
                opacity: featuresOpacity,
                transform: [{ translateY: featuresY }]
              }
            ]}
          >
            <View style={styles.glassBanner}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
                style={styles.glassBannerGradient}
              >
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>∞</Text>
                  <Text style={styles.statLabel}>Parties</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>100%</Text>
                  <Text style={styles.statLabel}>Gratuit</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>0</Text>
                  <Text style={styles.statLabel}>Pub</Text>
                </View>
              </LinearGradient>
            </View>
          </Animated.View>

          {/* Features with glassmorphism */}
          <Animated.View
            style={[
              styles.featuresContainer,
              {
                opacity: featuresOpacity,
                transform: [{ translateY: featuresY }],
              },
            ]}
          >
            <FeatureCard
              icon="⚡"
              title="Calculs instantanés"
              description="Intelligence artificielle intégrée"
              colors={['#4facfe', '#00f2fe']}
              index={0}
              pressed={pressedCard === 0}
              onPressIn={() => setPressedCard(0)}
              onPressOut={() => setPressedCard(null)}
            />
            <FeatureCard
              icon="👥"
              title="Jusqu'à 6 joueurs"
              description="Parties épiques entre amis"
              colors={['#43e97b', '#38f9d7']}
              index={1}
              pressed={pressedCard === 1}
              onPressIn={() => setPressedCard(1)}
              onPressOut={() => setPressedCard(null)}
            />
            <FeatureCard
              icon="📊"
              title="Suivi de progression"
              description="Stats détaillées et records"
              colors={['#fa709a', '#fee140']}
              index={2}
              pressed={pressedCard === 2}
              onPressIn={() => setPressedCard(2)}
              onPressOut={() => setPressedCard(null)}
            />
            <FeatureCard
              icon="🎯"
              title="Mode Solo & IA"
              description="Entraînez-vous contre l'IA"
              colors={['#30cfd0', '#330867']}
              index={3}
              pressed={pressedCard === 3}
              onPressIn={() => setPressedCard(3)}
              onPressOut={() => setPressedCard(null)}
            />
          </Animated.View>

          {/* Premium Badge */}
          <Animated.View
            style={[styles.premiumBadgeContainer, { opacity: featuresOpacity }]}
          >
            <LinearGradient
              colors={['rgba(255, 215, 0, 0.2)', 'rgba(255, 140, 0, 0.2)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.premiumBadge}
            >
              <Text style={styles.premiumBadgeText}>
                🏆 Expérience Premium Sans Compromis
              </Text>
            </LinearGradient>
          </Animated.View>
        </ScrollView>

        {/* CTA Buttons with glassmorphism */}
        <Animated.View
          style={[
            styles.ctaContainer,
            {
              opacity: ctaOpacity,
              transform: [{ scale: ctaScale }],
            },
          ]}
        >
          {/* Main CTA - Start Game */}
          <TouchableOpacity
            onPress={handleStartGame}
            activeOpacity={0.9}
            style={styles.mainCtaWrapper}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2', '#f093fb']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.mainCtaButton}
            >
              <View style={styles.ctaGlassOverlay}>
                <Text style={styles.mainCtaIcon}>🎲</Text>
                <Text style={styles.mainCtaText}>Commencer une Partie</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Secondary buttons in a grid */}
          <View style={styles.secondaryButtonsGrid}>
            <TouchableOpacity
              onPress={onShowHistory}
              activeOpacity={0.85}
              style={styles.secondaryButtonWrapper}
            >
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
                style={styles.secondaryButton}
              >
                <Text style={styles.secondaryButtonIcon}>📊</Text>
                <Text style={styles.secondaryButtonText}>Historique</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onShowLearning}
              activeOpacity={0.85}
              style={styles.secondaryButtonWrapper}
            >
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
                style={styles.secondaryButton}
              >
                <Text style={styles.secondaryButtonIcon}>🎓</Text>
                <Text style={styles.secondaryButtonText}>Apprendre</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onShowProgression}
              activeOpacity={0.85}
              style={styles.secondaryButtonWrapper}
            >
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
                style={styles.secondaryButton}
              >
                <Text style={styles.secondaryButtonIcon}>🏆</Text>
                <Text style={styles.secondaryButtonText}>Progression</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  colors: string[];
  index: number;
  pressed: boolean;
  onPressIn: () => void;
  onPressOut: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  colors,
  index,
  pressed,
  onPressIn,
  onPressOut
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Continuous subtle animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [rotateAnim, glowAnim]);

  useEffect(() => {
    if (pressed) {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        friction: 3,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start();
    }
  }, [pressed, scaleAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-2deg', '2deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.6],
  });

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View
        style={[
          styles.featureCard,
          {
            transform: [
              { scale: scaleAnim },
              { rotate },
            ],
          },
        ]}
      >
        {/* Glow effect */}
        <Animated.View
          style={[
            styles.cardGlow,
            {
              opacity: glowOpacity,
              backgroundColor: colors[0],
            }
          ]}
        />

        <LinearGradient
          colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.1)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.featureGradient}
        >
          <View style={styles.featureCardContent}>
            <LinearGradient
              colors={colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.featureIconContainer}
            >
              <Text style={styles.featureIcon}>{icon}</Text>
            </LinearGradient>
            <View style={styles.featureTextContent}>
              <Text style={styles.featureTitle}>{title}</Text>
              <Text style={styles.featureDescription}>{description}</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  gradient: {
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 250,
  },
  logoSection: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 20,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoBackdrop: {
    width: 180,
    height: 180,
    borderRadius: 90,
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 20,
  },
  logoGlassEffect: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...Platform.select({
      ios: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
      },
      android: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
      },
    }),
  },
  titleContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 52,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -2,
    marginBottom: 8,
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
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  statsContainer: {
    marginTop: 24,
    marginBottom: 8,
  },
  glassBanner: {
    borderRadius: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  glassBannerGradient: {
    flexDirection: 'row',
    padding: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    marginHorizontal: 8,
  },
  featuresContainer: {
    marginTop: 24,
    gap: 16,
  },
  featureCard: {
    position: 'relative',
    borderRadius: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  cardGlow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 34,
    opacity: 0.4,
  },
  featureGradient: {
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  featureCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  featureIconContainer: {
    width: 68,
    height: 68,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  featureIcon: {
    fontSize: 32,
  },
  featureTextContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  featureDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.85)',
    letterSpacing: 0.2,
    lineHeight: 18,
  },
  premiumBadgeContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  premiumBadge: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.5)',
    ...Platform.select({
      ios: {
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  premiumBadgeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  ctaContainer: {
    position: 'absolute',
    bottom: 32,
    left: 20,
    right: 20,
  },
  mainCtaWrapper: {
    marginBottom: 16,
  },
  mainCtaButton: {
    height: 72,
    borderRadius: 36,
    overflow: 'hidden',
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
  ctaGlassOverlay: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 36,
  },
  mainCtaIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  mainCtaText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  secondaryButtonsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButtonWrapper: {
    flex: 1,
  },
  secondaryButton: {
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
  secondaryButtonIcon: {
    fontSize: 26,
    marginBottom: 4,
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});

export default WelcomeScreen;
