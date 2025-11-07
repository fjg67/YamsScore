import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Player } from '../../../types/game';

interface PlayerHeaderProps {
  player: Player;
  grandTotal: number;
  position: number;
  isActive: boolean;
  columnWidth: number;
}

const PlayerHeader: React.FC<PlayerHeaderProps> = ({
  player,
  grandTotal,
  position,
  isActive,
  columnWidth,
}) => {
  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1.0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Glow animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
      glowAnim.setValue(0);
    }
  }, [isActive, pulseAnim, glowAnim]);

  const getPositionEmoji = (pos: number): string => {
    switch (pos) {
      case 1:
        return '🏆';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '';
    }
  };

  const getPositionStyle = (pos: number) => {
    switch (pos) {
      case 1:
        return styles.positionBadge1;
      case 2:
        return styles.positionBadge2;
      case 3:
        return styles.positionBadge3;
      default:
        return styles.positionBadgeDefault;
    }
  };

  // Get initials
  const initials = player.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <View style={[styles.container, isActive && styles.containerActive, { width: columnWidth }]}>
      {/* Active badge */}
      {isActive && (
        <View style={[styles.activeBadge, { backgroundColor: player.color }]}>
          <Text style={styles.activeBadgeText}>À TOI !</Text>
        </View>
      )}

      {/* Avatar */}
      <Animated.View
        style={[
          styles.avatarContainer,
          {
            transform: [{ scale: isActive ? pulseAnim : 1 }],
          },
        ]}
      >
        <LinearGradient
          colors={[player.color, player.color]}
          style={[
            styles.avatar,
            isActive && {
              shadowColor: player.color,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.5,
              shadowRadius: 12,
              elevation: 12,
            },
          ]}
        >
          <View style={styles.glossOverlay} />
          <Text style={styles.avatarText}>{initials}</Text>
        </LinearGradient>
      </Animated.View>

      {/* Player name */}
      <Text style={styles.playerName} numberOfLines={1} ellipsizeMode="tail">
        {player.name}
      </Text>

      {/* Grand total */}
      <Text style={[styles.grandTotal, position === 1 && styles.grandTotalLeader]}>
        {grandTotal}
      </Text>

      {/* Position badge */}
      <View style={[styles.positionBadge, getPositionStyle(position)]}>
        <Text style={styles.positionText}>
          {getPositionEmoji(position)} {position}
          {position === 1 ? 'er' : 'e'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRightWidth: 2,
    borderRightColor: 'rgba(255, 255, 255, 0.3)',
  },
  containerActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderRightWidth: 2,
    borderRightColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeBadge: {
    position: 'absolute',
    top: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  activeBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  avatarContainer: {
    marginTop: 16,
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  glossOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    zIndex: 1,
  },
  playerName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    maxWidth: 80,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  grandTotal: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
    fontFamily: 'System',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  grandTotalLeader: {
    color: '#FFD700',
    textShadowColor: 'rgba(255, 215, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  positionBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    minWidth: 50,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  positionBadge1: {
    backgroundColor: '#FFD700',
    borderColor: 'rgba(255, 215, 0, 0.6)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  positionBadge2: {
    backgroundColor: '#C0C0C0',
    borderColor: 'rgba(192, 192, 192, 0.6)',
  },
  positionBadge3: {
    backgroundColor: '#CD7F32',
    borderColor: 'rgba(205, 127, 50, 0.6)',
  },
  positionBadgeDefault: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  positionText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default PlayerHeader;
