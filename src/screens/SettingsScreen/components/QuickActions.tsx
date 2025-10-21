/**
 * Quick Actions Row Component
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { haptics } from '../../../utils/haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ActionCardProps {
  emoji: string;
  label: string;
  badge?: {
    text: string;
    color: string;
  };
  onPress: () => void;
  gradientColors: string[];
}

const ActionCard: React.FC<ActionCardProps> = ({
  emoji,
  label,
  badge,
  onPress,
  gradientColors,
}) => {
  const handlePress = () => {
    haptics.light();
    onPress();
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: gradientColors[0],
          },
        ]}
      >
        <Text style={styles.iconEmoji}>{emoji}</Text>
      </View>
      <Text style={styles.cardLabel}>{label}</Text>
      {badge && (
        <View style={[styles.badge, { backgroundColor: badge.color }]}>
          <Text style={styles.badgeText}>{badge.text}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

interface QuickActionsProps {
  onEditProfile: () => void;
  onAchievements: () => void;
  hasNewAchievements?: boolean;
  newAchievementsCount?: number;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onEditProfile,
  onAchievements,
  hasNewAchievements = false,
  newAchievementsCount = 0,
}) => {
  return (
    <View style={styles.container}>
      <ActionCard
        emoji="✏️"
        label="Modifier profil"
        onPress={onEditProfile}
        gradientColors={['#4A90E2', '#5DADE2']}
      />

      <ActionCard
        emoji="🏅"
        label="Mes badges"
        onPress={onAchievements}
        gradientColors={['#FFD700', '#FFA500']}
        badge={
          hasNewAchievements
            ? {
                text: `${newAchievementsCount} nouveau${
                  newAchievementsCount > 1 ? 'x' : ''
                }`,
                color: '#FF6B6B',
              }
            : undefined
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: -20, // Overlap with hero
    marginBottom: 16,
    gap: 12,
  },
  card: {
    flex: 1,
    height: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    position: 'relative',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  iconEmoji: {
    fontSize: 20,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default QuickActions;
