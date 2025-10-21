/**
 * StartGameButton - Bouton Ultra Premium
 * Bouton spectaculaire avec animations, gradient animé, particules et effets de brillance
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated as RNAnimated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const { width } = Dimensions.get('window');

interface StartGameButtonProps {
  onPress: () => void;
  disabled?: boolean;
  playerCount: number;
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const StartGameButton: React.FC<StartGameButtonProps> = ({
  onPress,
  disabled = false,
  playerCount,
}) => {
  // Animations
  const pulseScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.5);
  const shimmerTranslateX = useSharedValue(-width);
  const particleOpacity = useSharedValue(0);
  const rocketRotation = useSharedValue(0);

  // Animation de pulsation continue
  useEffect(() => {
    if (!disabled) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );

      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.5, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );

      // Effet shimmer qui traverse le bouton
      shimmerTranslateX.value = withRepeat(
        withSequence(
          withTiming(width, { duration: 2500, easing: Easing.linear }),
          withTiming(-width, { duration: 0 })
        ),
        -1,
        false
      );

      // Particules qui apparaissent et disparaissent
      particleOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 800 }),
          withTiming(0, { duration: 800 })
        ),
        -1,
        false
      );
    }
  }, [disabled]);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: disabled ? 1 : pulseScale.value }],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: disabled ? 0 : glowOpacity.value,
  }));

  const shimmerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerTranslateX.value }],
  }));

  const particleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: disabled ? 0 : particleOpacity.value,
  }));

  const handlePress = () => {
    if (!disabled) {
      ReactNativeHapticFeedback.trigger('notificationSuccess');

      // Animation de press
      pulseScale.value = withSequence(
        withSpring(0.95, { damping: 15, stiffness: 400 }),
        withSpring(1.05, { damping: 15, stiffness: 400 }),
        withSpring(1, { damping: 15, stiffness: 400 })
      );

      // Animation fusée
      rocketRotation.value = withSequence(
        withSpring(-15, { damping: 10 }),
        withSpring(15, { damping: 10 }),
        withSpring(0, { damping: 10 })
      );

      onPress();
    }
  };

  const rocketAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rocketRotation.value}deg` }],
  }));

  return (
    <View style={styles.container}>
      {/* Lueur externe pulsante */}
      <Animated.View style={[styles.glowContainer, glowAnimatedStyle]}>
        <LinearGradient
          colors={
            disabled
              ? ['rgba(204, 204, 204, 0)', 'rgba(204, 204, 204, 0.1)', 'rgba(204, 204, 204, 0)']
              : ['rgba(80, 200, 120, 0)', 'rgba(80, 200, 120, 0.3)', 'rgba(80, 200, 120, 0)']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.glow}
        />
      </Animated.View>

      {/* Particules scintillantes */}
      {!disabled && (
        <>
          <Animated.View style={[styles.particle, styles.particle1, particleAnimatedStyle]} />
          <Animated.View style={[styles.particle, styles.particle2, particleAnimatedStyle]} />
          <Animated.View style={[styles.particle, styles.particle3, particleAnimatedStyle]} />
          <Animated.View style={[styles.particle, styles.particle4, particleAnimatedStyle]} />
          <Animated.View style={[styles.particle, styles.particle5, particleAnimatedStyle]} />
          <Animated.View style={[styles.particle, styles.particle6, particleAnimatedStyle]} />
        </>
      )}

      {/* Bouton principal */}
      <AnimatedTouchable
        style={[
          styles.button,
          buttonAnimatedStyle,
          disabled && styles.buttonDisabled,
        ]}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={
            disabled
              ? ['#CCCCCC', '#AAAAAA']
              : ['#50C878', '#3FA065', '#2E8B57']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {/* Effet shimmer qui traverse */}
          {!disabled && (
            <Animated.View style={[styles.shimmer, shimmerAnimatedStyle]}>
              <LinearGradient
                colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.3)', 'rgba(255,255,255,0)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.shimmerGradient}
              />
            </Animated.View>
          )}

          {/* Contenu du bouton */}
          <View style={styles.content}>
            <Animated.Text style={[styles.icon, rocketAnimatedStyle]}>🚀</Animated.Text>
            <View style={styles.textContainer}>
              <Text style={styles.mainText}>Commencer la partie</Text>
              {!disabled && playerCount >= 4 && (
                <Text style={styles.subText}>Bonne chance ! 🍀</Text>
              )}
            </View>
          </View>

          {/* Bordure brillante interne */}
          {!disabled && (
            <View style={styles.innerBorder} />
          )}
        </LinearGradient>
      </AnimatedTouchable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glowContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    width: '105%',
    height: '110%',
    borderRadius: 28,
  },
  button: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#50C878',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 15,
  },
  buttonDisabled: {
    shadowColor: '#CCCCCC',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  gradient: {
    position: 'relative',
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  shimmerGradient: {
    width: 100,
    height: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    gap: 12,
  },
  icon: {
    fontSize: 32,
  },
  textContainer: {
    alignItems: 'center',
  },
  mainText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 4,
    opacity: 0.95,
    fontWeight: '600',
  },
  innerBorder: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: 2,
    bottom: 2,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  // Particules scintillantes
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  particle1: {
    top: 10,
    left: '15%',
  },
  particle2: {
    top: 15,
    right: '20%',
  },
  particle3: {
    bottom: 10,
    left: '25%',
  },
  particle4: {
    bottom: 15,
    right: '15%',
  },
  particle5: {
    top: '50%',
    left: 10,
  },
  particle6: {
    top: '50%',
    right: 10,
  },
});

export default StartGameButton;
