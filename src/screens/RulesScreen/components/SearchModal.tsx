/**
 * Search Modal - Recherche intelligente avec fuzzy matching
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Pressable,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import {
  upperSectionCategories,
  lowerSectionCategories,
  gameTips,
} from '../data/rulesContent';
import {
  RulesColors,
  RulesTypography,
  RulesSpacing,
  RulesBorderRadius,
  RulesShadows,
} from '../styles/rulesTheme';

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
  onResultSelect: (category: 'basics' | 'categories' | 'scoring' | 'tips', itemId?: string) => void;
}

interface SearchResult {
  id: string;
  type: 'category' | 'tip' | 'concept';
  icon: string;
  title: string;
  snippet: string;
  category: 'basics' | 'categories' | 'scoring' | 'tips';
}

export const SearchModal: React.FC<SearchModalProps> = ({
  visible,
  onClose,
  onResultSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Construire l'index de recherche
  const searchIndex = useMemo(() => {
    const index: SearchResult[] = [];

    // Ajouter les catégories
    [...upperSectionCategories, ...lowerSectionCategories].forEach(cat => {
      index.push({
        id: cat.id,
        type: 'category',
        icon: cat.emoji,
        title: cat.name,
        snippet: cat.rule,
        category: 'categories',
      });
    });

    // Ajouter les concepts
    index.push({
      id: 'bonus',
      type: 'concept',
      icon: '⭐',
      title: 'Bonus',
      snippet: '+35 points si total section supérieure ≥ 63',
      category: 'basics',
    });

    index.push({
      id: 'tour',
      type: 'concept',
      icon: '🔄',
      title: 'Déroulement d\'un tour',
      snippet: '3 lancers maximum par tour',
      category: 'basics',
    });

    index.push({
      id: 'scoring',
      type: 'concept',
      icon: '💯',
      title: 'Calcul du score',
      snippet: 'Section supérieure + Section inférieure = Score total',
      category: 'scoring',
    });

    // Ajouter les astuces
    gameTips.forEach((tip, idx) => {
      index.push({
        id: `tip-${idx}`,
        type: 'tip',
        icon: tip.icon,
        title: tip.title,
        snippet: tip.description,
        category: 'tips',
      });
    });

    return index;
  }, []);

  // Fonction de recherche fuzzy simplifiée
  const fuzzyMatch = (text: string, query: string): number => {
    text = text.toLowerCase();
    query = query.toLowerCase();

    // Correspondance exacte
    if (text.includes(query)) {
      return 100;
    }

    // Correspondance floue
    let score = 0;
    let queryIndex = 0;

    for (let i = 0; i < text.length && queryIndex < query.length; i++) {
      if (text[i] === query[queryIndex]) {
        score += 10;
        queryIndex++;
      }
    }

    return queryIndex === query.length ? score : 0;
  };

  // Résultats de recherche
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }

    const results = searchIndex
      .map(item => ({
        ...item,
        score: Math.max(
          fuzzyMatch(item.title, searchQuery),
          fuzzyMatch(item.snippet, searchQuery) * 0.8
        ),
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Top 10 résultats

    return results;
  }, [searchQuery, searchIndex]);

  // Liens rapides
  const quickLinks = [
    { icon: '📖', label: 'Bases', category: 'basics' as const },
    { icon: '🎯', label: 'Catégories', category: 'categories' as const },
    { icon: '💯', label: 'Score', category: 'scoring' as const },
    { icon: '💡', label: 'Astuces', category: 'tips' as const },
  ];

  const handleResultPress = (result: SearchResult) => {
    onResultSelect(result.category, result.id);
    setSearchQuery('');
    onClose();
  };

  const handleQuickLink = (category: 'basics' | 'categories' | 'scoring' | 'tips') => {
    onResultSelect(category);
    setSearchQuery('');
    onClose();
  };

  const handleClose = () => {
    setSearchQuery('');
    onClose();
  };

  const highlightMatch = (text: string, query: string): React.ReactNode => {
    if (!query.trim()) return text;

    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);

    if (index === -1) return text;

    return (
      <Text>
        {text.substring(0, index)}
        <Text style={styles.highlight}>
          {text.substring(index, index + query.length)}
        </Text>
        {text.substring(index + query.length)}
      </Text>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Animated.View
          entering={FadeIn.duration(200)}
          style={styles.container}
          onStartShouldSetResponder={() => true}
        >
          {/* Search Bar */}
          <Animated.View
            entering={FadeInDown.delay(100).duration(400)}
            style={styles.searchBar}
          >
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Cherche une règle... (ex: bonus, yams)"
              placeholderTextColor={RulesColors.text.tertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </Animated.View>

          {/* Results */}
          <ScrollView
            style={styles.resultsContainer}
            contentContainerStyle={styles.resultsContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {searchQuery.trim() === '' ? (
              /* Quick Links */
              <Animated.View entering={FadeInDown.delay(200).duration(400)}>
                <Text style={styles.sectionTitle}>Accès rapide</Text>
                <View style={styles.quickLinks}>
                  {quickLinks.map((link, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.quickLinkButton}
                      onPress={() => handleQuickLink(link.category)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.quickLinkIcon}>{link.icon}</Text>
                      <Text style={styles.quickLinkLabel}>{link.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Popular Searches */}
                <Text style={[styles.sectionTitle, { marginTop: RulesSpacing.xl }]}>
                  Recherches populaires
                </Text>
                <View style={styles.popularSearches}>
                  {['bonus', 'yams', 'full', 'suite', 'brelan'].map((term, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.popularTag}
                      onPress={() => setSearchQuery(term)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.popularTagText}>{term}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Animated.View>
            ) : searchResults.length > 0 ? (
              /* Search Results */
              <>
                <Text style={styles.sectionTitle}>
                  {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''}
                </Text>
                {searchResults.map((result, index) => (
                  <Animated.View
                    key={result.id}
                    entering={FadeInDown.delay(index * 50).duration(300)}
                  >
                    <TouchableOpacity
                      style={styles.resultItem}
                      onPress={() => handleResultPress(result)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.resultIcon}>
                        <Text style={styles.resultIconText}>{result.icon}</Text>
                      </View>
                      <View style={styles.resultContent}>
                        <Text style={styles.resultTitle}>
                          {highlightMatch(result.title, searchQuery)}
                        </Text>
                        <Text style={styles.resultSnippet} numberOfLines={2}>
                          {highlightMatch(result.snippet, searchQuery)}
                        </Text>
                        <View style={styles.resultBadge}>
                          <Text style={styles.resultBadgeText}>
                            {result.type === 'category'
                              ? 'Catégorie'
                              : result.type === 'tip'
                              ? 'Astuce'
                              : 'Concept'}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.chevron}>›</Text>
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </>
            ) : (
              /* No Results */
              <Animated.View
                entering={FadeInDown.delay(200).duration(400)}
                style={styles.noResults}
              >
                <Text style={styles.noResultsIcon}>🔍</Text>
                <Text style={styles.noResultsTitle}>Aucun résultat</Text>
                <Text style={styles.noResultsText}>
                  Essaye avec d'autres termes comme "bonus", "yams" ou "suite"
                </Text>
              </Animated.View>
            )}
          </ScrollView>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingTop: 100,
    paddingHorizontal: RulesSpacing.lg,
  },
  container: {
    backgroundColor: RulesColors.ui.surface,
    borderRadius: RulesBorderRadius.xl,
    overflow: 'hidden',
    maxHeight: '80%',
    ...RulesShadows.xl,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: RulesSpacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: RulesColors.ui.border,
    gap: RulesSpacing.sm,
  },
  searchIcon: {
    fontSize: 24,
  },
  searchInput: {
    flex: 1,
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.body,
    fontWeight: RulesTypography.weights.regular,
    color: RulesColors.text.primary,
  },
  clearIcon: {
    fontSize: 20,
    color: RulesColors.text.tertiary,
    padding: RulesSpacing.xs,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsContent: {
    padding: RulesSpacing.lg,
  },
  sectionTitle: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.bodySmall,
    fontWeight: RulesTypography.weights.semibold,
    color: RulesColors.text.tertiary,
    marginBottom: RulesSpacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  quickLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: RulesSpacing.sm,
  },
  quickLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: RulesSpacing.xs,
    paddingVertical: RulesSpacing.sm,
    paddingHorizontal: RulesSpacing.md,
    backgroundColor: RulesColors.ui.background,
    borderRadius: RulesBorderRadius.md,
    borderWidth: 1,
    borderColor: RulesColors.ui.border,
  },
  quickLinkIcon: {
    fontSize: 20,
  },
  quickLinkLabel: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.bodySmall,
    fontWeight: RulesTypography.weights.medium,
    color: RulesColors.text.primary,
  },
  popularSearches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: RulesSpacing.xs,
  },
  popularTag: {
    paddingVertical: RulesSpacing.xs,
    paddingHorizontal: RulesSpacing.md,
    backgroundColor: RulesColors.sections.lower.background,
    borderRadius: RulesBorderRadius.round,
  },
  popularTagText: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.caption,
    fontWeight: RulesTypography.weights.medium,
    color: RulesColors.sections.lower.primary,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: RulesSpacing.md,
    backgroundColor: RulesColors.ui.background,
    borderRadius: RulesBorderRadius.md,
    marginBottom: RulesSpacing.sm,
    gap: RulesSpacing.md,
  },
  resultIcon: {
    width: 48,
    height: 48,
    borderRadius: RulesBorderRadius.md,
    backgroundColor: RulesColors.ui.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultIconText: {
    fontSize: 28,
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.body,
    fontWeight: RulesTypography.weights.semibold,
    color: RulesColors.text.primary,
    marginBottom: RulesSpacing.xxs,
  },
  resultSnippet: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.bodySmall,
    fontWeight: RulesTypography.weights.regular,
    color: RulesColors.text.secondary,
    lineHeight: RulesTypography.lineHeights.relaxed * RulesTypography.sizes.bodySmall,
    marginBottom: RulesSpacing.xs,
  },
  resultBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: RulesSpacing.xs,
    backgroundColor: RulesColors.sections.upper.background,
    borderRadius: RulesBorderRadius.xs,
  },
  resultBadgeText: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.tiny,
    fontWeight: RulesTypography.weights.semibold,
    color: RulesColors.sections.upper.primary,
    textTransform: 'uppercase',
  },
  chevron: {
    fontSize: 24,
    color: RulesColors.text.tertiary,
  },
  highlight: {
    backgroundColor: RulesColors.bonus.background,
    color: RulesColors.bonus.primary,
    fontWeight: RulesTypography.weights.bold,
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: RulesSpacing.xxxl,
  },
  noResultsIcon: {
    fontSize: 64,
    marginBottom: RulesSpacing.md,
    opacity: 0.5,
  },
  noResultsTitle: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.h3,
    fontWeight: RulesTypography.weights.bold,
    color: RulesColors.text.primary,
    marginBottom: RulesSpacing.xs,
  },
  noResultsText: {
    fontFamily: RulesTypography.fonts.text,
    fontSize: RulesTypography.sizes.bodySmall,
    fontWeight: RulesTypography.weights.regular,
    color: RulesColors.text.secondary,
    textAlign: 'center',
  },
});
