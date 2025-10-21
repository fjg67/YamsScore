/**
 * Bouton Retour Premium
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { haptics } from '../../../utils/haptics';

interface Props {
  onPress: () => void;
  isDarkMode?: boolean;
}

export const BackButton: React.FC<Props> = ({ onPress, isDarkMode = false }) => {
  const handlePress = () => {
    haptics.light();
    onPress();
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)' },
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, { color: isDarkMode ? '#FFFFFF' : '#1A1A1A' }]}>
        ← Retour
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
