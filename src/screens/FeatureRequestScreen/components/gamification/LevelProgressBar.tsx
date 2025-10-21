/**
 * LevelProgressBar Component
 * Display current level with progress to next level
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../../../hooks/useTheme';
import type { Level } from '../../data/gamification';

interface Props {
  currentLevel: Level;
  nextLevel: Level | null;
  progressXP: number;
  neededXP: number;
  percentage: number;
  totalXP: number;
}

export const LevelProgressBar: React.FC<Props> = ({
  currentLevel,
  nextLevel,
  progressXP,
  neededXP,
  percentage,
  totalXP,
}) => {
  const { isDarkMode } = useTheme();

  const bgColor = isDarkMode ? '#2A2A2A' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : '#1A1A1A';
  const subtextColor = isDarkMode ? '#A0A0A0' : '#666666';
  const borderColor = isDarkMode ? '#3A3A3A' : '#E0E0E0';

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Current Level Badge */}
      <View style={styles.levelBadge}>
        <LinearGradient
          colors={[currentLevel.color, currentLevel.color + 'CC']}
          style={styles.levelGradient}
        >
          <Text style={styles.levelIcon}>{currentLevel.icon}</Text>
          <Text style={styles.levelNumber}>Niv. {currentLevel.level}</Text>
        </LinearGradient>
      </View>

      {/* Progress Info */}
      <View style={styles.progressInfo}>
        <View style={styles.titleRow}>
          <Text style={[styles.levelTitle, { color: textColor }]}>
            {currentLevel.title}
          </Text>
          <Text style={[styles.xpTotal, { color: subtextColor }]}>
            {totalXP.toLocaleString()} XP
          </Text>
        </View>

        {/* Progress Bar */}
        {nextLevel ? (
          <>
            <View style={[styles.progressTrack, { backgroundColor: borderColor }]}>
              <LinearGradient
                colors={[currentLevel.color, nextLevel.color]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: `${percentage}%` }]}
              />
            </View>

            <View style={styles.progressText}>
              <Text style={[styles.progressLabel, { color: subtextColor }]}>
                {progressXP.toLocaleString()} / {neededXP.toLocaleString()} XP
              </Text>
              <Text style={[styles.nextLevelText, { color: subtextColor }]}>
                Prochain: {nextLevel.title}
              </Text>
            </View>
          </>
        ) : (
          <Text style={[styles.maxLevelText, { color: subtextColor }]}>
            🌟 Niveau Maximum Atteint !
          </Text>
        )}
      </View>

      {/* Next Level Icon (if not max) */}
      {nextLevel && (
        <View style={styles.nextLevelBadge}>
          <Text style={styles.nextLevelIcon}>{nextLevel.icon}</Text>
          <Text style={[styles.nextLevelNumber, { color: subtextColor }]}>
            {nextLevel.level}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  levelBadge: {
    marginRight: 16,
  },
  levelGradient: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelIcon: {
    fontSize: 32,
  },
  levelNumber: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 2,
  },
  progressInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  xpTotal: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressTrack: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  nextLevelText: {
    fontSize: 12,
  },
  maxLevelText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  nextLevelBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    opacity: 0.7,
  },
  nextLevelIcon: {
    fontSize: 24,
  },
  nextLevelNumber: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
});
