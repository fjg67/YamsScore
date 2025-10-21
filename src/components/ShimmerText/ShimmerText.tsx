/**
 * Texte avec effet shimmer (brillance qui passe)
 * Style premium
 */

import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated, TextStyle } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

interface ShimmerTextProps {
  children: string;
  style?: TextStyle;
  shimmerColors?: string[];
  duration?: number;
}

export const ShimmerText: React.FC<ShimmerTextProps> = ({
  children,
  style,
  shimmerColors = ['#2C3E50', '#4A90E2', '#50C878', '#4A90E2', '#2C3E50'],
  duration = 3000,
}) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: duration,
          useNativeDriver: false,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: duration,
          useNativeDriver: false,
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [shimmerAnim, duration]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300],
  });

  return (
    <MaskedView
      maskElement={
        <Text style={[styles.text, style]}>{children}</Text>
      }
    >
      <Animated.View
        style={{
          transform: [{ translateX }],
        }}
      >
        <LinearGradient
          colors={shimmerColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <Text style={[styles.text, style, { opacity: 0 }]}>{children}</Text>
        </LinearGradient>
      </Animated.View>
    </MaskedView>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -1.5,
    textAlign: 'center',
  },
  gradient: {
    width: 600,
  },
});
