/**
 * Ligne bonus premium avec progress indicator
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { premiumTheme } from '../../../theme/premiumTheme';
import { useAppSelector } from '../../../store/hooks';

const BONUS_THRESHOLD = 63;
const BONUS_VALUE = 35;

const BonusRowPremium: React.FC = () => {
  const currentGame = useAppSelector((state) => state.game.currentGame);

  const calculateBonuses = () => {
    if (!currentGame) return [];

    return currentGame.players.map((player) => {
      const playerScoreData = currentGame.scores.find((s) => s.playerId === player.id);

      const upperTotal = playerScoreData
        ? (playerScoreData.ones || 0) +
          (playerScoreData.twos || 0) +
          (playerScoreData.threes || 0) +
          (playerScoreData.fours || 0) +
          (playerScoreData.fives || 0) +
          (playerScoreData.sixes || 0)
        : 0;

      const achieved = upperTotal >= BONUS_THRESHOLD;

      return {
        playerId: player.id,
        currentTotal: upperTotal,
        threshold: BONUS_THRESHOLD,
        achieved,
        value: achieved ? BONUS_VALUE : 0,
      };
    });
  };

  const bonuses = calculateBonuses();

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.emoji}>⭐</Text>
        <View>
          <Text style={styles.label}>Bonus</Text>
          <Text style={styles.sublabel}>{BONUS_THRESHOLD} pts requis</Text>
        </View>
      </View>

      <View style={styles.cellsContainer}>
        {bonuses.map((bonus) => (
          <BonusCell key={bonus.playerId} data={bonus} />
        ))}
      </View>
    </View>
  );
};

const BonusCell: React.FC<{ data: any }> = ({ data }) => {
  const progress = Math.min(data.currentTotal / data.threshold, 1);

  const gradientColors = data.achieved
    ? ['#FFD700', '#FFA500']
    : ['rgba(255,215,0,0.1)', 'rgba(255,215,0,0.05)'];

  return (
    <View style={styles.bonusCellContainer}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.bonusCell,
          {
            borderColor: data.achieved ? '#FFA500' : 'rgba(255,215,0,0.3)',
            borderWidth: data.achieved ? 2 : 1,
          },
        ]}
      >
        <Text
          style={[
            styles.bonusValue,
            { color: data.achieved ? '#FFFFFF' : premiumTheme.colors.ui.textSecondary },
          ]}
        >
          {data.achieved ? `+${BONUS_VALUE}` : '0'}
        </Text>

        {data.achieved && (
          <Text style={styles.achievedIcon}>⭐</Text>
        )}
      </LinearGradient>

      {/* Progress bar */}
      {!data.achieved && (
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${progress * 100}%` },
            ]}
          />
          <Text style={styles.progressText}>
            {data.currentTotal}/{data.threshold}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: premiumTheme.sizes.bonusRow.height,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: premiumTheme.spacing.md,
    marginVertical: premiumTheme.spacing.xs,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 155,
    marginRight: premiumTheme.spacing.xs,
  },
  emoji: {
    fontSize: 20,
    marginRight: premiumTheme.spacing.sm,
  },
  label: {
    fontSize: premiumTheme.typography.fontSize.lg,
    fontWeight: '600',
    color: premiumTheme.colors.ui.textPrimary,
  },
  sublabel: {
    fontSize: premiumTheme.typography.fontSize.xs,
    color: premiumTheme.colors.ui.textSecondary,
  },
  cellsContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
  },
  bonusCellContainer: {
    width: premiumTheme.sizes.scoreCell.width,
    margin: premiumTheme.spacing.cellGap,
  },
  bonusCell: {
    height: 48,
    borderRadius: premiumTheme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bonusValue: {
    fontSize: premiumTheme.typography.fontSize.lg,
    fontWeight: 'bold',
  },
  achievedIcon: {
    position: 'absolute',
    top: 2,
    right: 2,
    fontSize: 12,
  },
  progressContainer: {
    marginTop: premiumTheme.spacing.xs,
    height: 4,
    backgroundColor: 'rgba(255,215,0,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 2,
  },
  progressText: {
    position: 'absolute',
    top: -16,
    alignSelf: 'center',
    fontSize: premiumTheme.typography.fontSize.xs,
    color: premiumTheme.colors.ui.textTertiary,
  },
});

export default BonusRowPremium;
