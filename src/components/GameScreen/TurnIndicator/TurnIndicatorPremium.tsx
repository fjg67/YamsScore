/**
 * Indicateur de tour premium avec animation de transition
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';
import { useCurrentTurn } from '../../../hooks/useCurrentTurn';
import { premiumTheme } from '../../../theme/premiumTheme';

const TurnIndicatorPremium: React.FC = () => {
  const { currentPlayer, turnNumber, totalTurns, isGameFinished } = useCurrentTurn();

  if (!currentPlayer || isGameFinished) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      style={styles.container}
      key={currentPlayer.id} // Force re-render on player change
    >
      <View style={styles.content}>
        {/* Avatar */}
        <Text style={styles.avatar}>{currentPlayer.emoji || '🎲'}</Text>

        {/* Text */}
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            Tour de{' '}
            <Text style={[styles.playerName, { color: currentPlayer.color }]}>
              {currentPlayer.name}
            </Text>
          </Text>
        </View>

        {/* Turn badge */}
        <View style={styles.turnBadge}>
          <Text style={styles.turnText}>
            Tour {turnNumber}/{totalTurns}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: premiumTheme.borderRadius.xl,
    borderTopRightRadius: premiumTheme.borderRadius.xl,
    ...premiumTheme.colors.shadows.soft,
    marginTop: premiumTheme.spacing.sm,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: premiumTheme.spacing.md,
  },
  avatar: {
    fontSize: 28,
    marginRight: premiumTheme.spacing.sm,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontSize: premiumTheme.typography.fontSize.xl,
    color: premiumTheme.colors.ui.textSecondary,
  },
  playerName: {
    fontWeight: 'bold',
    fontSize: premiumTheme.typography.fontSize.xxl,
  },
  turnBadge: {
    backgroundColor: 'rgba(74,144,226,0.1)',
    borderRadius: premiumTheme.borderRadius.sm,
    paddingHorizontal: premiumTheme.spacing.md,
    paddingVertical: premiumTheme.spacing.xs,
  },
  turnText: {
    fontSize: premiumTheme.typography.fontSize.md,
    color: '#4A90E2',
    fontWeight: '600',
  },
});

export default TurnIndicatorPremium;
