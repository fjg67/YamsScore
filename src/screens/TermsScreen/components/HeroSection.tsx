import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface HeroSectionProps {
  version?: string;
  lastUpdate?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  version = '2.0',
  lastUpdate = '20 octobre 2025',
}) => {
  const floatY = useSharedValue(0);

  React.useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-8, {duration: 2000, easing: Easing.inOut(Easing.ease)}),
        withTiming(0, {duration: 2000, easing: Easing.inOut(Easing.ease)}),
      ),
      -1,
      false,
    );
  }, []);

  const floatingStyle = useAnimatedStyle(() => ({
    transform: [{translateY: floatY.value}],
  }));

  return (
    <LinearGradient
      colors={['#4A90E2', '#5E3AEE', '#50C878']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={[styles.iconContainer, floatingStyle]}>
          <View style={styles.iconBackground}>
            <Text style={styles.icon}>🤝</Text>
          </View>
        </Animated.View>

        <Text style={styles.title}>Des Règles Justes Pour Tous</Text>
        <Text style={styles.tagline}>
          Conditions simples, claires et équitables
        </Text>

        <View style={styles.metaContainer}>
          <Text style={styles.metaText}>
            Version {version} • Mis à jour le {lastUpdate}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 220,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 16,
  },
  iconBackground: {
    width: 120,
    height: 120,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  icon: {
    fontSize: 64,
  },
  title: {
    fontFamily: 'SF Pro Display',
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 8,
  },
  tagline: {
    fontFamily: 'SF Pro Text',
    fontSize: 17,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  metaContainer: {
    marginTop: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  metaText: {
    fontFamily: 'SF Pro Text',
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
  },
});
