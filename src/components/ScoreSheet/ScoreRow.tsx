/**
 * Ligne de catégorie avec les cellules de score pour chaque joueur
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppSelector } from '../../store/hooks';
import { getColors, CategoryLabels } from '../../constants';
import { ScoreCategory } from '../../types';
import { useCurrentTurn } from '../../hooks/useCurrentTurn';
import ScoreCell from './ScoreCell';

interface ScoreRowProps {
  category: ScoreCategory;
  onCellPress: (playerId: string, category: ScoreCategory) => void;
  selectedCell?: { playerId: string; category: ScoreCategory } | null;
  isBonus?: boolean;
  isTotal?: boolean;
}

const ScoreRow: React.FC<ScoreRowProps> = ({
  category,
  onCellPress,
  selectedCell,
  isBonus = false,
  isTotal = false,
}) => {
  const theme = useAppSelector((state) => state.settings.theme);
  const currentGame = useAppSelector((state) => state.game.currentGame);
  const { currentPlayer } = useCurrentTurn();
  const colors = getColors(theme);

  if (!currentGame) {
    return null;
  }

  const getCategoryLabel = (): string => {
    if (isBonus) {
      return 'Bonus';
    }
    if (isTotal) {
      return 'TOTAL';
    }
    return CategoryLabels[category] || category;
  };

  return (
    <View style={styles.row}>
      {/* Label de la catégorie */}
      <View
        style={[
          styles.labelCell,
          { backgroundColor: colors.surface, borderColor: colors.border },
          isTotal && { backgroundColor: colors.primary },
        ]}
      >
        <Text
          style={[
            styles.labelText,
            { color: isTotal ? '#FFFFFF' : colors.text },
            isTotal && styles.totalLabelText,
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {getCategoryLabel()}
        </Text>
      </View>

      {/* Cellules de score pour chaque joueur */}
      {currentGame.players.map((player) => {
        const playerScore = currentGame.scores.find(
          (s) => s.playerId === player.id
        );

        let value: number | undefined;

        if (isBonus) {
          value = playerScore?.upperBonus;
        } else if (isTotal) {
          value = playerScore?.grandTotal;
        } else {
          value = playerScore?.[category];
        }

        const isSelected =
          selectedCell?.playerId === player.id &&
          selectedCell?.category === category &&
          !isBonus &&
          !isTotal;

        // Une cellule est verrouillée si :
        // 1. Elle a déjà une valeur
        // 2. Ce n'est pas le tour du joueur
        const isCurrentPlayer = currentPlayer?.id === player.id;
        const isLocked = (value !== undefined || !isCurrentPlayer) && !isBonus && !isTotal;

        return (
          <ScoreCell
            key={player.id}
            value={value}
            onPress={() => onCellPress(player.id, category)}
            isLocked={isLocked}
            isSelected={isSelected}
            isBonus={isBonus}
            isTotal={isTotal}
            isEmpty={value === undefined}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  labelCell: {
    width: 100,
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 6,
    marginRight: 4,
  },
  labelText: {
    fontSize: 14,
    fontWeight: '600',
  },
  totalLabelText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ScoreRow;
