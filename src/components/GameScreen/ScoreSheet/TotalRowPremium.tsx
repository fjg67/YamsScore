/**
 * Ligne de totaux premium avec gradient et animation count-up
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { premiumTheme } from '../../../theme/premiumTheme';
import { useAppSelector } from '../../../store/hooks';
import { useHaptic } from '../../../hooks/useHaptic';

interface TotalRowPremiumProps {
  label: string;
  emoji: string;
  isGrandTotal?: boolean;
}

const TotalRowPremium: React.FC<TotalRowPremiumProps> = ({
  label,
  emoji,
  isGrandTotal = false,
}) => {
  const currentGame = useAppSelector((state) => state.game.currentGame);
  const { medium } = useHaptic();

  const calculateTotals = () => {
    if (!currentGame) return [];

    return currentGame.players.map((player) => {
      const playerScoreData = currentGame.scores.find((s) => s.playerId === player.id);

      if (!playerScoreData) {
        return { playerId: player.id, value: 0, color: player.color };
      }

      let total = 0;

      if (isGrandTotal) {
        // Grand total: tout
        const upperTotal =
          (playerScoreData.ones || 0) +
          (playerScoreData.twos || 0) +
          (playerScoreData.threes || 0) +
          (playerScoreData.fours || 0) +
          (playerScoreData.fives || 0) +
          (playerScoreData.sixes || 0);

        const bonus = upperTotal >= 63 ? 35 : 0;

        const lowerTotal =
          (playerScoreData.threeOfKind || 0) +
          (playerScoreData.fourOfKind || 0) +
          (playerScoreData.fullHouse || 0) +
          (playerScoreData.smallStraight || 0) +
          (playerScoreData.largeStraight || 0) +
          (playerScoreData.yams || 0) +
          (playerScoreData.chance || 0);

        total = upperTotal + bonus + lowerTotal;
      } else {
        // Sous-total section supérieure
        total =
          (playerScoreData.ones || 0) +
          (playerScoreData.twos || 0) +
          (playerScoreData.threes || 0) +
          (playerScoreData.fours || 0) +
          (playerScoreData.fives || 0) +
          (playerScoreData.sixes || 0);
      }

      return { playerId: player.id, value: total, color: player.color };
    });
  };

  const totals = calculateTotals();

  const gradientColors = isGrandTotal
    ? [...premiumTheme.colors.gradients.primary]
    : [...premiumTheme.colors.gradients.upperSection];

  return (
    <LinearGradient
      colors={gradientColors as string[]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[
        styles.container,
        isGrandTotal && styles.grandTotalContainer,
      ]}
    >
      <View style={styles.labelContainer}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>

      <View style={styles.scoresContainer}>
        {totals.map((total) => (
          <AnimatedTotalCell
            key={total.playerId}
            value={total.value}
            isGrandTotal={isGrandTotal}
          />
        ))}
      </View>
    </LinearGradient>
  );
};

// Animated cell with count-up effect (Reanimated animations removed to fix crash)
const AnimatedTotalCell: React.FC<{ value: number; isGrandTotal: boolean }> = ({
  value,
  isGrandTotal,
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // Count-up animation
    const duration = 500;
    const steps = 20;
    const increment = value / steps;
    let current = 0;

    const interval = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(interval);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [value]);

  return (
    <View style={styles.scoreCell}>
      <Text style={[styles.scoreText, isGrandTotal && styles.grandTotalText]}>
        {displayValue}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: premiumTheme.sizes.totalRow.height,
    borderRadius: 0,
    marginHorizontal: 0,
    marginVertical: premiumTheme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: premiumTheme.spacing.md,
    paddingRight: 0,
    borderWidth: 0,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    ...premiumTheme.colors.shadows.medium,
  },
  grandTotalContainer: {
    ...premiumTheme.colors.shadows.heavy,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 155,
    marginRight: premiumTheme.spacing.xs,
    paddingHorizontal: 0,
  },
  emoji: {
    fontSize: 24,
    marginRight: premiumTheme.spacing.sm,
  },
  label: {
    fontSize: premiumTheme.typography.fontSize.xxl,
    fontWeight: 'black',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scoresContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
  },
  scoreCell: {
    width: premiumTheme.sizes.scoreCell.width,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: premiumTheme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    margin: premiumTheme.spacing.cellGap,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  scoreText: {
    fontSize: premiumTheme.typography.fontSize.display,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: premiumTheme.typography.fontFamily.monospace,
  },
  grandTotalText: {
    fontSize: 28,
  },
});

export default TotalRowPremium;
