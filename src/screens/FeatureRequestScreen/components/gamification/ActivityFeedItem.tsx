/**
 * ActivityFeedItem Component
 * Display single activity in the community feed
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';
import type { ActivityFeed } from '../../data/gamification';
import { formatTimeAgo } from '../../data/gamification';

interface Props {
  activity: ActivityFeed;
}

export const ActivityFeedItem: React.FC<Props> = ({ activity }) => {
  const { isDarkMode } = useTheme();

  const bgColor = isDarkMode ? '#2A2A2A' : '#F8F8F8';
  const textColor = isDarkMode ? '#FFFFFF' : '#1A1A1A';
  const subtextColor = isDarkMode ? '#A0A0A0' : '#666666';

  // Get activity icon and color
  const getActivityStyle = (): { icon: string; color: string } => {
    switch (activity.type) {
      case 'badge_unlock':
        return { icon: '🏅', color: '#F59E0B' };
      case 'level_up':
        return { icon: '⬆️', color: '#10B981' };
      case 'streak_milestone':
        return { icon: '🔥', color: '#EF4444' };
      case 'contribution':
        return { icon: '💡', color: '#3B82F6' };
    }
  };

  const { icon, color } = getActivityStyle();

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Icon */}
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.avatar}>{activity.avatar}</Text>
          <Text style={[styles.username, { color: textColor }]}>
            {activity.username}
          </Text>
          <Text style={[styles.description, { color: subtextColor }]}>
            {activity.description}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.timestamp, { color: subtextColor }]}>
            {formatTimeAgo(activity.timestamp)}
          </Text>

          {activity.xpGained && (
            <>
              <Text style={[styles.separator, { color: subtextColor }]}>•</Text>
              <Text style={[styles.xp, { color: '#F59E0B' }]}>
                +{activity.xpGained} XP
              </Text>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  avatar: {
    fontSize: 16,
    marginRight: 6,
  },
  username: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 4,
  },
  description: {
    fontSize: 14,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
  },
  separator: {
    marginHorizontal: 8,
    fontSize: 12,
  },
  xp: {
    fontSize: 12,
    fontWeight: '600',
  },
});
