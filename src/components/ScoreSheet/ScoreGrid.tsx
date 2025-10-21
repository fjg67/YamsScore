/**
 * Grille complète de score avec toutes les catégories
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAppSelector } from '../../store/hooks';
import { getColors, UpperSectionCategories, LowerSectionCategories } from '../../constants';
import { ScoreCategory } from '../../types';
import ScoreRow from './ScoreRow';

interface ScoreGridProps {
  onCellPress: (playerId: string, category: ScoreCategory) => void;
  selectedCell?: { playerId: string; category: ScoreCategory } | null;
}

const ScoreGrid: React.FC<ScoreGridProps> = ({ onCellPress, selectedCell }) => {
  const theme = useAppSelector((state) => state.settings.theme);
  const currentGame = useAppSelector((state) => state.game.currentGame);
  const colors = getColors(theme);

  if (!currentGame) {
    return (
      <View style={styles.container}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          Aucune partie en cours
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* En-tête avec les noms des joueurs */}
      <View style={styles.header}>
        <View style={[styles.headerLabelCell, { backgroundColor: colors.surface }]} />
        {currentGame.players.map((player) => (
          <View
            key={player.id}
            style={[
              styles.headerPlayerCell,
              { backgroundColor: player.color },
            ]}
          >
            <Text
              style={styles.headerPlayerText}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {player.name}
            </Text>
          </View>
        ))}
      </View>

      {/* Section Supérieure */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Section Supérieure
        </Text>

        {UpperSectionCategories.map((category) => (
          <ScoreRow
            key={category}
            category={category}
            onCellPress={onCellPress}
            selectedCell={selectedCell}
          />
        ))}

        {/* Ligne Sous-total */}
        <View style={styles.divider} />
        <ScoreRow
          category={'ones' as ScoreCategory} // Dummy, sera ignoré car isTotal
          onCellPress={() => {}}
          selectedCell={null}
          isTotal
        />

        {/* Ligne Bonus */}
        <ScoreRow
          category={'ones' as ScoreCategory} // Dummy
          onCellPress={() => {}}
          selectedCell={null}
          isBonus
        />
      </View>

      {/* Section Inférieure */}
      <View style={[styles.section, styles.sectionSpacing]}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Section Inférieure
        </Text>

        {LowerSectionCategories.map((category) => (
          <ScoreRow
            key={category}
            category={category}
            onCellPress={onCellPress}
            selectedCell={selectedCell}
          />
        ))}
      </View>

      {/* Total Général */}
      <View style={[styles.divider, { height: 2, backgroundColor: colors.primary }]} />
      <View style={styles.totalSection}>
        <ScoreRow
          category={'ones' as ScoreCategory} // Dummy
          onCellPress={() => {}}
          selectedCell={null}
          isTotal
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
  },
  headerLabelCell: {
    width: 100,
    height: 44,
    marginRight: 4,
  },
  headerPlayerCell: {
    width: 60,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: 2,
  },
  headerPlayerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  section: {
    marginBottom: 8,
  },
  sectionSpacing: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
  totalSection: {
    marginTop: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});

export default ScoreGrid;
