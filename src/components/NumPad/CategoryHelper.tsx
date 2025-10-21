/**
 * Helper contextuel avec règles et exemples pour chaque catégorie
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { ScoreCategory } from '../../types/game.types';
import { useCategoryHelp } from '../../hooks/useSmartNumPad';
import { premiumTheme } from '../../theme/premiumTheme';
import { getCategoryEmoji } from '../../constants/emojis';

interface CategoryHelperProps {
  category: ScoreCategory;
  compact?: boolean;
  tutorialMode?: boolean;
}

const CategoryHelper: React.FC<CategoryHelperProps> = ({
  category,
  compact = false,
  tutorialMode = false,
}) => {
  // En mode tutoriel, l'aide est automatiquement dépliée
  const [expanded, setExpanded] = useState(tutorialMode);
  const help = useCategoryHelp(category);
  const emoji = getCategoryEmoji(category);

  // Mettre à jour expanded si tutorialMode change
  React.useEffect(() => {
    if (tutorialMode) {
      setExpanded(true);
    }
  }, [tutorialMode]);

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <Text style={styles.compactEmoji}>{emoji}</Text>
        <Text style={styles.compactText} numberOfLines={1}>
          {help.description}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Toggle button */}
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <Text style={styles.toggleEmoji}>💡</Text>
        <Text style={styles.toggleText}>
          {expanded ? 'Masquer l\'aide' : 'Voir les règles'}
        </Text>
        <Text style={styles.toggleArrow}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {/* Expanded help */}
      {expanded && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={styles.expandedContainer}
        >
          {/* Title */}
          <View style={styles.header}>
            <Text style={styles.headerEmoji}>{emoji}</Text>
            <Text style={styles.headerTitle}>{help.title}</Text>
          </View>

          {/* Description */}
          <Text style={styles.description}>{help.description}</Text>

          {/* Tips */}
          {help.tips && help.tips.length > 0 && (
            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>💡 Astuces :</Text>
              {help.tips.map((tip, index) => (
                <View key={index} style={styles.tipRow}>
                  <Text style={styles.tipBullet}>•</Text>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Possible scores preview */}
          <View style={styles.scoresPreview}>
            <Text style={styles.scoresTitle}>Scores possibles :</Text>
            <View style={styles.scoresRow}>
              {help.possibleScores.slice(0, 10).map((score, index) => (
                <View key={index} style={styles.scoreChip}>
                  <Text style={styles.scoreChipText}>
                    {score === 0 ? '❌' : score}
                  </Text>
                </View>
              ))}
              {help.possibleScores.length > 10 && (
                <Text style={styles.scoresMore}>...</Text>
              )}
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: premiumTheme.spacing.xs,
  },
  compactEmoji: {
    fontSize: 16,
    marginRight: premiumTheme.spacing.xs,
  },
  compactText: {
    fontSize: premiumTheme.typography.fontSize.sm,
    color: premiumTheme.colors.ui.textSecondary,
    flex: 1,
  },

  container: {
    marginBottom: premiumTheme.spacing.md,
  },

  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: premiumTheme.spacing.sm,
    paddingHorizontal: premiumTheme.spacing.md,
    backgroundColor: 'rgba(74,144,226,0.05)',
    borderRadius: premiumTheme.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(74,144,226,0.2)',
    borderStyle: 'dashed',
  },
  toggleEmoji: {
    fontSize: 16,
    marginRight: premiumTheme.spacing.sm,
  },
  toggleText: {
    fontSize: premiumTheme.typography.fontSize.md,
    color: '#4A90E2',
    fontWeight: '600',
    flex: 1,
  },
  toggleArrow: {
    fontSize: 12,
    color: '#4A90E2',
  },

  expandedContainer: {
    marginTop: premiumTheme.spacing.sm,
    padding: premiumTheme.spacing.md,
    backgroundColor: '#FFFFFF',
    borderRadius: premiumTheme.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(74,144,226,0.2)',
    ...premiumTheme.colors.shadows.soft,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: premiumTheme.spacing.sm,
  },
  headerEmoji: {
    fontSize: 24,
    marginRight: premiumTheme.spacing.sm,
  },
  headerTitle: {
    fontSize: premiumTheme.typography.fontSize.xxl,
    fontWeight: 'bold',
    color: premiumTheme.colors.ui.textPrimary,
  },

  description: {
    fontSize: premiumTheme.typography.fontSize.md,
    color: premiumTheme.colors.ui.textSecondary,
    lineHeight: 20,
    marginBottom: premiumTheme.spacing.md,
  },

  tipsContainer: {
    backgroundColor: 'rgba(80,200,120,0.05)',
    borderRadius: premiumTheme.borderRadius.md,
    padding: premiumTheme.spacing.md,
    marginBottom: premiumTheme.spacing.md,
  },
  tipsTitle: {
    fontSize: premiumTheme.typography.fontSize.md,
    fontWeight: '600',
    color: '#50C878',
    marginBottom: premiumTheme.spacing.sm,
  },
  tipRow: {
    flexDirection: 'row',
    marginBottom: premiumTheme.spacing.xs,
  },
  tipBullet: {
    fontSize: premiumTheme.typography.fontSize.md,
    color: '#50C878',
    marginRight: premiumTheme.spacing.sm,
    width: 12,
  },
  tipText: {
    flex: 1,
    fontSize: premiumTheme.typography.fontSize.sm,
    color: premiumTheme.colors.ui.textPrimary,
    lineHeight: 18,
  },

  scoresPreview: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: premiumTheme.spacing.md,
  },
  scoresTitle: {
    fontSize: premiumTheme.typography.fontSize.sm,
    color: premiumTheme.colors.ui.textSecondary,
    marginBottom: premiumTheme.spacing.sm,
  },
  scoresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: premiumTheme.spacing.xs,
  },
  scoreChip: {
    backgroundColor: 'rgba(74,144,226,0.1)',
    borderRadius: premiumTheme.borderRadius.sm,
    paddingHorizontal: premiumTheme.spacing.sm,
    paddingVertical: premiumTheme.spacing.xs,
  },
  scoreChipText: {
    fontSize: premiumTheme.typography.fontSize.sm,
    color: '#4A90E2',
    fontWeight: '600',
  },
  scoresMore: {
    fontSize: premiumTheme.typography.fontSize.md,
    color: premiumTheme.colors.ui.textSecondary,
    alignSelf: 'center',
  },
});

export default CategoryHelper;
