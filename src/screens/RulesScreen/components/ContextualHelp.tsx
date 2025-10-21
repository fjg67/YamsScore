/**
 * Contextual Help - Aide contextuelle depuis l'écran de jeu
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { DiceRow } from './AnimatedDice';
import {
  upperSectionCategories,
  lowerSectionCategories,
  CategoryRule,
} from '../data/rulesContent';
import {
  RulesColors,
  RulesTypography,
  RulesSpacing,
  RulesBorderRadius,
  RulesShadows,
  getSectionColor,
  DiceSizes,
} from '../styles/rulesTheme';

interface ContextualHelpProps {
  visible: boolean;
  categoryId?: string;
  onClose: () => void;
  onViewAllRules?: () => void;
}

export const ContextualHelp: React.FC<ContextualHelpProps> = ({
  visible,
  categoryId,
  onClose,
  onViewAllRules,
}) => {
  // Trouver la catégorie
  const category = [...upperSectionCategories, ...lowerSectionCategories].find(
    cat => cat.id === categoryId
  );

  if (!category) {
    return null;
  }

  const sectionColor = getSectionColor(category.section);
  const highlightedIndices = category.example.highlight
    ? category.example.dice
        .map((val, idx) => (category.example.highlight?.includes(val) ? idx : -1))
        .filter(idx => idx !== -1)
    : [];

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={onClose}
        />

        <Animated.View
          entering={SlideInDown.duration(400).springify()}
          style={styles.bottomSheet}
        >
          {/* Handle Bar */}
          <View style={styles.handleBar} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.categoryEmoji}>{category.emoji}</Text>
              <Text style={styles.categoryName}>{category.name}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Rule */}
            <View style={styles.ruleSection}>
              <Text style={styles.sectionLabel}>RÈGLE</Text>
              <Text style={styles.ruleText}>{category.rule}</Text>
            </View>

            {/* Scoring */}
            <View style={styles.scoringSection}>
              <Text style={styles.sectionLabel}>POINTS</Text>
              <View style={[styles.scoringBadge, { borderLeftColor: sectionColor }]}>
                <Text style={styles.scoringIcon}>💯</Text>
                <Text style={[styles.scoringText, { color: sectionColor }]}>
                  {category.scoring.method === 'fixed'
                    ? `${category.scoring.value} points fixes`
                    : category.scoring.formula}
                </Text>
              </View>
            </View>

            {/* Example */}
            <View style={styles.exampleSection}>
              <Text style={styles.sectionLabel}>EXEMPLE</Text>
              <View style={styles.exampleCard}>
                <DiceRow
                  dice={category.example.dice}
                  highlightedIndices={highlightedIndices}
                  size={DiceSizes.large}
                  gap={12}
                />
                <View style={styles.calculationContainer}>
                  <Text style={styles.calculationText}>
                    {category.example.calculation}
                  </Text>
                  <Text style={[styles.resultText, { color: sectionColor }]}>
                    = {category.example.result} pts
                  </Text>
                </View>
              </View>
            </View>

            {/* Tips */}
            {category.tips && category.tips.length > 0 && (
              <View style={styles.tipsSection}>
                <Text style={styles.sectionLabel}>💡 ASTUCES</Text>
                {category.tips.map((tip, index) => (
                  <View key={index} style={styles.tipItem}>
                    <View style={[styles.tipBullet, { backgroundColor: sectionColor }]} />
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Call to Action */}
            {onViewAllRules && (
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={onViewAllRules}
                activeOpacity={0.7}
              >
                <Text style={styles.viewAllButtonText}>
                  📖 Voir toutes les règles
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          {/* Bottom Action */}
          <View style={styles.bottomAction}>
            <TouchableOpacity
              style={[styles.gotItButton, { backgroundColor: sectionColor }]}
              onPress={onClose}
              activeOpacity={0.9}
            >
              <Text style={styles.gotItButtonText}>J'ai compris ✓</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  overlayTouchable: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: RulesColors.ui.surface,
    borderTopLeftRadius: RulesBorderRadius.xxl,
    borderTopRightRadius: RulesBorderRadius.xxl,
    maxHeight: '80%',
    ...RulesShadows.xl,
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: RulesColors.ui.border,
    borderRadius: RulesBorderRadius.xs,
    alignSelf: 'center',
    marginTop: RulesSpacing.sm,
    marginBottom: RulesSpacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: RulesSpacing.lg,
    paddingBottom: RulesSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: RulesColors.ui.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: RulesSpacing.sm,
  },
  categoryEmoji: {
    fontSize: 32,
  },
  categoryName: {
    fontFamily: RulesTypography.fonts.display,
    fontSize: RulesTypography.sizes.h3,
    fontWeight: RulesTypography.weights.bold,
    color: RulesColors.text.primary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: RulesColors.ui.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 20,
    color: RulesColors.text.secondary,
    fontWeight: RulesTypography.weights.bold,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: RulesSpacing.lg,
  },
  sectionLabel: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.caption,
    fontWeight: RulesTypography.weights.bold,
    color: RulesColors.text.tertiary,
    marginBottom: RulesSpacing.sm,
    letterSpacing: 0.5,
  },
  ruleSection: {
    marginBottom: RulesSpacing.lg,
  },
  ruleText: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.h4,
    fontWeight: RulesTypography.weights.medium,
    color: RulesColors.text.primary,
    lineHeight: RulesTypography.lineHeights.relaxed * RulesTypography.sizes.h4,
  },
  scoringSection: {
    marginBottom: RulesSpacing.lg,
  },
  scoringBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: RulesSpacing.sm,
    padding: RulesSpacing.md,
    backgroundColor: RulesColors.ui.background,
    borderRadius: RulesBorderRadius.md,
    borderLeftWidth: 4,
  },
  scoringIcon: {
    fontSize: 24,
  },
  scoringText: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.body,
    fontWeight: RulesTypography.weights.semibold,
  },
  exampleSection: {
    marginBottom: RulesSpacing.lg,
  },
  exampleCard: {
    padding: RulesSpacing.lg,
    backgroundColor: RulesColors.ui.background,
    borderRadius: RulesBorderRadius.lg,
    alignItems: 'center',
    gap: RulesSpacing.md,
  },
  calculationContainer: {
    alignItems: 'center',
    gap: RulesSpacing.xs,
  },
  calculationText: {
    fontFamily: RulesTypography.fonts.mono,
    fontSize: RulesTypography.sizes.body,
    fontWeight: RulesTypography.weights.medium,
    color: RulesColors.text.secondary,
  },
  resultText: {
    fontFamily: RulesTypography.fonts.display,
    fontSize: RulesTypography.sizes.h3,
    fontWeight: RulesTypography.weights.bold,
  },
  tipsSection: {
    marginBottom: RulesSpacing.lg,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: RulesSpacing.sm,
    marginBottom: RulesSpacing.sm,
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  tipText: {
    flex: 1,
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.bodySmall,
    fontWeight: RulesTypography.weights.regular,
    color: RulesColors.text.secondary,
    lineHeight: RulesTypography.lineHeights.relaxed * RulesTypography.sizes.bodySmall,
  },
  viewAllButton: {
    padding: RulesSpacing.md,
    backgroundColor: RulesColors.ui.background,
    borderRadius: RulesBorderRadius.md,
    borderWidth: 2,
    borderColor: RulesColors.ui.border,
    alignItems: 'center',
  },
  viewAllButtonText: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.body,
    fontWeight: RulesTypography.weights.semibold,
    color: RulesColors.text.primary,
  },
  bottomAction: {
    padding: RulesSpacing.lg,
    borderTopWidth: 1,
    borderTopColor: RulesColors.ui.border,
  },
  gotItButton: {
    padding: RulesSpacing.lg,
    borderRadius: RulesBorderRadius.md,
    alignItems: 'center',
    ...RulesShadows.sm,
  },
  gotItButtonText: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.body,
    fontWeight: RulesTypography.weights.bold,
    color: RulesColors.text.white,
  },
});
