/**
 * Ligne de score premium avec catégorie et cellules
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppSelector } from '../../../store/hooks';
import { CategoryLabels } from '../../../constants';
import { getCategoryEmoji } from '../../../constants/emojis';
import { premiumTheme } from '../../../theme/premiumTheme';
import { ScoreCategory } from '../../../types';
import { useCurrentTurn } from '../../../hooks/useCurrentTurn';
import PremiumScoreCell from './PremiumScoreCell';

interface PremiumScoreRowProps {
  category: ScoreCategory;
  onCellPress: (playerId: string, category: ScoreCategory) => void;
  selectedCell?: { playerId: string; category: ScoreCategory } | null;
}

const PremiumScoreRow: React.FC<PremiumScoreRowProps> = ({
  category,
  onCellPress,
  selectedCell,
}) => {
  const currentGame = useAppSelector((state) => state.game.currentGame);
  const { currentPlayer } = useCurrentTurn();

  if (!currentGame) {
    return null;
  }

  const categoryLabel = CategoryLabels[category] || category;
  const categoryEmoji = getCategoryEmoji(category);

  return (
    <View style={styles.row}>
      {/* Label de la catégorie */}
      <View style={styles.labelCell}>
        <View style={styles.labelContent}>
          <Text style={styles.emoji}>{categoryEmoji}</Text>
          <View style={styles.labelTextContainer}>
            <Text style={styles.labelText} numberOfLines={1}>
              {categoryLabel}
            </Text>
          </View>
        </View>
      </View>

      {/* Cellules de score pour chaque joueur */}
      <View style={styles.cellsContainer}>
        {currentGame.players.map((player) => {
          const playerScore = currentGame.scores.find(
            (s) => s.playerId === player.id
          );

          const value = playerScore?.[category];
          const isSelected =
            selectedCell?.playerId === player.id &&
            selectedCell?.category === category;
          const isEmpty = value === undefined;
          const isActiveTurn = currentPlayer?.id === player.id && isEmpty;
          // Une cellule est verrouillée si :
          // 1. Elle a déjà une valeur
          // 2. Ce n'est pas le tour du joueur
          const isCurrentPlayer = currentPlayer?.id === player.id;
          const isLocked = value !== undefined || !isCurrentPlayer;

          return (
            <PremiumScoreCell
              key={player.id}
              value={value}
              category={category}
              onPress={() => onCellPress(player.id, category)}
              isLocked={isLocked}
              isSelected={isSelected}
              isEmpty={isEmpty}
              isActiveTurn={isActiveTurn}
              playerColor={player.color}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: premiumTheme.spacing.xs,
    paddingHorizontal: premiumTheme.spacing.md,
  },
  labelCell: {
    width: 155,
    height: premiumTheme.sizes.scoreCell.height,
    backgroundColor: '#FFFFFF',
    borderRadius: premiumTheme.borderRadius.md,
    justifyContent: 'center',
    paddingHorizontal: premiumTheme.spacing.md,
    marginRight: premiumTheme.spacing.xs,
  },
  labelContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 20,
    marginRight: premiumTheme.spacing.sm,
  },
  labelTextContainer: {
    flex: 1,
  },
  labelText: {
    fontSize: premiumTheme.typography.fontSize.lg,
    fontWeight: '600',
    color: premiumTheme.colors.ui.textPrimary,
  },
  cellsContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
  },
});

export default PremiumScoreRow;
