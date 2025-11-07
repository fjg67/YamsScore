import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Modal, View, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { OpeningPhase } from './phases/OpeningPhase';
import { LuckyThrowPhase } from './phases/LuckyThrowPhase';
import { RoulettePhase } from './phases/RoulettePhase';
import { WinnerRevealPhase } from './phases/WinnerRevealPhase';
import { TransitionPhase } from './phases/TransitionPhase';

interface Player {
  id: string;
  name: string;
  color: string;
}

const { width, height } = Dimensions.get('window');

type Phase = 'opening' | 'lucky-throw' | 'roulette' | 'winner-reveal' | 'transition';

interface WhoStartsModalProps {
  visible: boolean;
  players: Player[];
  onComplete: (winnerId: string) => void;
}

// Floating particles component
const FloatingParticle = ({ delay = 0 }: { delay?: number }) => {
  const translateY = useRef(new Animated.Value(height)).current;
  const translateX = useRef(new Animated.Value(Math.random() * width)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5 + Math.random() * 0.5)).current;

  useEffect(() => {
    const animate = () => {
      translateY.setValue(height);
      translateX.setValue(Math.random() * width);
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

export const WhoStartsModal: React.FC<WhoStartsModalProps> = ({
  visible,
  players,
  onComplete,
}) => {
  const [phase, setPhase] = useState<Phase>('opening');
  const [winner, setWinner] = useState<Player | null>(null);

  const backgroundOpacity = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  const delay = useCallback((ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }, []);

  const simulateRoulette = useCallback((): Promise<Player> => {
    return new Promise((resolve) => {
      // Random selection after 3 seconds
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * players.length);
        resolve(players[randomIndex]);
      }, 3000);
    });
  }, [players]);

  const runSequence = useCallback(async () => {
    // Animate background
    Animated.parallel([
      Animated.timing(backgroundOpacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
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
      ),
    ]).start();

    // Phase 1: Opening (1500ms)
    setPhase('opening');
    await delay(1500);

    // Phase 2: Lucky throw (500ms)
    setPhase('lucky-throw');
    await delay(500);

    // Phase 3: Roulette (3000ms)
    setPhase('roulette');
    const selectedWinner = await simulateRoulette();
    setWinner(selectedWinner);

    // Phase 4: Winner reveal (2500ms)
    setPhase('winner-reveal');
    await delay(2500);

    // Phase 5: Transition countdown 3-2-1 + "Les dés tournent" (5500ms total)
    setPhase('transition');
    await delay(5500);

    // Complete and close
    Animated.timing(backgroundOpacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      if (selectedWinner) {
        onComplete(selectedWinner.id);
      }
    });
  }, [backgroundOpacity, glowAnim, delay, onComplete, simulateRoulette]);

  // Main sequence
  useEffect(() => {
    if (!visible) return;

    runSequence();

    // Cleanup
    return () => {
      setPhase('opening');
      setWinner(null);
    };
  }, [visible, runSequence]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={() => {}}
      statusBarTranslucent
    >
      <View style={styles.container}>
        {/* Animated Background with Gradient */}
        <Animated.View
          style={[
            styles.background,
            {
              opacity: backgroundOpacity,
            },
          ]}
        >
          <LinearGradient
            colors={['#0F0C29', '#302B63', '#24243e', '#0F0C29']}
            style={styles.gradientBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />

          {/* Glow effect */}
          <Animated.View
            style={[
              styles.glowContainer,
              { opacity: glowAnim }
            ]}
          >
            <LinearGradient
              colors={['rgba(102, 126, 234, 0.3)', 'transparent', 'rgba(118, 75, 162, 0.3)']}
              style={styles.glowGradient}
            />
          </Animated.View>

          {/* Floating Particles */}
          <View style={styles.particlesContainer}>
            {[...Array(20)].map((_, i) => (
              <FloatingParticle key={i} delay={i * 300} />
            ))}
          </View>
        </Animated.View>

        {/* Phase Content */}
        <View style={styles.content}>
          {phase === 'opening' && <OpeningPhase players={players} />}
          {phase === 'lucky-throw' && <LuckyThrowPhase />}
          {phase === 'roulette' && <RoulettePhase players={players} />}
          {phase === 'winner-reveal' && winner && (
            <WinnerRevealPhase winner={winner} />
          )}
          {phase === 'transition' && winner && (
            <TransitionPhase winner={winner} />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  glowContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  glowGradient: {
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
  content: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

export default WhoStartsModal;
