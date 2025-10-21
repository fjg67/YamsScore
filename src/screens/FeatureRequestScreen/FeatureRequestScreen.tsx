/**
 * Feature Request Screen - Innovation Lab Ultra-Premium
 * Système complet de suggestion de fonctionnalités
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { HeroHeader } from './components/HeroHeader';
import { CategoryButton } from './components/CategoryButton';
import { SuggestionCard } from './components/SuggestionCard';
import { BackButton } from './components/BackButton';
import { SuggestionDetailModal } from './components/SuggestionDetailModal';
import { NewSuggestionWizard } from './components/NewSuggestionWizard';
import type { SuggestionFormData } from './components/NewSuggestionWizard';
import { haptics } from '../../utils/haptics';
import {
  categories,
  suggestions,
  getTrendingSuggestions,
  getSuggestionsByCategory,
  getCommunityStats,
} from './data/suggestions';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'FeatureRequest'>;
}

export const FeatureRequestScreen: React.FC<Props> = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [votedSuggestions, setVotedSuggestions] = useState<Set<string>>(new Set());
  const [selectedSuggestionId, setSelectedSuggestionId] = useState<string | null>(null);
  const [showWizard, setShowWizard] = useState(false);

  const trendingSuggestions = getTrendingSuggestions();
  const communityStats = getCommunityStats();

  const displayedSuggestions = selectedCategory
    ? getSuggestionsByCategory(selectedCategory)
    : suggestions;

  const handleCategoryPress = (categoryId: string) => {
    haptics.light();
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  const handleSuggestionPress = (suggestionId: string) => {
    haptics.light();
    setSelectedSuggestionId(suggestionId);
  };

  const handleCloseModal = () => {
    haptics.light();
    setSelectedSuggestionId(null);
  };

  const handleVote = (suggestionId: string) => {
    if (votedSuggestions.has(suggestionId)) {
      // Déjà voté
      haptics.warning();
      Alert.alert(
        'Déjà voté',
        'Vous avez déjà voté pour cette suggestion !',
        [{ text: 'OK', style: 'default' }]
      );
    } else {
      // Nouveau vote
      haptics.success();
      setVotedSuggestions(prev => new Set(prev).add(suggestionId));
      Alert.alert(
        'Vote enregistré ! 🎉',
        '+1 XP • Merci pour votre soutien',
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  const handleNewSuggestion = () => {
    haptics.light();
    setShowWizard(true);
  };

  const handleCloseWizard = () => {
    haptics.light();
    setShowWizard(false);
  };

  const handleRoadmapPress = () => {
    haptics.light();
    navigation.navigate('Roadmap');
  };

  const handleProfilePress = () => {
    haptics.light();
    navigation.navigate('Profile');
  };

  const handleSubmitSuggestion = (_suggestionData: SuggestionFormData) => {
    // In production, this would send to backend
    // For now, just close the wizard
    setShowWizard(false);
  };

  const bgColor = isDarkMode ? '#0A0A0A' : '#F5F5F5';
  const cardBgColor = isDarkMode ? '#1A1A1A' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : '#1A1A1A';
  const subtextColor = isDarkMode ? '#AAAAAA' : '#666666';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Back Button */}
      <View style={styles.headerContainer}>
        <BackButton
          onPress={() => navigation.goBack()}
          isDarkMode={isDarkMode}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Header */}
        <View style={styles.section}>
          <HeroHeader />
        </View>

        {/* Trending Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            🔥 Tendances du Moment
          </Text>

          {trendingSuggestions.map(suggestion => (
            <SuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              onPress={() => handleSuggestionPress(suggestion.id)}
              onVote={() => handleVote(suggestion.id)}
              isDarkMode={isDarkMode}
            />
          ))}
        </View>

        {/* User Contributions (Mock) */}
        <View style={styles.section}>
          <View style={[styles.contributionsCard, { backgroundColor: cardBgColor }]}>
            <Text style={[styles.contributionsTitle, { color: textColor }]}>
              🎁 Vos Contributions
            </Text>
            <View style={styles.contributionsStats}>
              <View style={styles.contributionStat}>
                <Text style={[styles.statNumber, { color: textColor }]}>3</Text>
                <Text style={[styles.statLabel, { color: subtextColor }]}>
                  suggestions
                </Text>
              </View>
              <View style={styles.contributionStat}>
                <Text style={[styles.statNumber, { color: textColor }]}>127</Text>
                <Text style={[styles.statLabel, { color: subtextColor }]}>
                  votes reçus
                </Text>
              </View>
              <View style={styles.contributionStat}>
                <Text style={[styles.statNumber, { color: textColor }]}>🥈</Text>
                <Text style={[styles.statLabel, { color: subtextColor }]}>
                  Silver
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* New Suggestion Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.newSuggestionButton}
            onPress={handleNewSuggestion}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#8B5CF6', '#06B6D4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.newSuggestionGradient}
            >
              <Text style={styles.newSuggestionIcon}>➕</Text>
              <Text style={styles.newSuggestionText}>
                Proposer une nouvelle idée
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Roadmap Button */}
          <TouchableOpacity
            style={[styles.newSuggestionButton, { marginTop: 12 }]}
            onPress={handleRoadmapPress}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#3B82F6', '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.newSuggestionGradient}
            >
              <Text style={styles.newSuggestionIcon}>📊</Text>
              <Text style={styles.newSuggestionText}>
                Voir la Roadmap 2026
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Profile Button */}
          <TouchableOpacity
            style={[styles.newSuggestionButton, { marginTop: 12 }]}
            onPress={handleProfilePress}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#F59E0B', '#EF4444']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.newSuggestionGradient}
            >
              <Text style={styles.newSuggestionIcon}>🏆</Text>
              <Text style={styles.newSuggestionText}>
                Mon Profil & Badges
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            📚 Parcourir par Catégorie
          </Text>

          <View style={styles.categoriesGrid}>
            {categories.map(category => (
              <CategoryButton
                key={category.id}
                category={category}
                onPress={() => handleCategoryPress(category.id)}
              />
            ))}
          </View>
        </View>

        {/* All Suggestions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              {selectedCategory ? '🔍 Suggestions filtrées' : '💡 Toutes les Suggestions'}
            </Text>
            {selectedCategory && (
              <TouchableOpacity
                onPress={() => setSelectedCategory(null)}
                style={styles.clearFilterButton}
              >
                <Text style={styles.clearFilterText}>✕ Effacer</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={[styles.count, { color: subtextColor }]}>
            {displayedSuggestions.length} suggestions
          </Text>

          {displayedSuggestions.map(suggestion => (
            <SuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              onPress={() => handleSuggestionPress(suggestion.id)}
              onVote={() => handleVote(suggestion.id)}
              isDarkMode={isDarkMode}
            />
          ))}
        </View>

        {/* Community Stats */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            📊 Statistiques Communauté
          </Text>

          <View style={[styles.statsCard, { backgroundColor: cardBgColor }]}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: textColor }]}>
                  {communityStats.totalSuggestions}
                </Text>
                <Text style={[styles.statLabel, { color: subtextColor }]}>
                  Total suggestions
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: '#10B981' }]}>
                  {communityStats.totalImplemented}
                </Text>
                <Text style={[styles.statLabel, { color: subtextColor }]}>
                  Implémentées
                </Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: textColor }]}>
                  {communityStats.totalUsers}
                </Text>
                <Text style={[styles.statLabel, { color: subtextColor }]}>
                  Contributeurs
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: textColor }]}>
                  {communityStats.averageTimeToImplement}
                </Text>
                <Text style={[styles.statLabel, { color: subtextColor }]}>
                  Délai moyen
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Suggestion Detail Modal */}
      <SuggestionDetailModal
        visible={selectedSuggestionId !== null}
        suggestionId={selectedSuggestionId}
        onClose={handleCloseModal}
        isDarkMode={isDarkMode}
      />

      {/* New Suggestion Wizard */}
      <NewSuggestionWizard
        visible={showWizard}
        onClose={handleCloseWizard}
        onSubmit={handleSubmitSuggestion}
        isDarkMode={isDarkMode}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1000,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  count: {
    fontSize: 14,
    marginBottom: 16,
  },
  clearFilterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
  },
  clearFilterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  contributionsCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  contributionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  contributionsStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  contributionStat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  newSuggestionButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  newSuggestionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    gap: 12,
  },
  newSuggestionIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  newSuggestionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statsCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
});
