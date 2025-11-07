import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Player } from '../../../types/game';

interface BottomIndicatorProps {
  currentPlayer: Player;
  currentTurn: number;
  totalTurns: number;
}

const BottomIndicator: React.FC<BottomIndicatorProps> = ({
  currentPlayer,
  currentTurn,
  totalTurns,
}) => {
  const progressWidth = useRef(new Animated.Value(0)).current;
  const avatarScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animate progress bar
    const progress = currentTurn / totalTurns;
    Animated.timing(progressWidth, {
      toValue: progress,
      duration: 600,
      useNativeDriver: false,
    }).start();

    // Pulse avatar
    Animated.sequence([
      Animated.timing(avatarScale, {
        toValue: 1.15,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(avatarScale, {
        toValue: 1.0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentTurn, totalTurns, progressWidth, avatarScale]);

  const progressPercentage = Math.round((currentTurn / totalTurns) * 100);

  // Get initials
  const initials = currentPlayer.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <View style={styles.container}>
      {/* Current player indicator */}
      <View style={styles.playerSection}>
        <Animated.View
          style={[
            styles.miniAvatar,
            {
              backgroundColor: currentPlayer.color,
              transform: [{ scale: avatarScale }],
            },
          ]}
        >
          <Text style={styles.miniAvatarText}>{initials}</Text>
        </Animated.View>
        <Text style={styles.playerMessage}>
          {currentPlayer.name}, <Text style={styles.playerMessageBold}>à toi !</Text>
        </Text>
      </View>

      {/* Progress section */}
      <View style={styles.progressSection}>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: progressWidth.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            >
              <LinearGradient
                colors={['#4A90E2', '#5DADE2', '#50C878']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
              />
            </Animated.View>
          </View>
        </View>
        <Text style={styles.progressText}>{progressPercentage}%</Text>
      </View>

      {/* Turn indicator */}
      <View style={styles.turnSection}>
        <Text style={styles.turnText}>
          Tour {currentTurn}/{totalTurns}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderTopWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.4)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  playerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  miniAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  miniAvatarText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  playerMessage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  playerMessageBold: {
    fontWeight: '800',
  },
  progressSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    marginRight: 16,
    gap: 12,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
  },
  progressBarBackground: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: 'System',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  turnSection: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  turnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: 'System',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});

export default BottomIndicator;
