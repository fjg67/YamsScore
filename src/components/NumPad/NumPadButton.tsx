/**
 * Bouton du clavier numérique
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useAppSelector } from '../../store/hooks';
import { getColors } from '../../constants';

interface NumPadButtonProps {
  value: number | string;
  label?: string;
  onPress: (value: number | string) => void;
  variant?: 'default' | 'fixed' | 'cancel' | 'clear';
  disabled?: boolean;
}

const NumPadButton: React.FC<NumPadButtonProps> = ({
  value,
  label,
  onPress,
  variant = 'default',
  disabled = false,
}) => {
  const theme = useAppSelector((state) => state.settings.theme);
  const colors = getColors(theme);

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    };

    if (disabled) {
      return {
        ...baseStyle,
        backgroundColor: colors.disabled + '30',
        borderColor: colors.disabled,
      };
    }

    switch (variant) {
      case 'fixed':
        return {
          ...baseStyle,
          backgroundColor: colors.secondary,
          borderColor: colors.secondary,
        };
      case 'cancel':
        return {
          ...baseStyle,
          backgroundColor: colors.error,
          borderColor: colors.error,
        };
      case 'clear':
        return {
          ...baseStyle,
          backgroundColor: colors.accent,
          borderColor: colors.accent,
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    if (disabled) {
      return { color: colors.disabled };
    }

    if (variant === 'fixed' || variant === 'cancel' || variant === 'clear') {
      return { color: '#FFFFFF' };
    }

    return { color: colors.text };
  };

  const displayText = label || value.toString();

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle()]}
      onPress={() => onPress(value)}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, getTextStyle()]}>
        {displayText}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 70,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 12,
    margin: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
});

export default NumPadButton;
