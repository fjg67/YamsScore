/**
 * Rules Screen Premium - Écran des règles ultra-premium et interactif
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

// Components
import { HeroSection } from './components/HeroSection';
import { QuickAccessBar, TabId } from './components/QuickAccessBar';
import { CategoryCard } from './components/CategoryCard';
import { InfoCard, InfoGrid, TimelineStep } from './components/InfoCard';
import { QuizModal } from './components/QuizModal';
import { SearchModal } from './components/SearchModal';
import { CheatSheet } from './components/CheatSheet';

// Data
import {
  upperSectionCategories,
  lowerSectionCategories,
  gameBasics,
  gameTips,
  gamePhases,
  scoreExamples,
} from './data/rulesContent';

// Styles
import {
  RulesColors,
  RulesTypography,
  RulesSpacing,
  RulesBorderRadius,
  RulesShadows,
} from './styles/rulesTheme';

export const RulesScreenPremium: React.FC = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<TabId>('basics');
  const scrollViewRef = useRef<ScrollView>(null);

  // Phase 2 Modals
  const [quizVisible, setQuizVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [cheatSheetVisible, setCheatSheetVisible] = useState(false);

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    // Scroll to section (you can enhance this with refs to specific sections)
  };

  const handleSearchResultSelect = (category: TabId, itemId?: string) => {
    setActiveTab(category);
    // Optionally scroll to specific item
  };

  return (
    <View style={styles.container}>
      {/* Hero Section */}
      <HeroSection />

      {/* Header with Back Button & Actions - Absolute positioned */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
          <Text style={styles.backText}>Retour</Text>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerActionButton}
            onPress={() => setCheatSheetVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.headerActionIcon}>📄</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerActionButton}
            onPress={() => setQuizVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.headerActionIcon}>🎮</Text>
          </TouchableOpacity>
        </View>
      </View>

        {/* Quick Access Bar */}
        <QuickAccessBar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onSearchPress={() => setSearchVisible(true)}
        />

        {/* Scrollable Content */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* BASICS SECTION */}
          {activeTab === 'basics' && (
            <View style={styles.section}>
              {/* Objective */}
              <InfoCard
                title={gameBasics.objective.title}
                icon={gameBasics.objective.icon}
                delay={0}
              >
                <Text style={styles.cardText}>
                  {gameBasics.objective.description}
                </Text>
                <View style={styles.highlight}>
                  <Text style={styles.highlightText}>
                    🏆 {gameBasics.objective.highlight}
                  </Text>
                </View>
              </InfoCard>

              {/* Turn Steps */}
              <InfoCard
                title={gameBasics.turn.title}
                icon="🔄"
                delay={100}
              >
                {gameBasics.turn.steps.map((step) => (
                  <TimelineStep
                    key={step.number}
                    number={step.number}
                    icon={step.icon}
                    title={step.title}
                    description={step.description}
                    color={step.color}
                  />
                ))}
              </InfoCard>

              {/* Duration */}
              <InfoCard
                title={gameBasics.duration.title}
                icon="⏱️"
                delay={200}
              >
                <InfoGrid items={gameBasics.duration.stats} />
              </InfoCard>

              {/* Bonus */}
              <InfoCard
                title={gameBasics.bonus.title}
                icon={gameBasics.bonus.icon}
                gradient={RulesColors.bonus.gradient}
                delay={300}
              >
                <Text style={styles.cardTextWhite}>
                  {gameBasics.bonus.condition}
                </Text>
                <View style={styles.bonusProgress}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${(gameBasics.bonus.target / 105) * 100}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressLabel}>
                    {gameBasics.bonus.target}/105 pts
                  </Text>
                </View>
                <View style={styles.bonusTip}>
                  <Text style={styles.bonusTipText}>
                    💡 {gameBasics.bonus.tip}
                  </Text>
                </View>
              </InfoCard>
            </View>
          )}

          {/* CATEGORIES SECTION */}
          {activeTab === 'categories' && (
            <View style={styles.section}>
              {/* Upper Section */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Section Supérieure ⬆️</Text>
                <Text style={styles.sectionSubtitle}>
                  Additionne les dés de même valeur
                </Text>
              </View>
              {upperSectionCategories.map((category, index) => (
                <CategoryCard key={category.id} category={category} index={index} />
              ))}

              {/* Lower Section */}
              <View style={[styles.sectionHeader, { marginTop: RulesSpacing.xl }]}>
                <Text style={styles.sectionTitle}>Section Inférieure ⬇️</Text>
                <Text style={styles.sectionSubtitle}>
                  Réalise des combinaisons
                </Text>
              </View>
              {lowerSectionCategories.map((category, index) => (
                <CategoryCard key={category.id} category={category} index={index} />
              ))}
            </View>
          )}

          {/* SCORING SECTION */}
          {activeTab === 'scoring' && (
            <View style={styles.section}>
              <InfoCard
                title="Calcul du Score Final 💯"
                delay={0}
              >
                <View style={styles.formulaBlock}>
                  <FormulaSection
                    label="Section Supérieure"
                    color={RulesColors.sections.upper.primary}
                    items={['1 à 6 (variable)', 'Bonus +35 (si ≥ 63)']}
                  />
                  <Text style={styles.formulaOperator}>+</Text>
                  <FormulaSection
                    label="Section Inférieure"
                    color={RulesColors.sections.lower.primary}
                    items={[
                      'Brelan/Carré (variable)',
                      'Full (25)',
                      'Petite Suite (30)',
                      'Grande Suite (40)',
                      'Yams (50)',
                      'Chance (variable)',
                    ]}
                  />
                  <Text style={styles.formulaOperator}>=</Text>
                  <View style={styles.totalBlock}>
                    <Text style={styles.totalLabel}>TOTAL</Text>
                    <Text style={styles.totalValue}>Score Final</Text>
                  </View>
                </View>
              </InfoCard>

              <InfoCard
                title="Exemples de Scores 📊"
                delay={100}
              >
                {scoreExamples.map((example, index) => (
                  <View
                    key={index}
                    style={[
                      styles.scoreExample,
                      { borderLeftColor: example.color },
                    ]}
                  >
                    <View style={styles.exampleHeader}>
                      <Text style={styles.exampleAvatar}>{example.avatar}</Text>
                      <View style={styles.exampleInfo}>
                        <Text style={styles.exampleName}>{example.name}</Text>
                        <Text style={[styles.exampleScore, { color: example.color }]}>
                          {example.score} points
                        </Text>
                      </View>
                    </View>
                    <View style={styles.breakdown}>
                      <BreakdownItem
                        label="Supérieure"
                        value={example.breakdown.upper}
                      />
                      <BreakdownItem
                        label="Bonus"
                        value={example.breakdown.bonus}
                        highlight={example.breakdown.bonus > 0}
                      />
                      <BreakdownItem
                        label="Inférieure"
                        value={example.breakdown.lower}
                      />
                    </View>
                  </View>
                ))}
              </InfoCard>
            </View>
          )}

          {/* TIPS SECTION */}
          {activeTab === 'tips' && (
            <View style={styles.section}>
              <InfoCard
                title="Stratégies Gagnantes 🧠"
                delay={0}
              >
                {gameTips.map((tip, index) => (
                  <TipCard key={index} tip={tip} />
                ))}
              </InfoCard>

              <InfoCard
                title="Ordre Recommandé 📋"
                delay={100}
              >
                {gamePhases.map((phase) => (
                  <PhaseCard key={phase.phase} phase={phase} />
                ))}
              </InfoCard>
            </View>
          )}
        </ScrollView>

        {/* Phase 2 Modals */}
        <QuizModal
          visible={quizVisible}
          onClose={() => setQuizVisible(false)}
        />

        <SearchModal
          visible={searchVisible}
          onClose={() => setSearchVisible(false)}
          onResultSelect={handleSearchResultSelect}
        />

        <CheatSheet
          visible={cheatSheetVisible}
          onClose={() => setCheatSheetVisible(false)}
        />
    </View>
  );
};

