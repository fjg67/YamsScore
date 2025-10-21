/**
 * Hero Section - En-tête animé de l'écran Rules
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withDelay,
  FadeIn,
  SlideInDown,
} from 'react-native-reanimated';
import { RulesColors, RulesTypography, RulesSpacing } from '../styles/rulesTheme';

const { width } = Dimensions.get('window');

export const HeroSection: React.FC = () => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 20000 }),
      -1,
      false
    );
  }, []);

  const animatedBackground = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={RulesColors.hero.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Title */}
        <Animated.View
          entering={SlideInDown.delay(200).duration(600)}
          style={styles.titleContainer}
        >
          <Text style={styles.title}>Règles du Yams 🎲</Text>
          <Text style={styles.subtitle}>Maîtrise le jeu en 5 minutes</Text>
        </Animated.View>

        {/* Stats Pills */}
        <Animated.View
          entering={FadeIn.delay(400).duration(600)}
          style={styles.statsContainer}
        >
          <StatPill icon="⏱️" value="5 min" label="Lecture" />
          <StatPill icon="🎯" value="13" label="Catégories" />
          <StatPill icon="🎲" value="3" label="Lancers" />
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

interface StatPillProps {
  icon: string;
  value: string;
  label: string;
}

const StatPill: React.FC<StatPillProps> = ({ icon, value, label }) => {
  return (
    <View style={styles.statPill}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 200,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: RulesSpacing.lg,
    paddingBottom: RulesSpacing.lg,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    justifyContent: 'space-between',
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontFamily: RulesTypography.fonts.display,
    fontSize: 28,
    fontWeight: RulesTypography.weights.black,
    color: RulesColors.text.white,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 10,
    marginBottom: RulesSpacing.xs,
  },
  subtitle: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.body,
    fontWeight: RulesTypography.weights.semibold,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: RulesSpacing.md,
  },
  statPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingVertical: RulesSpacing.xs,
    paddingHorizontal: RulesSpacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: RulesSpacing.xs,
  },
  statIcon: {
    fontSize: 14,
  },
  statValue: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.bodySmall,
    fontWeight: RulesTypography.weights.semibold,
    color: RulesColors.text.white,
  },
  statLabel: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.caption,
    fontWeight: RulesTypography.weights.regular,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});
