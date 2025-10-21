/**
 * Carte joueur individuelle avec avatar et score
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { premiumTheme } from '../../../theme/premiumTheme';
import { PlayerBadgeData } from '../../../types/premium.types';
import GlassmorphicCard from '../../shared/GlassmorphicCard';

interface PlayerBadgeCardProps {
  data: PlayerBadgeData;
}

const PlayerBadgeCard: React.FC<PlayerBadgeCardProps> = ({ data }) => {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  // Animation quand le joueur est actif
  useEffect(() => {
    if (data.isActive) {
      scale.value = withSpring(1.05, { damping: 10 });
      rotation.value = withSequence(
        withTiming(2, { duration: 100 }),
        withTiming(-2, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );
    } else {
      scale.value = withSpring(1);
    }
  }, [data.isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotateZ: `${rotation.value}deg` },
    ],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <GlassmorphicCard
        style={styles.card}
        borderColor={data.color}
        borderWidth={data.isActive ? 3 : 2}
        shadowColor={data.isActive ? data.color : undefined}
      >
        {/* Avatar */}
        <View style={[styles.avatarContainer, { borderColor: data.color }]}>
          <Text style={styles.avatarEmoji}>{data.avatar}</Text>
        </View>

        {/* Couronne si en tête */}
        {data.isWinning && (
          <View style={styles.crownContainer}>
            <Text style={styles.crown}>👑</Text>
          </View>
        )}

        {/* Nom du joueur */}
        <Text style={styles.name} numberOfLines={1}>
          {data.name}
        </Text>

        {/* Score */}
        <Text style={[styles.score, { color: data.color }]}>
          {data.score}
        </Text>

        {/* Position */}
        {data.position <= 3 && (
          <View style={styles.positionBadge}>
            <Text style={styles.positionText}>#{data.position}</Text>
          </View>
        )}
      </GlassmorphicCard>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: premiumTheme.spacing.badgeSpacing / 2,
  },
  card: {
    width: premiumTheme.sizes.playerBadge.width,
    height: premiumTheme.sizes.playerBadge.height,
    alignItems: 'center',
    paddingVertical: premiumTheme.spacing.sm,
    backgroundColor: '#FFFFFF',
  },
  avatarContainer: {
    width: premiumTheme.sizes.playerBadge.avatarSize,
    height: premiumTheme.sizes.playerBadge.avatarSize,
    borderRadius: premiumTheme.sizes.playerBadge.avatarSize / 2,
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...premiumTheme.colors.shadows.soft,
  },
  avatarEmoji: {
    fontSize: 28,
  },
  crownContainer: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...premiumTheme.colors.shadows.soft,
  },
  crown: {
    fontSize: 16,
  },
  name: {
    marginTop: premiumTheme.spacing.sm,
    fontSize: premiumTheme.typography.fontSize.md,
    fontWeight: '600',
    color: premiumTheme.colors.ui.textPrimary,
    maxWidth: premiumTheme.sizes.playerBadge.width - 16,
    textAlign: 'center',
  },
  score: {
    marginTop: premiumTheme.spacing.xs,
    fontSize: premiumTheme.typography.fontSize.xxl,
    fontWeight: 'bold',
  },
  positionBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(74,144,226,0.1)',
    borderRadius: premiumTheme.borderRadius.sm,
    paddingHorizontal: premiumTheme.spacing.xs,
    paddingVertical: 2,
  },
  positionText: {
    fontSize: premiumTheme.typography.fontSize.xs,
    color: '#4A90E2',
    fontWeight: '600',
  },
});

export default PlayerBadgeCard;