// ============================================
// SUB-COMPONENTS
// ============================================

interface FormulaSectionProps {
  label: string;
  color: string;
  items: string[];
}

const FormulaSection: React.FC<FormulaSectionProps> = ({ label, color, items }) => (
  <View style={styles.formulaSection}>
    <Text style={[styles.formulaLabel, { color }]}>{label}</Text>
    {items.map((item, index) => (
      <Text key={index} style={styles.formulaItem}>
        • {item}
      </Text>
    ))}
  </View>
);

interface BreakdownItemProps {
  label: string;
  value: number;
  highlight?: boolean;
}

const BreakdownItem: React.FC<BreakdownItemProps> = ({ label, value, highlight }) => (
  <View style={styles.breakdownItem}>
    <Text style={styles.breakdownLabel}>{label}</Text>
    <Text
      style={[
        styles.breakdownValue,
        highlight && { color: RulesColors.bonus.primary, fontWeight: '700' },
      ]}
    >
      {value}
    </Text>
  </View>
);

interface TipCardProps {
  tip: typeof gameTips[0];
}

const TipCard: React.FC<TipCardProps> = ({ tip }) => (
  <View style={[styles.tipCard, { borderLeftColor: RulesColors.priority[tip.priority] }]}>
    <View style={styles.tipHeader}>
      <Text style={styles.tipIcon}>{tip.icon}</Text>
      <View style={styles.tipContent}>
        <Text style={styles.tipTitle}>{tip.title}</Text>
        <Text style={styles.tipCategory}>{tip.category}</Text>
      </View>
    </View>
    <Text style={styles.tipDescription}>{tip.description}</Text>
  </View>
);

