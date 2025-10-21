/**
 * Profile Screen - Contributor Gamification Profile
 * Displays user stats, level, badges, leaderboard, streak, and activity
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { haptics } from '../../utils/haptics';
import { BackButton } from './components/BackButton';
import { LevelProgressBar } from './components/gamification/LevelProgressBar';
import { BadgeCard } from './components/gamification/BadgeCard';
import { LeaderboardRow } from './components/gamification/LeaderboardRow';
import { StreakCalendar } from './components/gamification/StreakCalendar';
import { ActivityFeedItem } from './components/gamification/ActivityFeedItem';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import {
  CURRENT_USER,
  BADGES,
  LEADERBOARD,
  STREAK_CALENDAR,
  ACTIVITY_FEED,
  getProgressToNextLevel,
  getBadgesByCategory,
  type Badge,
  type BadgeCategory,
} from './data/gamification';

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
}

type TabMode = 'overview' | 'badges' | 'leaderboard' | 'activity';
type BadgeFilter = 'all' | BadgeCategory;

export const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const [tabMode, setTabMode] = useState<TabMode>('overview');
  const [badgeFilter, setBadgeFilter] = useState<BadgeFilter>('all');

  const bgColor = isDarkMode ? '#1A1A1A' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : '#1A1A1A';
  const subtextColor = isDarkMode ? '#A0A0A0' : '#666666';

  // Calculate level progress
  const levelProgress = getProgressToNextLevel(CURRENT_USER.xp);

  // Handle back navigation
  const handleBack = () => {
    haptics.light();
    navigation.goBack();
  };

  // Handle tab change
  const handleTabChange = (tab: TabMode) => {
    haptics.light();
    setTabMode(tab);
  };

  // Handle badge press
  const handleBadgePress = (badge: Badge) => {
    haptics.light();

    const statusText = badge.unlocked
      ? `✅ Débloqué le ${badge.unlockedAt ? new Date(badge.unlockedAt).toLocaleDateString() : 'N/A'}`
      : `🔒 Progression: ${badge.progress || 0}/${badge.requirementCount}`;

    Alert.alert(
      `${badge.icon} ${badge.title}`,
      `${badge.description}\n\n${statusText}\n\nRécompense: +${badge.xpReward} XP\nRareté: ${badge.rarity.toUpperCase()}`,
      [{ text: 'OK', style: 'default' }]
    );
  };

  // Handle badge filter
  const handleBadgeFilter = (filter: BadgeFilter) => {
    haptics.light();
    setBadgeFilter(filter);
  };

  // Get filtered badges
  const getFilteredBadges = (): Badge[] => {
    if (badgeFilter === 'all') return BADGES;
    return getBadgesByCategory(badgeFilter);
  };

  const filteredBadges = getFilteredBadges();
  const unlockedCount = filteredBadges.filter(b => b.unlocked).length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={handleBack} />
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: textColor }]}>
            Mon Profil
          </Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[
            styles.tab,
            tabMode === 'overview' && styles.activeTab,
          ]}
          onPress={() => handleTabChange('overview')}
        >
          <Text
            style={[
              styles.tabText,
              {
                color:
                  tabMode === 'overview' ? '#4A90E2' : subtextColor,
              },
            ]}
          >
            📊 Vue d'ensemble
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            tabMode === 'badges' && styles.activeTab,
          ]}
          onPress={() => handleTabChange('badges')}
        >
          <Text
            style={[
              styles.tabText,
              {
                color:
                  tabMode === 'badges' ? '#4A90E2' : subtextColor,
              },
            ]}
          >
            🏅 Badges
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            tabMode === 'leaderboard' && styles.activeTab,
          ]}
          onPress={() => handleTabChange('leaderboard')}
        >
          <Text
            style={[
              styles.tabText,
              {
                color:
                  tabMode === 'leaderboard' ? '#4A90E2' : subtextColor,
              },
            ]}
          >
            🏆 Classement
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            tabMode === 'activity' && styles.activeTab,
          ]}
          onPress={() => handleTabChange('activity')}
        >
          <Text
            style={[
              styles.tabText,
              {
                color:
                  tabMode === 'activity' ? '#4A90E2' : subtextColor,
              },
            ]}
          >
            📰 Activité
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* OVERVIEW TAB */}
        {tabMode === 'overview' && (
          <View style={styles.section}>
            {/* User Header */}
            <View style={styles.userHeader}>
              <Text style={styles.userAvatar}>{CURRENT_USER.avatar}</Text>
              <Text style={[styles.username, { color: textColor }]}>
                {CURRENT_USER.username}
              </Text>
              <Text style={[styles.rank, { color: subtextColor }]}>
                Rang #{CURRENT_USER.rank} mondial
              </Text>
            </View>

            {/* Level Progress */}
            <LevelProgressBar
              currentLevel={levelProgress.currentLevel}
              nextLevel={levelProgress.nextLevel}
              progressXP={levelProgress.progressXP}
              neededXP={levelProgress.neededXP}
              percentage={levelProgress.percentage}
              totalXP={CURRENT_USER.xp}
            />

            {/* Quick Stats */}
            <View style={styles.quickStats}>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>🏅</Text>
                <Text style={[styles.statValue, { color: textColor }]}>
                  {CURRENT_USER.badgesUnlocked}/{CURRENT_USER.totalBadges}
                </Text>
                <Text style={[styles.statLabel, { color: subtextColor }]}>
                  Badges
                </Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statIcon}>🗳️</Text>
                <Text style={[styles.statValue, { color: textColor }]}>
                  {CURRENT_USER.contributions.votes}
                </Text>
                <Text style={[styles.statLabel, { color: subtextColor }]}>
                  Votes
                </Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statIcon}>💬</Text>
                <Text style={[styles.statValue, { color: textColor }]}>
                  {CURRENT_USER.contributions.comments}
                </Text>
                <Text style={[styles.statLabel, { color: subtextColor }]}>
                  Commentaires
                </Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statIcon}>💡</Text>
                <Text style={[styles.statValue, { color: textColor }]}>
                  {CURRENT_USER.contributions.suggestions}
                </Text>
                <Text style={[styles.statLabel, { color: subtextColor }]}>
                  Suggestions
                </Text>
              </View>
            </View>

            {/* Streak Calendar */}
            <View style={styles.sectionWithTitle}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>
                🔥 Série de Contribution
              </Text>
              <StreakCalendar
                calendar={STREAK_CALENDAR}
                currentStreak={CURRENT_USER.streak}
                longestStreak={CURRENT_USER.longestStreak}
              />
            </View>

            {/* Recent Badges */}
            <View style={styles.sectionWithTitle}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  🏅 Badges Récents
                </Text>
                <TouchableOpacity onPress={() => handleTabChange('badges')}>
                  <Text style={[styles.seeAllText, { color: '#4A90E2' }]}>
                    Voir tout →
                  </Text>
                </TouchableOpacity>
              </View>
              {BADGES.filter(b => b.unlocked)
                .slice(0, 3)
                .map(badge => (
                  <BadgeCard
                    key={badge.id}
                    badge={badge}
                    onPress={handleBadgePress}
                  />
                ))}
            </View>
          </View>
        )}

        {/* BADGES TAB */}
        {tabMode === 'badges' && (
          <View style={styles.section}>
            {/* Filter Bar */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterBar}
              contentContainerStyle={styles.filterContent}
            >
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  badgeFilter === 'all' && styles.activeFilterChip,
                ]}
                onPress={() => handleBadgeFilter('all')}
              >
                <Text
                  style={[
                    styles.filterText,
                    {
                      color:
                        badgeFilter === 'all' ? '#FFFFFF' : subtextColor,
                    },
                  ]}
                >
                  Tous ({BADGES.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterChip,
                  badgeFilter === 'contribution' && styles.activeFilterChip,
                ]}
                onPress={() => handleBadgeFilter('contribution')}
              >
                <Text
                  style={[
                    styles.filterText,
                    {
                      color:
                        badgeFilter === 'contribution'
                          ? '#FFFFFF'
                          : subtextColor,
                    },
                  ]}
                >
                  💡 Contribution
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterChip,
                  badgeFilter === 'social' && styles.activeFilterChip,
                ]}
                onPress={() => handleBadgeFilter('social')}
              >
                <Text
                  style={[
                    styles.filterText,
                    {
                      color:
                        badgeFilter === 'social' ? '#FFFFFF' : subtextColor,
                    },
                  ]}
                >
                  🤝 Social
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterChip,
                  badgeFilter === 'streak' && styles.activeFilterChip,
                ]}
                onPress={() => handleBadgeFilter('streak')}
              >
                <Text
                  style={[
                    styles.filterText,
                    {
                      color:
                        badgeFilter === 'streak' ? '#FFFFFF' : subtextColor,
                    },
                  ]}
                >
                  🔥 Série
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterChip,
                  badgeFilter === 'achievement' && styles.activeFilterChip,
                ]}
                onPress={() => handleBadgeFilter('achievement')}
              >
                <Text
                  style={[
                    styles.filterText,
                    {
                      color:
                        badgeFilter === 'achievement'
                          ? '#FFFFFF'
                          : subtextColor,
                    },
                  ]}
                >
                  🎯 Succès
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterChip,
                  badgeFilter === 'special' && styles.activeFilterChip,
                ]}
                onPress={() => handleBadgeFilter('special')}
              >
                <Text
                  style={[
                    styles.filterText,
                    {
                      color:
                        badgeFilter === 'special' ? '#FFFFFF' : subtextColor,
                    },
                  ]}
                >
                  ⭐ Spécial
                </Text>
              </TouchableOpacity>
            </ScrollView>

            {/* Badge Count */}
            <Text style={[styles.badgeCount, { color: subtextColor }]}>
              {unlockedCount} / {filteredBadges.length} débloqués
            </Text>

            {/* Badges Grid */}
            {filteredBadges.map(badge => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                onPress={handleBadgePress}
              />
            ))}
          </View>
        )}

        {/* LEADERBOARD TAB */}
        {tabMode === 'leaderboard' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              🏆 Classement Mondial
            </Text>
            <Text style={[styles.sectionSubtitle, { color: subtextColor }]}>
              Top 20 contributeurs
            </Text>

            {LEADERBOARD.map(entry => (
              <LeaderboardRow
                key={entry.userId}
                entry={entry}
                isCurrentUser={entry.userId === CURRENT_USER.userId}
              />
            ))}
          </View>
        )}

        {/* ACTIVITY TAB */}
        {tabMode === 'activity' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              📰 Activité Communauté
            </Text>
            <Text style={[styles.sectionSubtitle, { color: subtextColor }]}>
              Dernières réalisations
            </Text>

            {ACTIVITY_FEED.map(activity => (
              <ActivityFeedItem key={activity.id} activity={activity} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRight: {
    width: 40,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4A90E2',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  userHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userAvatar: {
    fontSize: 64,
    marginBottom: 12,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  rank: {
    fontSize: 14,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    textAlign: 'center',
  },
  sectionWithTitle: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  filterBar: {
    marginBottom: 16,
  },
  filterContent: {
    paddingRight: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
  },
  badgeCount: {
    fontSize: 14,
    marginBottom: 16,
  },
});
