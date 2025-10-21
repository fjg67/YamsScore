/**
 * Bouton de Réaction - Support des réactions emoji
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { haptics } from '../../../utils/haptics';

interface Props {
  emoji: string;
  count: number;
  userReacted: boolean;
  onPress: () => void;
  isDarkMode?: boolean;
}

export const ReactionButton: React.FC<Props> = ({
  emoji,
  count,
  userReacted,
  onPress,
  isDarkMode = false,
}) => {
  const scaleValue = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    haptics.light();
    onPress();
  };

  const bgColor = userReacted
    ? isDarkMode
      ? '#4A90E2'
      : '#E3F2FD'
    : isDarkMode
    ? '#2A2A2A'
    : '#F5F5F5';

  const textColor = userReacted
    ? '#4A90E2'
    : isDarkMode
    ? '#FFFFFF'
    : '#666666';

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: bgColor,
          borderColor: userReacted ? '#4A90E2' : 'transparent',
          transform: [{ scale: scaleValue }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.button}
      >
        <Text style={styles.emoji}>{emoji}</Text>
        {count > 0 && (
          <Text style={[styles.count, { color: textColor }]}>{count}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
  },
  emoji: {
    fontSize: 16,
  },
  count: {
    fontSize: 13,
    fontWeight: '600',
  },
});
