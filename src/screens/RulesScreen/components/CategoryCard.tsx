/**
 * Category Card - Carte premium pour afficher une catégorie avec exemple
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import Animated, { FadeIn, Layout } from 'react-native-reanimated';
import { DiceRow } from './AnimatedDice';
import {
  RulesColors,
  RulesTypography,
  RulesSpacing,
  RulesBorderRadius,
  RulesShadows,
  getDifficultyColor,
  getSectionColor,
  DiceSizes,
} from '../styles/rulesTheme';
import { CategoryRule } from '../data/rulesContent';

interface CategoryCardProps {
  category: CategoryRule;
  index: number;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, index }) => {
  const [expanded, setExpanded] = useState(false);
  const [showExample, setShowExample] = useState(false);

  const sectionColor = getSectionColor(category.section);
  const difficultyColor = getDifficultyColor(category.difficulty);

  const highlightedIndices = category.example.highlight
    ? category.example.dice
        .map((val, idx) => (category.example.highlight?.includes(val) ? idx : -1))
        .filter(idx => idx !== -1)
    : [];

  return (
    <Animated.View
      entering={FadeIn.delay(index * 100).duration(400)}
      layout={Layout.springify()}
      style={styles.container}
    >
      <Pressable
        onPress={() => setExpanded(!expanded)}
        style={({ pressed }) => [
          styles.card,
          { opacity: pressed ? 0.95 : 1 },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.emoji}>{category.emoji}</Text>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{category.name}</Text>
              <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor }]}>
                <Text style={styles.difficultyText}>{category.difficulty}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.expandIcon}>{expanded ? '▼' : '▶'}</Text>
        </View>

        {/* Rule Description */}
        <Text style={styles.rule}>{category.rule}</Text>

        {/* Scoring */}
        <View style={[styles.scoringBadge, { backgroundColor: `${sectionColor}15` }]}>
          <Text style={styles.scoringIcon}>💯</Text>
          <Text style={[styles.scoringText, { color: sectionColor }]}>
            {category.scoring.method === 'fixed'
              ? `${category.scoring.value} points fixes`
              : category.scoring.formula}
          </Text>
        </View>

        {/* Expanded Content */}
        {expanded && (
          <Animated.View
            entering={FadeIn.duration(300)}
            style={styles.expandedContent}
          >
            {/* Example */}
            <View style={styles.exampleSection}>
              <Text style={styles.sectionTitle}>Exemple</Text>
              <DiceRow
                dice={category.example.dice}
                highlightedIndices={highlightedIndices}
                size={DiceSizes.medium}
                shouldRoll={showExample}
                gap={8}
              />
              <Text style={styles.calculation}>
                {category.example.calculation} = {category.example.result} pts
              </Text>

              <TouchableOpacity
                style={[styles.exampleButton, { borderColor: sectionColor }]}
                onPress={() => setShowExample(!showExample)}
                activeOpacity={0.7}
              >
                <Text style={[styles.exampleButtonText, { color: sectionColor }]}>
                  🎲 {showExample ? 'Relancer' : 'Voir l\'exemple'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Tips */}
            {category.tips && category.tips.length > 0 && (
              <View style={styles.tipsSection}>
                <Text style={styles.sectionTitle}>💡 Astuces</Text>
                {category.tips.map((tip, idx) => (
                  <View key={idx} style={styles.tipItem}>
                    <Text style={styles.tipBullet}>•</Text>
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))}
              </View>
            )}
          </Animated.View>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: RulesSpacing.md,
  },
  card: {
    backgroundColor: RulesColors.ui.card,
    borderRadius: RulesBorderRadius.lg,
    padding: RulesSpacing.lg,
    borderWidth: 1,
    borderColor: RulesColors.ui.border,
    ...RulesShadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: RulesSpacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emoji: {
    fontSize: 40,
    marginRight: RulesSpacing.md,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.h4,
    fontWeight: RulesTypography.weights.semibold,
    color: RulesColors.text.primary,
    marginBottom: RulesSpacing.xxs,
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: RulesSpacing.sm,
    paddingVertical: RulesSpacing.xxs,
    borderRadius: RulesBorderRadius.sm,
  },
  difficultyText: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.caption,
    fontWeight: RulesTypography.weights.semibold,
    color: RulesColors.text.white,
  },
  expandIcon: {
    fontSize: 16,
    color: RulesColors.text.tertiary,
  },
  rule: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.body,
    fontWeight: RulesTypography.weights.regular,
    color: RulesColors.text.secondary,
    lineHeight: RulesTypography.lineHeights.relaxed * RulesTypography.sizes.body,
    marginBottom: RulesSpacing.md,
  },
  scoringBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: RulesSpacing.md,
    paddingVertical: RulesSpacing.sm,
    borderRadius: RulesBorderRadius.md,
    gap: RulesSpacing.xs,
  },
  scoringIcon: {
    fontSize: 16,
  },
  scoringText: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.bodySmall,
    fontWeight: RulesTypography.weights.semibold,
  },
  expandedContent: {
    marginTop: RulesSpacing.lg,
    gap: RulesSpacing.lg,
  },
  exampleSection: {
    backgroundColor: RulesColors.ui.background,
    borderRadius: RulesBorderRadius.md,
    padding: RulesSpacing.md,
    gap: RulesSpacing.md,
  },
  sectionTitle: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.bodySmall,
    fontWeight: RulesTypography.weights.semibold,
    color: RulesColors.text.primary,
  },
  calculation: {
    fontFamily: RulesTypography.fonts.mono,
    fontSize: RulesTypography.sizes.bodySmall,
    fontWeight: RulesTypography.weights.medium,
    color: RulesColors.text.secondary,
    textAlign: 'center',
  },
  exampleButton: {
    borderWidth: 2,
    borderRadius: RulesBorderRadius.md,
    paddingVertical: RulesSpacing.sm,
    paddingHorizontal: RulesSpacing.md,
    alignItems: 'center',
  },
  exampleButtonText: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.bodySmall,
    fontWeight: RulesTypography.weights.semibold,
  },
  tipsSection: {
    gap: RulesSpacing.sm,
  },
  tipItem: {
    flexDirection: 'row',
    gap: RulesSpacing.xs,
  },
  tipBullet: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.body,
    color: RulesColors.sections.lower.primary,
    fontWeight: RulesTypography.weights.bold,
  },
  tipText: {
    flex: 1,
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.bodySmall,
    fontWeight: RulesTypography.weights.regular,
    color: RulesColors.text.secondary,
    lineHeight: RulesTypography.lineHeights.relaxed * RulesTypography.sizes.bodySmall,
  },
});
