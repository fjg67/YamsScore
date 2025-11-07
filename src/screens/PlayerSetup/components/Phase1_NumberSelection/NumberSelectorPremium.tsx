import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  useColorScheme,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import PlayerCountCardPremium from './PlayerCountCardPremium';
import { MIN_PLAYERS, MAX_PLAYERS } from '../../constants';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface NumberSelectorPremiumProps {
  selectedCount: number;
  onSelectCount: (count: number) => void;
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

const NumberSelectorPremium: React.FC<NumberSelectorPremiumProps> = ({
  selectedCount,
  onSelectCount,
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const diceAnim = useRef(new Animated.Value(0)).current;
  const diceScale = useRef(new Animated.Value(1)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const titleScale = useRef(new Animated.Value(0.8)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  const cardsAnim = useRef(
    Array.from({ length: MAX_PLAYERS }, () => new Animated.Value(0))
  ).current;

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

    // Dice rotation animation
    Animated.loop(
      Animated.timing(diceAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    ).start();

    // Dice breathing effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(diceScale, {
          toValue: 1.15,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(diceScale, {
          toValue: 1,
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

    // Cards stagger entrance
    setTimeout(() => {
      Animated.stagger(
        80,
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

  const diceRotate = diceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const titleTranslate = titleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 0],
  });

  const renderPlayerCountCards = () => {
    const cards = [];
    for (let i = MIN_PLAYERS; i <= MAX_PLAYERS; i++) {
      const cardScale = cardsAnim[i - 1].interpolate({
        inputRange: [0, 1],
        outputRange: [0.8, 1],
      });

      const cardTranslate = cardsAnim[i - 1].interpolate({
        inputRange: [0, 1],
        outputRange: [50, 0],
      });

      cards.push(
        <Animated.View
          key={i}
          style={{
            opacity: cardsAnim[i - 1],
            transform: [{ scale: cardScale }, { translateY: cardTranslate }],
          }}
        >
          <PlayerCountCardPremium
            count={i}
            selected={selectedCount === i}
            onSelect={() => onSelectCount(i)}
          />
        </Animated.View>
      );
    }
    return cards;
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
        {[...Array(12)].map((_, i) => (
          <FloatingParticle key={i} delay={i * 500} />
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

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header with animated dice */}
          <View style={styles.header}>
            <Animated.View
              style={{
                transform: [
                  { rotate: diceRotate },
                  { scale: diceScale },
                ],
              }}
            >
              <View style={styles.diceContainer}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.15)']}
                  style={styles.diceBackdrop}
                >
                  <Text style={styles.emoji}>🎲</Text>
                </LinearGradient>
              </View>
            </Animated.View>

            <Animated.View
              style={{
                opacity: titleAnim,
                transform: [
                  { translateY: titleTranslate },
                  { scale: titleScale },
                ],
              }}
            >
              <View style={styles.titleContainer}>
                <Text style={[styles.title, styles.titleGlow]}>Nouvelle Partie</Text>
                <Text style={styles.title}>Nouvelle Partie</Text>
              </View>
              <Animated.Text
                style={[
                  styles.subtitle,
                  { opacity: subtitleAnim }
                ]}
              >
                ✨ Combien de joueurs à la table ? ✨
              </Animated.Text>
            </Animated.View>
          </View>

          {/* Cards Grid */}
          <View style={styles.grid}>
            <View style={styles.row}>
              {renderPlayerCountCards().slice(0, 3)}
            </View>
            <View style={styles.row}>
              {renderPlayerCountCards().slice(3, 6)}
            </View>
          </View>

          {/* Info hint with glassmorphism */}
          {selectedCount > 0 && (
            <Animated.View
              style={[
                styles.hintContainer,
                {
                  opacity: titleAnim,
                  transform: [
                    {
                      scale: titleAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.9, 1],
                      })
                    }
                  ]
                },
              ]}
            >
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.1)']}
                style={styles.hint}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.hintIcon}>💡</Text>
                <Text style={styles.hintText}>
                  {selectedCount === 1
                    ? 'Tu vas jouer contre une IA intelligente !'
                    : `Parfait pour une partie à ${selectedCount} joueurs !`}
                </Text>
              </LinearGradient>
            </Animated.View>
          )}

          {/* Bottom spacing */}
          <View style={{ height: 60 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 32,
  },
  diceContainer: {
    marginBottom: 28,
  },
  diceBackdrop: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    ...Platform.select({
      ios: {
        shadowColor: '#ffffff',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  emoji: {
    fontSize: 64,
  },
  titleContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 44,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 12,
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
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    lineHeight: 26,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  grid: {
    gap: 18,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 14,
    marginBottom: 18,
  },
  hintContainer: {
    marginTop: 32,
  },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 2,
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
  hintIcon: {
    fontSize: 28,
  },
  hintText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});

export default NumberSelectorPremium;
