/**
 * Étape 5: Recherche de Doublons
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { haptics } from '../../../../utils/haptics';
import { suggestions } from '../../data/suggestions';
import type { Suggestion } from '../../data/suggestions';

interface Props {
  title: string;
  description: string;
  onViewSuggestion?: (suggestionId: string) => void;
  isDarkMode?: boolean;
}

interface SimilarSuggestion {
  suggestion: Suggestion;
  matchScore: number;
  matchReasons: string[];
}

export const Step5Duplicates: React.FC<Props> = ({
  title,
  description,
  onViewSuggestion,
  isDarkMode = false,
}) => {
  const [similarSuggestions, setSimilarSuggestions] = useState<SimilarSuggestion[]>([]);
  const [loading, setLoading] = useState(true);

  const textColor = isDarkMode ? '#FFFFFF' : '#1A1A1A';
  const subtextColor = isDarkMode ? '#AAAAAA' : '#666666';
  const cardBgColor = isDarkMode ? '#2A2A2A' : '#F8F8F8';
  const borderColor = isDarkMode ? '#3A3A3A' : '#E0E0E0';

  useEffect(() => {
    // Simulate search delay
    const timer = setTimeout(() => {
      const similar = findSimilarSuggestions(title, description);
      setSimilarSuggestions(similar);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [title, description]);

  const findSimilarSuggestions = (
    userTitle: string,
    userDescription: string
  ): SimilarSuggestion[] => {
    if (!userTitle.trim() && !userDescription.trim()) {
      return [];
    }

    const results: SimilarSuggestion[] = [];
    const searchTerms = [
      ...userTitle.toLowerCase().split(' '),
      ...userDescription.toLowerCase().split(' '),
    ].filter(term => term.length > 3);

    suggestions.forEach((suggestion: Suggestion) => {
      const suggestionText = `${suggestion.title} ${suggestion.description}`.toLowerCase();
      let matchCount = 0;
      const matchReasons: string[] = [];

      searchTerms.forEach(term => {
        if (suggestionText.includes(term)) {
          matchCount++;
        }
      });

      // Check tags
      const userTags = userDescription.toLowerCase().match(/#\w+/g) || [];
      suggestion.tags.forEach((tag: string) => {
        if (userTags.some(userTag => userTag.includes(tag.replace('#', '')))) {
          matchCount += 2;
          matchReasons.push(`Tag commun: ${tag}`);
        }
      });

      // Calculate match score (0-100)
      const matchScore = Math.min(
        Math.round((matchCount / Math.max(searchTerms.length, 1)) * 100),
        95 // Never 100% to avoid false positives
      );

      if (matchScore > 30) {
        if (matchScore > 60) {
          matchReasons.push('Mots-clés très similaires');
        } else {
          matchReasons.push('Quelques mots-clés en commun');
        }

        results.push({
          suggestion,
          matchScore,
          matchReasons,
        });
      }
    });

    // Sort by match score
    return results.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
  };

  const getMatchColor = (score: number): string => {
    if (score > 70) return '#FF6B6B';
    if (score > 50) return '#FFA500';
    return '#4A90E2';
  };

  const getMatchLabel = (score: number): string => {
    if (score > 70) return 'Très similaire';
    if (score > 50) return 'Similaire';
    return 'Quelques similitudes';
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: textColor }]}>
            🔍 Recherche de doublons...
          </Text>
          <Text style={[styles.subtitle, { color: subtextColor }]}>
            Vérification des suggestions existantes
          </Text>
        </View>
        <View style={[styles.loadingCard, { backgroundColor: cardBgColor }]}>
          <Text style={[styles.loadingText, { color: subtextColor }]}>
            ⏳ Analyse en cours...
          </Text>
        </View>
      </View>
    );
  }

  if (similarSuggestions.length === 0) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: textColor }]}>
            ✅ Aucun doublon détecté !
          </Text>
          <Text style={[styles.subtitle, { color: subtextColor }]}>
            Votre idée semble unique
          </Text>
        </View>

        <View style={[styles.successCard, { backgroundColor: isDarkMode ? '#1A3A1A' : '#E8F5E9' }]}>
          <Text style={styles.successIcon}>🎉</Text>
          <Text style={[styles.successTitle, { color: isDarkMode ? '#10B981' : '#059669' }]}>
            Idée originale !
          </Text>
          <Text style={[styles.successText, { color: subtextColor }]}>
            Nous n'avons trouvé aucune suggestion similaire. Vous pouvez continuer !
          </Text>
        </View>

        <View style={[styles.info, { backgroundColor: cardBgColor, borderColor }]}>
          <Text style={[styles.infoText, { color: subtextColor }]}>
            💡 Notre algorithme a analysé {suggestions.length} suggestions existantes
          </Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>
          🔍 Suggestions similaires
        </Text>
        <Text style={[styles.subtitle, { color: subtextColor }]}>
          {similarSuggestions.length} suggestion{similarSuggestions.length > 1 ? 's' : ''} trouvée{similarSuggestions.length > 1 ? 's' : ''}
        </Text>
      </View>

      <View style={[styles.warningCard, { backgroundColor: isDarkMode ? '#3A2A1A' : '#FFF3E0' }]}>
        <Text style={styles.warningIcon}>⚠️</Text>
        <Text style={[styles.warningText, { color: isDarkMode ? '#FFA500' : '#F57C00' }]}>
          Vérifiez que votre idée est différente avant de continuer
        </Text>
      </View>

      {similarSuggestions.map((item, _index) => (
        <View
          key={item.suggestion.id}
          style={[
            styles.suggestionCard,
            {
              backgroundColor: cardBgColor,
              borderColor,
            },
          ]}
        >
          {/* Match Badge */}
          <View
            style={[
              styles.matchBadge,
              { backgroundColor: getMatchColor(item.matchScore) },
            ]}
          >
            <Text style={styles.matchBadgeText}>
              {item.matchScore}% • {getMatchLabel(item.matchScore)}
            </Text>
          </View>

          {/* Author */}
          <View style={styles.author}>
            <Text style={styles.authorEmoji}>{item.suggestion.author.emoji}</Text>
            <Text style={[styles.authorName, { color: textColor }]}>
              {item.suggestion.author.name}
            </Text>
          </View>

          {/* Title */}
          <Text style={[styles.suggestionTitle, { color: textColor }]}>
            {item.suggestion.title}
          </Text>

          {/* Description */}
          <Text style={[styles.suggestionDescription, { color: subtextColor }]} numberOfLines={2}>
            {item.suggestion.description}
          </Text>

          {/* Match Reasons */}
          <View style={styles.matchReasons}>
            {item.matchReasons.map((reason, idx) => (
              <View
                key={idx}
                style={[styles.reasonBadge, { backgroundColor: isDarkMode ? '#3A3A3A' : '#F0F0F0' }]}
              >
                <Text style={[styles.reasonText, { color: subtextColor }]}>
                  {reason}
                </Text>
              </View>
            ))}
          </View>

          {/* Stats */}
          <View style={styles.stats}>
            <Text style={[styles.stat, { color: subtextColor }]}>
              👍 {item.suggestion.votes} votes
            </Text>
            <Text style={[styles.stat, { color: subtextColor }]}>
              💬 {item.suggestion.commentCount} commentaires
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            {onViewSuggestion && (
              <TouchableOpacity
                style={[styles.actionButton, { borderColor: '#4A90E2' }]}
                onPress={() => {
                  haptics.light();
                  onViewSuggestion(item.suggestion.id);
                }}
              >
                <Text style={[styles.actionButtonText, { color: '#4A90E2' }]}>
                  👁️ Voir les détails
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}

      <View style={[styles.continueCard, { backgroundColor: cardBgColor, borderColor }]}>
        <Text style={[styles.continueTitle, { color: textColor }]}>
          Mon idée est différente
        </Text>
        <Text style={[styles.continueText, { color: subtextColor }]}>
          Si votre suggestion apporte quelque chose de nouveau, vous pouvez continuer. Sinon, votez pour une suggestion existante !
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  loadingCard: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 12,
  },
  successCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  successIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  successText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  warningIcon: {
    fontSize: 24,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  suggestionCard: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  matchBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  matchBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  author: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  authorEmoji: {
    fontSize: 20,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
  },
  suggestionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  suggestionDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  matchReasons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  reasonBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  reasonText: {
    fontSize: 12,
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  stat: {
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  continueCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  continueTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  continueText: {
    fontSize: 14,
    lineHeight: 20,
  },
  info: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 13,
    textAlign: 'center',
  },
});
