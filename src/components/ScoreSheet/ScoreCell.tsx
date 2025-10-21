/**
 * Cellule de score individuelle - cliquable pour saisir un score
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useAppSelector } from '../../store/hooks';
import { getColors } from '../../constants';

interface ScoreCellProps {
  value?: number;
  onPress: () => void;
  isLocked?: boolean;
  isSelected?: boolean;
  isBonus?: boolean;
  isTotal?: boolean;
  isEmpty?: boolean;
}

const ScoreCell: React.FC<ScoreCellProps> = ({
  value,
  onPress,
  isLocked = false,
  isSelected = false,
  isBonus = false,
  isTotal = false,
  isEmpty = false,
}) => {
  const theme = useAppSelector((state) => state.settings.theme);
  const colors = getColors(theme);

  const getCellStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    };

    if (isTotal) {
      return {
        ...baseStyle,
        backgroundColor: colors.primary,
        borderColor: colors.primary,
      };
    }

    if (isBonus) {
      return {
        ...baseStyle,
        backgroundColor: '#FFD700',
        borderColor: '#FFA500',
      };
    }

    if (isSelected) {
      return {
        ...baseStyle,
        backgroundColor: colors.primary + '20',
        borderColor: colors.primary,
        borderWidth: 2,
      };
    }

    if (isLocked) {
      return {
        ...baseStyle,
        backgroundColor: colors.disabled + '30',
      };
    }

    return baseStyle;
  };

  const getTextColor = (): string => {
    if (isTotal || isBonus) {
      return '#FFFFFF';
    }
    if (isEmpty || value === undefined) {
      return colors.textSecondary;
    }
    if (value === 0) {
      return colors.error;
    }
    return colors.text;
  };

  const displayValue = (): string => {
    if (value === undefined) {
      return '-';
    }
    if (value === 0 && !isTotal && !isBonus) {
      return '✕';
    }
    return value.toString();
  };

  return (
    <TouchableOpacity
      style={[styles.cell, getCellStyle()]}
      onPress={onPress}
      disabled={isLocked || isTotal || isBonus}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.text,
          { color: getTextColor() },
          isTotal && styles.totalText,
          isBonus && styles.bonusText,
        ]}
      >
        {displayValue()}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: 60,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 6,
    margin: 2,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bonusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ScoreCell;
