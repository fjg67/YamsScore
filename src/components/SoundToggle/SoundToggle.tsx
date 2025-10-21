/**
 * Sound Toggle - Bouton pour activer/désactiver les sons
 * Design premium avec animation
 */

import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { sounds } from '../../utils/sounds';
import { haptics, HapticType } from '../../utils/haptics';

interface SoundToggleProps {
  onChange?: (enabled: boolean) => void;
}

export const SoundToggle: React.FC<SoundToggleProps> = ({ onChange }) => {
  const { theme, isDarkMode } = useTheme();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Charger la préférence
    sounds.isSoundsEnabled().then(setSoundEnabled);
  }, []);

  const handleToggle = async () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    await sounds.setSoundsEnabled(newValue);

    // Haptic feedback
    haptics.trigger(HapticType.MEDIUM);

    // Animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onChange?.(newValue);
  };

  return (
    <TouchableOpacity
      onPress={handleToggle}
      activeOpacity={0.7}
    >
      <Animated.View
        style={[
          styles.toggle,
          {
            backgroundColor: soundEnabled
              ? isDarkMode ? 'rgba(80, 200, 120, 0.2)' : 'rgba(80, 200, 120, 0.15)'
              : isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.icon}>
          {soundEnabled ? '🔊' : '🔇'}
        </Text>
        <Text style={[styles.label, { color: theme.text.secondary }]}>
          {soundEnabled ? 'Sons' : 'Muet'}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  icon: {
    fontSize: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
});
