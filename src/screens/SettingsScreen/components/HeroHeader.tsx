/**
 * Hero Header Component - Profile Section Premium
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { haptics } from '../../../utils/haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface HeroHeaderProps {
  userName: string;
  userEmoji: string;
  totalGames: number;
  totalWins: number;
  level: number;
  onEditProfile?: () => void;
  onEmojiTap?: () => void;
}

const HeroHeader: React.FC<HeroHeaderProps> = ({
  userName,
  userEmoji,
  totalGames,
  totalWins,
  level,
  onEditProfile,
  onEmojiTap,
}) => {
  const handleEmojiPress = () => {
    haptics.light();
    onEmojiTap?.();
  };

  const handleEditPress = () => {
    haptics.light();
    onEditProfile?.();
  };

  return (
    <LinearGradient
      colors={['#4A90E2', '#5E3AEE', '#50C878']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Avatar */}
        <TouchableOpacity
          onPress={handleEmojiPress}
          style={styles.avatarContainer}
          activeOpacity={0.8}
        >
          <View style={styles.avatar}>
            <Text style={styles.emoji}>{userEmoji}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeEmoji}>👑</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* User Name */}
        <TouchableOpacity onPress={handleEditPress} activeOpacity={0.8}>
          <Text style={styles.userName}>
            {userName || 'Mon Profil'}
          </Text>
        </TouchableOpacity>

        {/* Stats Pills */}
        <View style={styles.statsContainer}>
          <View style={styles.statPill}>
            <Text style={styles.statEmoji}>🎲</Text>
            <Text style={styles.statValue}>{totalGames}</Text>
            <Text style={styles.statLabel}>parties</Text>
          </View>

          <View style={styles.statPill}>
            <Text style={styles.statEmoji}>🏆</Text>
            <Text style={styles.statValue}>{totalWins}</Text>
            <Text style={styles.statLabel}>victoires</Text>
          </View>

          <View style={styles.statPill}>
            <Text style={styles.statEmoji}>⭐</Text>
            <Text style={styles.statValue}>Lv{level}</Text>
            <Text style={styles.statLabel}>niveau</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingTop: 60,
    paddingBottom: 32,
  },
  content: {
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 10,
  },
  emoji: {
    fontSize: 40,
  },
  badge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeEmoji: {
    fontSize: 14,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 4,
  },
  statEmoji: {
    fontSize: 16,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
  },
});

export default HeroHeader;
