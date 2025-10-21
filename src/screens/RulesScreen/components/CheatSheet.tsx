/**
 * Cheat Sheet - Vue condensée imprimable et partageable
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Share,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import {
  upperSectionCategories,
  lowerSectionCategories,
} from '../data/rulesContent';
import {
  RulesColors,
  RulesTypography,
  RulesSpacing,
  RulesBorderRadius,
} from '../styles/rulesTheme';

interface CheatSheetProps {
  visible: boolean;
  onClose: () => void;
}

export const CheatSheet: React.FC<CheatSheetProps> = ({ visible, onClose }) => {
  const handleShare = async () => {
    try {
      const message = generateShareText();
      await Share.share({
        message,
        title: 'Règles du Yams - Antisèche',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const generateShareText = (): string => {
    let text = '📖 RÈGLES DU YAMS - ANTISÈCHE\n\n';

    text += '🎯 SECTION SUPÉRIEURE\n';
    upperSectionCategories.forEach(cat => {
      text += `${cat.emoji} ${cat.name}: ${cat.rule}\n`;
    });

    text += '\n⭐ BONUS: +35 points si total ≥ 63\n\n';

    text += '🎲 SECTION INFÉRIEURE\n';
    lowerSectionCategories.forEach(cat => {
      const points = cat.scoring.method === 'fixed'
        ? `${cat.scoring.value} pts`
        : 'Total 5 dés';
      text += `${cat.emoji} ${cat.name}: ${cat.rule} - ${points}\n`;
    });

    text += '\n📱 Générée depuis YamsScore\n';

    return text;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Antisèche</Text>
          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <Text style={styles.shareIcon}>📤</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeIn.duration(400)}>
            {/* Intro */}
            <View style={styles.introCard}>
              <Text style={styles.introIcon}>📋</Text>
              <Text style={styles.introTitle}>Guide de Référence Rapide</Text>
              <Text style={styles.introText}>
                Toutes les règles du Yams en un coup d'œil
              </Text>
            </View>

            {/* Quick Stats */}
            <View style={styles.statsRow}>
              <StatBox icon="🎲" value="13" label="Catégories" />
              <StatBox icon="🎯" value="3" label="Lancers/tour" />
              <StatBox icon="👥" value="2-6" label="Joueurs" />
            </View>

            {/* Upper Section Table */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Section Supérieure ⬆️</Text>
              <View style={styles.table}>
                <TableHeader />
                {upperSectionCategories.map(cat => (
                  <TableRow
                    key={cat.id}
                    emoji={cat.emoji}
                    name={cat.name}
                    rule="Somme des dés"
                    points="Variable"
                    color={RulesColors.sections.upper.primary}
                  />
                ))}
                <TableRow
                  emoji="⭐"
                  name="BONUS"
                  rule="Si total ≥ 63"
                  points="+35"
                  color={RulesColors.bonus.primary}
                  highlight={true}
                />
              </View>
            </View>

            {/* Lower Section Table */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Section Inférieure ⬇️</Text>
              <View style={styles.table}>
                <TableHeader />
                {lowerSectionCategories.map(cat => (
                  <TableRow
                    key={cat.id}
                    emoji={cat.emoji}
                    name={cat.name}
                    rule={cat.rule}
                    points={
                      cat.scoring.method === 'fixed'
                        ? cat.scoring.value!.toString()
                        : 'Total'
                    }
                    color={RulesColors.sections.lower.primary}
                  />
                ))}
              </View>
            </View>

            {/* Key Points */}
            <View style={styles.keyPoints}>
              <Text style={styles.keyPointsTitle}>💡 Points Clés</Text>
              <KeyPoint
                icon="🎯"
                text="3 lancers maximum par tour"
              />
              <KeyPoint
                icon="✅"
                text="Une catégorie par tour, définitive"
              />
              <KeyPoint
                icon="⭐"
                text="Vise 63 pts pour le bonus +35"
              />
              <KeyPoint
                icon="👑"
                text="Yams = score le plus élevé (50 pts)"
              />
              <KeyPoint
                icon="🍀"
                text="Chance = filet de sécurité"
              />
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                📱 Généré par YamsScore
              </Text>
              <Text style={styles.footerSubtext}>
                Application de score pour le jeu de Yams
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    </Modal>
  );
};

// ============================================
// SUB-COMPONENTS
// ============================================

interface StatBoxProps {
  icon: string;
  value: string;
  label: string;
}

const StatBox: React.FC<StatBoxProps> = ({ icon, value, label }) => (
  <View style={styles.statBox}>
    <Text style={styles.statIcon}>{icon}</Text>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const TableHeader: React.FC = () => (
  <View style={styles.tableRow}>
    <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 1 }]}>
      Catégorie
    </Text>
    <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 2 }]}>
      Règle
    </Text>
    <Text style={[styles.tableCell, styles.tableHeaderCell, { flex: 1 }]}>
      Points
    </Text>
  </View>
);

interface TableRowProps {
  emoji: string;
  name: string;
  rule: string;
  points: string;
  color: string;
  highlight?: boolean;
}

