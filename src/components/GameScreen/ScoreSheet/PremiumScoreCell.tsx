/**
 * Cellule de score premium avec états visuels et animations
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { premiumTheme, getScoreColor, getCategoryMaxScore } from '../../../theme/premiumTheme';
import { useHaptic } from '../../../hooks/useHaptic';
import { SoundManager } from '../../../services/SoundManager';
import { ScoreCategory } from '../../../types';

interface PremiumScoreCellProps {
  value?: number;
  category: ScoreCategory;
  onPress: () => void;
  isLocked?: boolean;
  isSelected?: boolean;
  isBonus?: boolean;
  isTotal?: boolean;
  isEmpty?: boolean;
  isActiveTurn?: boolean;
  playerColor?: string;
}

const PremiumScoreCell: React.FC<PremiumScoreCellProps> = ({
  value,
  category,
  onPress,
  isLocked = false,
  isSelected = false,
  isBonus = false,
  isTotal = false,
  isEmpty = false,
  isActiveTurn = false,
  playerColor,
}) => {
  const { light } = useHaptic();

  const getCellStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: premiumTheme.colors.ui.cardBackground,
      borderColor: premiumTheme.colors.ui.cardBorder,
      borderWidth: 1,
    };

    // Total row
    if (isTotal) {
      return {
        ...baseStyle,
        backgroundColor: 'transparent', // Gradient handled in TotalRowPremium
        borderColor: 'transparent',
      };
    }

    // Bonus row
    if (isBonus) {
      return {
        ...baseStyle,
        backgroundColor: value && value > 0 ? '#FFD700' : 'rgba(255,215,0,0.1)',
        borderColor: value && value > 0 ? '#FFA500' : 'rgba(255,215,0,0.3)',
      };
    }

    // Selected state
    if (isSelected) {
      return {
        ...baseStyle,
        backgroundColor: playerColor ? `${playerColor}20` : 'rgba(74,144,226,0.1)',
        borderColor: playerColor || '#4A90E2',
        borderWidth: 2,
      };
    }

    // Active turn (empty cell)
    if (isActiveTurn && isEmpty) {
      return {
        ...baseStyle,
        borderColor: playerColor || '#4A90E2',
        borderWidth: 2,
        borderStyle: 'dashed',
        backgroundColor: playerColor ? `${playerColor}08` : 'rgba(74,144,226,0.05)',
      };
    }

    // Filled cell
    if (!isEmpty && value !== undefined) {
      return {
        ...baseStyle,
        backgroundColor: '#FFFFFF',
        borderColor: 'rgba(0,0,0,0.08)',
      };
    }

    // Empty cell
    return {
      ...baseStyle,
      borderStyle: 'dashed',
      borderColor: 'rgba(74,144,226,0.2)',
    };
  };

  const getTextColor = (): string => {
    if (isTotal || isBonus) {
      return '#FFFFFF';
    }

    if (isEmpty || value === undefined) {
      return premiumTheme.colors.ui.disabled;
    }

    if (value === 0) {
      return premiumTheme.colors.scoreColors.zero;
    }

    // Color based on score quality
    const maxScore = getCategoryMaxScore(category);
    return getScoreColor(value, maxScore);
  };

  const displayValue = (): string => {
    if (value === undefined) {
      return '-';
    }

    if (value === 0 && !isTotal && !isBonus) {
      return '❌';
    }

    if (isBonus && value === 0) {
      return '0';
    }

    return value.toString();
  };

  const handlePress = () => {
    if (!isLocked && !isTotal && !isBonus) {
      light();
      SoundManager.play('tap');
      onPress();
    }
  };

  // Show special badges
  const getSpecialBadge = (): string | null => {
    if (value === 50 && category === 'yams') return '👑';
    if (value === 40 && category === 'largeStraight') return '🚀';
    if (value === 25 && category === 'fullHouse') return '🏠';
    return null;
  };

  const badge = getSpecialBadge();

  return (
    <TouchableOpacity
      style={[styles.cell, getCellStyle()]}
      onPress={handlePress}
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

      {/* Special badge for achievements */}
      {badge && (
        <Text style={styles.badge}>{badge}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: premiumTheme.sizes.scoreCell.width,
    height: premiumTheme.sizes.scoreCell.height,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: premiumTheme.borderRadius.md,
    margin: premiumTheme.spacing.cellGap,
  },
  text: {
    fontSize: premiumTheme.typography.fontSize.xl,
    fontWeight: '600',
    fontFamily: premiumTheme.typography.fontFamily.monospace,
  },
  totalText: {
    fontSize: premiumTheme.typography.fontSize.display,
    fontWeight: 'bold',
  },
  bonusText: {
    fontSize: premiumTheme.typography.fontSize.base,
    fontWeight: 'bold',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    fontSize: 12,
  },
});

export default PremiumScoreCell;
