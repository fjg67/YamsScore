/**
 * LeaderboardRow Component
 * Display single leaderboard entry with rank, user, and stats
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';
import type { LeaderboardEntry } from '../../data/gamification';

interface Props {
  entry: LeaderboardEntry;
  isCurrentUser?: boolean;
}

export const LeaderboardRow: React.FC<Props> = ({ entry, isCurrentUser }) => {
  const { isDarkMode } = useTheme();

  const bgColor = isCurrentUser
    ? isDarkMode
      ? '#1A3A4A'
      : '#E3F2FD'
    : isDarkMode
    ? '#2A2A2A'
    : '#F8F8F8';
  const textColor = isDarkMode ? '#FFFFFF' : '#1A1A1A';
  const subtextColor = isDarkMode ? '#A0A0A0' : '#666666';

  // Rank colors
  const getRankColor = (rank: number): string => {
    if (rank === 1) return '#F59E0B'; // Gold
    if (rank === 2) return '#9CA3AF'; // Silver
    if (rank === 3) return '#CD7F32'; // Bronze
    return isDarkMode ? '#4A4A4A' : '#E0E0E0';
  };

  const getRankIcon = (rank: number): string => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '';
  };

  return (
    <View style={[styles.row, { backgroundColor: bgColor }]}>
      {/* Rank */}
      <View
        style={[styles.rankContainer, { backgroundColor: getRankColor(entry.rank) }]}
      >
        {entry.rank <= 3 ? (
          <Text style={styles.rankIcon}>{getRankIcon(entry.rank)}</Text>
        ) : (
          <Text style={styles.rankNumber}>#{entry.rank}</Text>
        )}
      </View>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Text style={styles.avatar}>{entry.avatar}</Text>
      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <Text
          style={[styles.username, { color: textColor }]}
          numberOfLines={1}
        >
          {entry.username}
          {isCurrentUser && ' (Vous)'}
        </Text>
        <View style={styles.statsRow}>
          <Text style={[styles.statText, { color: subtextColor }]}>
            Niv. {entry.level}
          </Text>
          <Text style={[styles.separator, { color: subtextColor }]}>•</Text>
          <Text style={[styles.statText, { color: subtextColor }]}>
            {entry.badgesUnlocked} badges
          </Text>
          <Text style={[styles.separator, { color: subtextColor }]}>•</Text>
          <Text style={[styles.statText, { color: subtextColor }]}>
            {entry.streak} 🔥
          </Text>
        </View>
      </View>

      {/* XP */}
      <View style={styles.xpContainer}>
        <Text style={[styles.xpValue, { color: textColor }]}>
          {entry.xp.toLocaleString()}
        </Text>
        <Text style={[styles.xpLabel, { color: subtextColor }]}>XP</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  rankContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankIcon: {
    fontSize: 24,
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatar: {
    fontSize: 28,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
  },
  separator: {
    marginHorizontal: 6,
    fontSize: 12,
  },
  xpContainer: {
    alignItems: 'flex-end',
  },
  xpValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  xpLabel: {
    fontSize: 11,
    marginTop: 2,
  },
});
