/**
 * BadgeCard Component
 * Display individual badge with unlock animation
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../../../hooks/useTheme';
import type { Badge } from '../../data/gamification';
import { getBadgeRarityColor } from '../../data/gamification';

interface Props {
  badge: Badge;
  onPress: (badge: Badge) => void;
}

export const BadgeCard: React.FC<Props> = ({ badge, onPress }) => {
  const { isDarkMode } = useTheme();

  const bgColor = isDarkMode ? '#2A2A2A' : '#FFFFFF';
  const borderColor = isDarkMode ? '#3A3A3A' : '#E0E0E0';
  const textColor = isDarkMode ? '#FFFFFF' : '#1A1A1A';
  const subtextColor = isDarkMode ? '#A0A0A0' : '#666666';

  const rarityColor = getBadgeRarityColor(badge.rarity);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: bgColor, borderColor }]}
      onPress={() => onPress(badge)}
      activeOpacity={0.8}
    >
      {/* Rarity Border Indicator */}
      <View style={[styles.rarityBorder, { backgroundColor: rarityColor }]} />

      {/* Badge Icon */}
      <View
        style={[
          styles.iconContainer,
          !badge.unlocked && styles.lockedIconContainer,
        ]}
      >
        <Text style={styles.icon}>{badge.icon}</Text>
        {!badge.unlocked && (
          <View style={styles.lockOverlay}>
            <Text style={styles.lockIcon}>🔒</Text>
          </View>
        )}
      </View>

      {/* Badge Info */}
      <View style={styles.info}>
        <Text
          style={[
            styles.title,
            { color: textColor },
            !badge.unlocked && styles.lockedTitle,
          ]}
          numberOfLines={1}
        >
          {badge.title}
        </Text>

        <Text
          style={[styles.description, { color: subtextColor }]}
          numberOfLines={2}
        >
          {badge.description}
        </Text>

        {/* Progress Bar (if not unlocked and has progress) */}
        {!badge.unlocked && badge.progress !== undefined && badge.progress > 0 && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressTrack, { backgroundColor: borderColor }]}>
              <LinearGradient
                colors={['#3B82F6', '#8B5CF6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(
                      100,
                      (badge.progress / badge.requirementCount) * 100
                    )}%`,
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: subtextColor }]}>
              {badge.progress}/{badge.requirementCount}
            </Text>
          </View>
        )}

        {/* XP Reward */}
        <View style={styles.footer}>
          <View style={[styles.rarityBadge, { backgroundColor: rarityColor }]}>
            <Text style={styles.rarityText}>
              {badge.rarity.toUpperCase()}
            </Text>
          </View>

          <View style={styles.xpBadge}>
            <Text style={styles.xpIcon}>⭐</Text>
            <Text style={[styles.xpText, { color: textColor }]}>
              +{badge.xpReward} XP
            </Text>
          </View>
        </View>
      </View>

      {/* Unlocked Checkmark */}
      {badge.unlocked && (
        <View style={styles.unlockedBadge}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    position: 'relative',
  },
  rarityBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  lockedIconContainer: {
    opacity: 0.5,
  },
  icon: {
    fontSize: 32,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockIcon: {
    fontSize: 20,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  lockedTitle: {
    opacity: 0.6,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rarityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  rarityText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  xpIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  xpText: {
    fontSize: 12,
    fontWeight: '600',
  },
  unlockedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