const TableRow: React.FC<TableRowProps> = ({
  emoji,
  name,
  rule,
  points,
  color,
  highlight = false,
}) => (
  <View
    style={[
      styles.tableRow,
      highlight && { backgroundColor: 'rgba(255, 215, 0, 0.1)' },
    ]}
  >
    <View style={[styles.tableCell, { flex: 1 }]}>
      <Text style={styles.tableCellEmoji}>{emoji}</Text>
      <Text style={[styles.tableCellText, highlight && { fontWeight: '700' }]}>
        {name}
      </Text>
    </View>
    <Text style={[styles.tableCell, styles.tableCellText, { flex: 2 }]}>
      {rule}
    </Text>
    <Text
      style={[
        styles.tableCell,
        styles.tableCellText,
        styles.tableCellPoints,
        { flex: 1, color },
      ]}
    >
      {points}
    </Text>
  </View>
);

interface KeyPointProps {
  icon: string;
  text: string;
}

const KeyPoint: React.FC<KeyPointProps> = ({ icon, text }) => (
  <View style={styles.keyPoint}>
    <Text style={styles.keyPointIcon}>{icon}</Text>
    <Text style={styles.keyPointText}>{text}</Text>
  </View>
);

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RulesColors.ui.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: RulesSpacing.lg,
    paddingTop: 60,
    paddingBottom: RulesSpacing.md,
    backgroundColor: RulesColors.ui.surface,
    borderBottomWidth: 1,
    borderBottomColor: RulesColors.ui.border,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: RulesColors.ui.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 24,
    color: RulesColors.text.primary,
  },
  headerTitle: {
    fontFamily: RulesTypography.fonts.display,
    fontSize: RulesTypography.sizes.h3,
    fontWeight: RulesTypography.weights.bold,
    color: RulesColors.text.primary,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: RulesColors.sections.lower.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareIcon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: RulesSpacing.lg,
  },
  introCard: {
    alignItems: 'center',
    padding: RulesSpacing.xl,
    backgroundColor: RulesColors.ui.surface,
    borderRadius: RulesBorderRadius.lg,
    marginBottom: RulesSpacing.lg,
  },
  introIcon: {
    fontSize: 48,
    marginBottom: RulesSpacing.sm,
  },
  introTitle: {
    fontFamily: RulesTypography.fonts.display,
    fontSize: RulesTypography.sizes.h3,
    fontWeight: RulesTypography.weights.bold,
    color: RulesColors.text.primary,
    marginBottom: RulesSpacing.xs,
  },
  introText: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.bodySmall,
    fontWeight: RulesTypography.weights.regular,
    color: RulesColors.text.secondary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: RulesSpacing.sm,
    marginBottom: RulesSpacing.lg,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: RulesSpacing.md,
    backgroundColor: RulesColors.ui.surface,
    borderRadius: RulesBorderRadius.md,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: RulesSpacing.xs,
  },
  statValue: {
    fontFamily: RulesTypography.fonts.display,
    fontSize: RulesTypography.sizes.h3,
    fontWeight: RulesTypography.weights.bold,
    color: RulesColors.text.primary,
  },
  statLabel: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.caption,
    fontWeight: RulesTypography.weights.regular,
    color: RulesColors.text.secondary,
  },
  section: {
    marginBottom: RulesSpacing.xl,
  },
  sectionTitle: {
    fontFamily: RulesTypography.fonts.display,
    fontSize: RulesTypography.sizes.h3,
    fontWeight: RulesTypography.weights.bold,
    color: RulesColors.text.primary,
    marginBottom: RulesSpacing.md,
  },
  table: {
    backgroundColor: RulesColors.ui.surface,
    borderRadius: RulesBorderRadius.md,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: RulesColors.ui.border,
    paddingVertical: RulesSpacing.sm,
    paddingHorizontal: RulesSpacing.md,
  },
  tableHeaderCell: {
    fontWeight: RulesTypography.weights.bold,
    color: RulesColors.text.primary,
  },
  tableCell: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.caption,
    fontWeight: RulesTypography.weights.regular,
    color: RulesColors.text.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: RulesSpacing.xxs,
  },
  tableCellEmoji: {
    fontSize: 16,
  },
  tableCellText: {
    flex: 1,
  },
  tableCellPoints: {
    fontWeight: RulesTypography.weights.semibold,
  },
  keyPoints: {
    backgroundColor: RulesColors.ui.surface,
    borderRadius: RulesBorderRadius.lg,
    padding: RulesSpacing.lg,
    marginBottom: RulesSpacing.lg,
  },
  keyPointsTitle: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.h4,
    fontWeight: RulesTypography.weights.bold,
    color: RulesColors.text.primary,
    marginBottom: RulesSpacing.md,
  },
  keyPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: RulesSpacing.sm,
    marginBottom: RulesSpacing.sm,
  },
  keyPointIcon: {
    fontSize: 20,
  },
  keyPointText: {
    flex: 1,
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.bodySmall,
    fontWeight: RulesTypography.weights.regular,
    color: RulesColors.text.secondary,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: RulesSpacing.xl,
  },
  footerText: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.bodySmall,
    fontWeight: RulesTypography.weights.semibold,
    color: RulesColors.text.primary,
    marginBottom: RulesSpacing.xxs,
  },
  footerSubtext: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.caption,
    fontWeight: RulesTypography.weights.regular,
    color: RulesColors.text.tertiary,
  },
});
