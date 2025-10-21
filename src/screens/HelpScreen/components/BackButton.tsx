/**
 * Back Button Premium - Bouton retour magnifique
 */

import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { haptics, HapticType } from '../../../utils/haptics';

interface BackButtonProps {
  onPress: () => void;
  label?: string;
  isDarkMode?: boolean;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  label = 'Accueil',
  isDarkMode = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  // Animation glow subtile en continu
  React.useEffect(() => {
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
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    haptics.trigger(HapticType.MEDIUM);
    onPress();
  };

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.6],
  });

  return (
    <TouchableOpacity
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.button,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Glow effect animé */}
        <Animated.View
          style={[
            styles.glowContainer,
            {
              opacity: glowOpacity,
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(74,144,226,0.3)', 'rgba(94,58,238,0.3)', 'rgba(80,200,120,0.3)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.glow}
          />
        </Animated.View>

        {/* Bouton principal */}
        <LinearGradient
          colors={isDarkMode ? ['#2A2A2A', '#1E1E1E'] : ['#FFFFFF', '#F8F8F8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradient}
        >
          {/* Icon Container avec gradient subtil */}
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={['#4A90E2', '#5E3AEE']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconGradient}
            >
              <Text style={styles.icon}>←</Text>
            </LinearGradient>
          </View>

          {/* Label */}
          <Text style={[styles.label, { color: isDarkMode ? '#FFFFFF' : '#1A1A1A' }]}>
            {label}
          </Text>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  button: {
    position: 'relative',
  },
  glowContainer: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 20,
    overflow: 'hidden',
  },
  glow: {
    flex: 1,
    borderRadius: 20,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    paddingRight: 18,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 2,
    borderColor: 'rgba(74,144,226,0.2)',
    minWidth: 130,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    overflow: 'hidden',
  },
  iconGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
    flex: 1,
  },
});
