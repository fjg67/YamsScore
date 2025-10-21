/**
 * Quick Action Card avec effet Glassmorphism
 * Design premium avec animations hover
 */

import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';

interface QuickActionCardProps {
  icon: string;
  label: string;
  gradientColors: string[];
  onPress: () => void;
  testID?: string;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  icon,
  label,
  gradientColors,
  onPress,
  testID,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Animation de lévitation subtile
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -3,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
      friction: 3,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
    }).start();
  };

  return (
    <Animated.View
      style={{
        transform: [
          { translateY: floatAnim },
          { scale: scaleAnim },
        ],
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        testID={testID}
        activeOpacity={1}
        accessible={true}
        accessibilityLabel={label}
        accessibilityRole="button"
      >
        <View style={styles.card}>
          {/* Glassmorphism background */}
          <View style={styles.glassBackground} />

          {/* Icon container avec gradient */}
          <View style={styles.iconContainer}>
            <View
              style={[
                styles.iconGradient,
                {
                  backgroundColor: gradientColors[0],
                },
              ]}
            >
              <Text style={styles.icon}>{icon}</Text>
            </View>
          </View>

          {/* Label */}
          <Text style={styles.label}>{label}</Text>

          {/* Shine effect */}
          <View style={styles.shine} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 85,
    height: 85,
    borderRadius: 24,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  iconContainer: {
    marginBottom: 4,
  },
  iconGradient: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  icon: {
    fontSize: 24,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
});
