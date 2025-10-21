/**
 * Grille de score premium complète
 */

import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useAppSelector } from '../../../store/hooks';
import { UpperSectionCategories, LowerSectionCategories } from '../../../constants';
import { premiumTheme } from '../../../theme/premiumTheme';
import { ScoreCategory } from '../../../types';
import PremiumScoreRow from './PremiumScoreRow';
import SectionHeaderPremium from './SectionHeaderPremium';
import TotalRowPremium from './TotalRowPremium';
import BonusRowPremium from './BonusRowPremium';

interface PremiumScoreGridProps {
  onCellPress: (playerId: string, category: ScoreCategory) => void;
  selectedCell?: { playerId: string; category: ScoreCategory } | null;
}

const PremiumScoreGrid: React.FC<PremiumScoreGridProps> = ({
  onCellPress,
  selectedCell,
}) => {
  const currentGame = useAppSelector((state) => state.game.currentGame);

  if (!currentGame) {
    return null;
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {/* Section Supérieure */}
      <SectionHeaderPremium
        title="SECTION SUPÉRIEURE"
        icon="⬆️"
        description="Total des dés"
        gradient={[...premiumTheme.colors.gradients.upperSection] as [string, string]}
      />

      {UpperSectionCategories.map((category) => (
        <PremiumScoreRow
          key={category}
          category={category}
          onCellPress={onCellPress}
          selectedCell={selectedCell}
        />
      ))}

      {/* Sous-total section supérieure */}
      <View style={styles.spacing} />
      <TotalRowPremium label="Sous-Total" emoji="📊" isGrandTotal={false} />

      {/* Bonus */}
      <BonusRowPremium />

      {/* Divider */}
      <View style={styles.divider} />

      {/* Section Inférieure */}
      <SectionHeaderPremium
        title="SECTION INFÉRIEURE"
        icon="⬇️"
        description="Combinaisons"
        gradient={[...premiumTheme.colors.gradients.lowerSection] as [string, string]}
      />

      {LowerSectionCategories.map((category) => (
        <PremiumScoreRow
          key={category}
          category={category}
          onCellPress={onCellPress}
          selectedCell={selectedCell}
        />
      ))}

      {/* Grand Total */}
      <View style={styles.spacing} />
      <View style={styles.grandTotalDivider} />
      <TotalRowPremium label="TOTAL" emoji="🏆" isGrandTotal={true} />

      {/* Bottom padding */}
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: premiumTheme.colors.ui.background,
  },
  content: {
    paddingVertical: premiumTheme.spacing.md,
  },
  spacing: {
    height: premiumTheme.spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.08)',
    marginVertical: premiumTheme.spacing.lg,
    marginHorizontal: premiumTheme.spacing.md,
  },
  grandTotalDivider: {
    height: 2,
    backgroundColor: '#4A90E2',
    marginVertical: premiumTheme.spacing.md,
    marginHorizontal: premiumTheme.spacing.md,
  },
  bottomPadding: {
    height: premiumTheme.spacing.xxl,
  },
});

export default PremiumScoreGrid;
