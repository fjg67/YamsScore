import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { useEffect } from 'react';

const { width, height } = Dimensions.get('window');

interface EmptyStateProps {
  onStartGame: () => void;
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export const EmptyState: React.FC<EmptyStateProps> = ({ onStartGame }) => {
  // Animation pour le trophée
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );

    rotate.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 1000 }),
        withTiming(5, { duration: 1000 }),
        withTiming(0, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedTrophyStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AnimatedLinearGradient
        colors={['#4A90E2', '#5E3AEE', '#50C878']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Trophée animé */}
          <Animated.Text
            entering={FadeInDown.delay(200).springify()}
            style={[styles.trophy, animatedTrophyStyle]}
          >
            🏆
          </Animated.Text>

          {/* Titre */}
          <Animated.Text
            entering={FadeInUp.delay(400).springify()}
            style={styles.title}
          >
            Ton parcours commence ici 🏆
          </Animated.Text>

          {/* Message */}
          <Animated.Text
            entering={FadeInUp.delay(600).springify()}
            style={styles.message}
          >
            Chaque partie, chaque victoire, chaque record sera célébré ici !
          </Animated.Text>

          {/* Features */}
          <Animated.View
            entering={FadeInUp.delay(800).springify()}
            style={styles.features}
          >
            <FeatureItem
              emoji="📊"
              title="Statistiques détaillées"
              description="Vois ta progression"
            />
            <FeatureItem
              emoji="🏅"
              title="Badges & Achievements"
              description="Débloque des récompenses"
            />
            <FeatureItem
              emoji="🔥"
              title="Streaks & Records"
              description="Bats tes records"
            />
          </Animated.View>

          {/* CTA Button */}
          <Animated.View entering={FadeInUp.delay(1000).springify()}>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={onStartGame}
              activeOpacity={0.8}
            >
              <View style={styles.ctaButtonInner}>
                <Text style={styles.ctaText}>🎲 Jouer ma première partie</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </AnimatedLinearGradient>
    </View>
  );
};

interface FeatureItemProps {
  emoji: string;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ emoji, title, description }) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureEmoji}>{emoji}</Text>
    <View style={styles.featureContent}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
    height: height,
  },
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  trophy: {
    fontSize: 120,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'System',
  },
  message: {
    fontSize: 17,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 25,
    marginBottom: 40,
    maxWidth: 320,
    fontFamily: 'System',
  },
  features: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    fontFamily: 'System',
  },
  featureDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'System',
  },
  ctaButton: {
    width: width - 48,
    maxWidth: 400,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  ctaButtonInner: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4A90E2',
    fontFamily: 'System',
  },
});