interface PhaseCardProps {
  phase: typeof gamePhases[0];
}

const PhaseCard: React.FC<PhaseCardProps> = ({ phase }) => (
  <View style={[styles.phaseCard, { backgroundColor: `${phase.color}10` }]}>
    <View style={styles.phaseHeader}>
      <Text style={styles.phaseIcon}>{phase.icon}</Text>
      <Text style={[styles.phaseTitle, { color: phase.color }]}>{phase.title}</Text>
    </View>
    {phase.recommendations.map((rec, index) => (
      <Text key={index} style={styles.phaseItem}>
        • {rec}
      </Text>
    ))}
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
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingTop: 60,
    paddingHorizontal: RulesSpacing.lg,
    paddingBottom: RulesSpacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: RulesSpacing.xs,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingVertical: RulesSpacing.xs,
    paddingHorizontal: RulesSpacing.sm,
    borderRadius: 20,
  },
  backIcon: {
    fontSize: 22,
    color: RulesColors.text.white,
  },
  backText: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.body,
    fontWeight: RulesTypography.weights.bold,
    color: RulesColors.text.white,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  headerActions: {
    flexDirection: 'row',
    gap: RulesSpacing.xs,
  },
  headerActionButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerActionIcon: {
    fontSize: 22,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: RulesSpacing.lg,
    paddingTop: RulesSpacing.lg,
    paddingBottom: RulesSpacing.xxxl,
  },
  section: {
    gap: RulesSpacing.md,
  },
  sectionHeader: {
    marginBottom: RulesSpacing.md,
  },
  sectionTitle: {
    fontFamily: RulesTypography.fonts.display,
    fontSize: RulesTypography.sizes.h2,
    fontWeight: RulesTypography.weights.bold,
    color: RulesColors.text.primary,
    marginBottom: RulesSpacing.xs,
  },
  sectionSubtitle: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.body,
    fontWeight: RulesTypography.weights.regular,
    color: RulesColors.text.secondary,
  },
  cardText: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.body,
    fontWeight: RulesTypography.weights.regular,
    color: RulesColors.text.secondary,
    lineHeight: RulesTypography.lineHeights.relaxed * RulesTypography.sizes.body,
  },
  cardTextWhite: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.body,
    fontWeight: RulesTypography.weights.semibold,
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: RulesTypography.lineHeights.relaxed * RulesTypography.sizes.body,
    marginBottom: RulesSpacing.md,
  },
  highlight: {
    marginTop: RulesSpacing.md,
    padding: RulesSpacing.md,
    backgroundColor: 'rgba(80, 200, 120, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: RulesColors.sections.lower.primary,
    borderRadius: RulesBorderRadius.sm,
  },
  highlightText: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.bodySmall,
    fontWeight: RulesTypography.weights.semibold,
    color: RulesColors.sections.lower.primary,
  },
  bonusProgress: {
    marginTop: RulesSpacing.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: RulesBorderRadius.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: RulesColors.text.white,
    borderRadius: RulesBorderRadius.xs,
  },
  progressLabel: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.caption,
    fontWeight: RulesTypography.weights.semibold,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: RulesSpacing.xs,
  },
  bonusTip: {
    marginTop: RulesSpacing.md,
    padding: RulesSpacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: RulesBorderRadius.md,
  },
  bonusTipText: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.bodySmall,
    fontWeight: RulesTypography.weights.regular,
    color: 'rgba(255, 255, 255, 0.95)',
  },
  formulaBlock: {
    gap: RulesSpacing.lg,
  },
  formulaSection: {
    padding: RulesSpacing.md,
    backgroundColor: RulesColors.ui.background,
    borderRadius: RulesBorderRadius.md,
  },
  formulaLabel: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.body,
    fontWeight: RulesTypography.weights.bold,
    marginBottom: RulesSpacing.xs,
  },
  formulaItem: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.bodySmall,
    fontWeight: RulesTypography.weights.regular,
    color: RulesColors.text.secondary,
    marginLeft: RulesSpacing.sm,
  },
  formulaOperator: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.h2,
    fontWeight: RulesTypography.weights.bold,
    color: RulesColors.text.primary,
    textAlign: 'center',
  },
  totalBlock: {
    padding: RulesSpacing.lg,
    backgroundColor: RulesColors.sections.lower.background,
    borderRadius: RulesBorderRadius.md,
    alignItems: 'center',
  },
  totalLabel: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.bodySmall,
    fontWeight: RulesTypography.weights.semibold,
    color: RulesColors.text.secondary,
    marginBottom: RulesSpacing.xxs,
  },
  totalValue: {
    fontFamily: RulesTypography.fonts.display,
    fontSize: RulesTypography.sizes.h3,
    fontWeight: RulesTypography.weights.bold,
    color: RulesColors.sections.lower.primary,
  },
  scoreExample: {
    padding: RulesSpacing.md,
    backgroundColor: RulesColors.ui.background,
    borderRadius: RulesBorderRadius.md,
    borderLeftWidth: 4,
    marginBottom: RulesSpacing.md,
  },
  exampleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: RulesSpacing.sm,
    marginBottom: RulesSpacing.md,
  },
  exampleAvatar: {
    fontSize: 32,
  },
  exampleInfo: {
    flex: 1,
  },
  exampleName: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.body,
    fontWeight: RulesTypography.weights.semibold,
    color: RulesColors.text.primary,
  },
  exampleScore: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.h4,
    fontWeight: RulesTypography.weights.bold,
  },
  breakdown: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  breakdownItem: {
    alignItems: 'center',
  },
  breakdownLabel: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.caption,
    fontWeight: RulesTypography.weights.regular,
    color: RulesColors.text.secondary,
    marginBottom: RulesSpacing.xxs,
  },
  breakdownValue: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.h4,
    fontWeight: RulesTypography.weights.semibold,
    color: RulesColors.text.primary,
  },
  tipCard: {
    padding: RulesSpacing.md,
    backgroundColor: RulesColors.ui.background,
    borderRadius: RulesBorderRadius.md,
    borderLeftWidth: 4,
    marginBottom: RulesSpacing.md,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: RulesSpacing.sm,
    marginBottom: RulesSpacing.xs,
  },
  tipIcon: {
    fontSize: 24,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.body,
    fontWeight: RulesTypography.weights.semibold,
    color: RulesColors.text.primary,
  },
  tipCategory: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.caption,
    fontWeight: RulesTypography.weights.regular,
    color: RulesColors.text.tertiary,
  },
  tipDescription: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.bodySmall,
    fontWeight: RulesTypography.weights.regular,
    color: RulesColors.text.secondary,
    lineHeight: RulesTypography.lineHeights.relaxed * RulesTypography.sizes.bodySmall,
  },
  phaseCard: {
    padding: RulesSpacing.md,
    borderRadius: RulesBorderRadius.md,
    marginBottom: RulesSpacing.md,
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: RulesSpacing.sm,
    marginBottom: RulesSpacing.sm,
  },
  phaseIcon: {
    fontSize: 28,
  },
  phaseTitle: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.h4,
    fontWeight: RulesTypography.weights.bold,
  },
  phaseItem: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.bodySmall,
    fontWeight: RulesTypography.weights.regular,
    color: RulesColors.text.secondary,
    marginLeft: RulesSpacing.sm,
    marginBottom: RulesSpacing.xxs,
  },
});
