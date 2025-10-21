/**
 * Theme Transition - Transition fluide entre thèmes
 * Animation douce du mode clair au mode sombre
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface ThemeTransitionProps {
  isDarkMode: boolean;
  children: React.ReactNode;
}

export const ThemeTransition: React.FC<ThemeTransitionProps> = ({
  isDarkMode,
  children,
}) => {
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animation de transition
    Animated.sequence([
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isDarkMode, overlayOpacity]);

  return (
    <View style={styles.container}>
      {children}
      <Animated.View
        style={[
          styles.overlay,
          {
            backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
            opacity: overlayOpacity,
          },
        ]}
        pointerEvents="none"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
});
