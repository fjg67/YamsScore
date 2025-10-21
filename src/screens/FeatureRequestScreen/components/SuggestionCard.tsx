/**
 * Carte de Suggestion - Composant Premium
 * Affiche une suggestion avec animations, votes, et status
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Suggestion, statusLabels } from '../data/suggestions';
import { haptics } from '../../../utils/haptics';

interface Props {
  suggestion: Suggestion;
  onPress: () => void;
  onVote: () => void;
  isDarkMode?: boolean;
}

export const SuggestionCard: React.FC<Props> = ({
  suggestion,
  onPress,
  onVote,
  isDarkMode = false,
}) => {
  const scaleValue = new Animated.Value(1);
  const status = statusLabels[suggestion.status];

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    haptics.light();
    onPress();
  };

  const handleVotePress = (e: any) => {
    e.stopPropagation();
    haptics.medium();
    onVote();
  };

  const bgColor = isDarkMode ? '#1A1A1A' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : '#1A1A1A';
  const subtextColor = isDarkMode ? '#AAAAAA' : '#666666';

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleValue }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={[styles.card, { backgroundColor: bgColor }]}>
          {/* Featured Badge */}
          {suggestion.featured && (
            <View style={styles.featuredBadge}>
              <LinearGradient
                colors={['#FFD700', '#FFA500']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.featuredGradient}
              >
                <Text style={styles.featuredText}>⭐ FEATURED</Text>
              </LinearGradient>
            </View>
          )}

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.authorInfo}>
              <Text style={styles.authorEmoji}>{suggestion.author.emoji}</Text>
              <View style={styles.authorDetails}>
                <Text style={[styles.authorName, { color: textColor }]}>
                  {suggestion.author.name}
                </Text>
                <Text style={[styles.badge, { color: subtextColor }]}>
                  {suggestion.author.badge === 'gold' && '🥇'}
                  {suggestion.author.badge === 'silver' && '🥈'}
                  {suggestion.author.badge === 'bronze' && '🥉'}
                  {suggestion.author.badge === 'platinum' && '💎'}
                  {suggestion.author.badge === 'legend' && '👑'}{' '}
                  {suggestion.author.badge.charAt(0).toUpperCase() +
                    suggestion.author.badge.slice(1)}
                </Text>
              </View>
            </View>

            {/* Status Badge */}
            <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
              <Text style={styles.statusEmoji}>{status.emoji}</Text>
              <Text style={[styles.statusText, { color: status.color }]}>
                {status.label}
              </Text>
            </View>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={[styles.title, { color: textColor }]} numberOfLines={2}>
              {suggestion.title}
            </Text>
            <Text style={[styles.description, { color: subtextColor }]} numberOfLines={3}>
              {suggestion.description}
            </Text>

            {/* Tags */}
            <View style={styles.tags}>
              {suggestion.tags.slice(0, 3).map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            {/* Vote Button */}
            <TouchableOpacity
              style={styles.voteButton}
              onPress={handleVotePress}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['#4A90E2', '#2E5C8A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.voteGradient}
              >
                <Text style={styles.voteIcon}>👍</Text>
                <Text style={styles.voteCount}>{suggestion.votes}</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Stats */}
            <View style={styles.stats}>
              <View style={styles.stat}>
                <Text style={styles.statIcon}>💬</Text>
                <Text style={[styles.statText, { color: subtextColor }]}>
                  {suggestion.commentCount}
                </Text>
              </View>

              {suggestion.hasOfficialResponse && (
                <View style={styles.stat}>
                  <Text style={styles.statIcon}>👨‍💻</Text>
                  <Text style={[styles.statText, { color: '#10B981' }]}>
                    Dev Response
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  featuredBadge: {
    position: 'absolute',
    top: -8,
    right: 16,
    zIndex: 10,
  },
  featuredGradient: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featuredText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  authorEmoji: {
    fontSize: 32,
    marginRight: 8,
  },
  authorDetails: {
    flex: 1,
  },
  authorName: {
    fontSize: 15,
    fontWeight: '600',
  },
  badge: {
    fontSize: 11,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  statusEmoji: {
    fontSize: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  content: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    color: '#666666',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  voteButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  voteGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  voteIcon: {
    fontSize: 18,
  },
  voteCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statIcon: {
    fontSize: 14,
  },
  statText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
