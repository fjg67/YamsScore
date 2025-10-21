/**
 * Achievements Screen - Badges & Accomplissements
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { haptics } from '../utils/haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  total?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedDate?: string;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_game',
    title: 'Première Partie',
    description: 'Joue ta première partie',
    icon: '🎲',
    unlocked: true,
    rarity: 'common',
    unlockedDate: '15 oct 2025',
  },
  {
    id: 'yams_master',
    title: 'Maître du Yams',
    description: 'Fais un Yams (5 dés identiques)',
    icon: '🎯',
    unlocked: true,
    rarity: 'rare',
    unlockedDate: '18 oct 2025',
  },
  {
    id: 'full_house',
    title: 'Full House',
    description: 'Réalise un Full (brelan + paire)',
    icon: '🏠',
    unlocked: true,
    rarity: 'common',
    unlockedDate: '16 oct 2025',
  },
  {
    id: 'win_streak',
    title: 'Série Victorieuse',
    description: 'Gagne 3 parties d\'affilée',
    icon: '🔥',
    unlocked: false,
    progress: 2,
    total: 3,
    rarity: 'rare',
  },
  {
    id: 'perfect_score',
    title: 'Score Parfait',
    description: 'Atteins 300+ points',
    icon: '⭐',
    unlocked: false,
    progress: 287,
    total: 300,
    rarity: 'epic',
  },
  {
    id: 'speed_demon',
    title: 'Rapide comme l\'éclair',
    description: 'Termine une partie en moins de 5 min',
    icon: '⚡',
    unlocked: false,
    rarity: 'rare',
  },
  {
    id: '10_games',
    title: 'Joueur Régulier',
    description: 'Joue 10 parties',
    icon: '🎮',
    unlocked: true,
    rarity: 'common',
    unlockedDate: '19 oct 2025',
  },
  {
    id: 'double_yams',
    title: 'Double Yams',
    description: 'Fais 2 Yams dans une partie',
    icon: '💎',
    unlocked: false,
    rarity: 'legendary',
  },
  {
    id: 'comeback_king',
    title: 'Roi du Comeback',
    description: 'Remporte une victoire avec -50 au milieu',
    icon: '👑',
    unlocked: false,
    rarity: 'epic',
  },
  {
    id: 'customizer',
    title: 'Personnalisateur',
    description: 'Change 5 paramètres',
    icon: '🎨',
    unlocked: true,
    rarity: 'common',
    unlockedDate: '21 oct 2025',
  },
  {
    id: 'dedicated',
    title: 'Dédié',
    description: 'Joue 7 jours d\'affilée',
    icon: '📅',
    unlocked: false,
    progress: 3,
    total: 7,
    rarity: 'rare',
  },
  {
    id: 'lucky_seven',
    title: 'Chanceux',
    description: 'Lance 5 fois le même chiffre',
    icon: '🍀',
    unlocked: false,
    rarity: 'rare',
  },
];

const RARITY_COLORS = {
  common: ['#95A5A6', '#7F8C8D'],
  rare: ['#3498DB', '#2980B9'],
  epic: ['#9B59B6', '#8E44AD'],
  legendary: ['#F39C12', '#E67E22'],
};

const AchievementsScreen: React.FC = () => {
  const navigation = useNavigation();

  const unlockedCount = ACHIEVEMENTS.filter((a) => a.unlocked).length;
  const totalCount = ACHIEVEMENTS.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  const handleBack = () => {
    haptics.light();
    navigation.goBack();
  };

  const handleAchievementPress = (achievement: Achievement) => {
    if (achievement.unlocked) {
      haptics.light();
    } else {
      haptics.selection();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#FFD700', '#FFA500']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.headerEmoji}>🏅</Text>
          <Text style={styles.headerTitle}>Mes Achievements</Text>
          <Text style={styles.headerSubtitle}>
            {unlockedCount} / {totalCount} débloqués
          </Text>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${completionPercentage}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>{completionPercentage}%</Text>
        </View>
      </LinearGradient>

      {/* Achievements List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {ACHIEVEMENTS.map((achievement) => (
          <TouchableOpacity
            key={achievement.id}
            style={[
              styles.achievementCard,
              !achievement.unlocked && styles.achievementCardLocked,
            ]}
            onPress={() => handleAchievementPress(achievement)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={RARITY_COLORS[achievement.rarity]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.achievementIconContainer}
            >
              <Text style={styles.achievementIcon}>{achievement.icon}</Text>
              {!achievement.unlocked && (
                <View style={styles.lockedOverlay}>
                  <Text style={styles.lockIcon}>🔒</Text>
                </View>
              )}
            </LinearGradient>

            <View style={styles.achievementContent}>
              <View style={styles.achievementHeader}>
                <Text
                  style={[
                    styles.achievementTitle,
                    !achievement.unlocked && styles.achievementTitleLocked,
                  ]}
                >
                  {achievement.title}
                </Text>
                {achievement.unlocked && (
                  <View style={styles.checkBadge}>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                )}
              </View>

              <Text
                style={[
                  styles.achievementDescription,
                  !achievement.unlocked && styles.achievementDescriptionLocked,
                ]}
              >
                {achievement.description}
              </Text>

              {/* Progress (if not unlocked and has progress) */}
              {!achievement.unlocked &&
                achievement.progress !== undefined &&
                achievement.total !== undefined && (
                  <View style={styles.progressContainer}>
                    <View style={styles.miniProgressBar}>
                      <View
                        style={[
                          styles.miniProgressFill,
                          {
                            width: `${
                              (achievement.progress / achievement.total) * 100
                            }%`,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressLabel}>
                      {achievement.progress} / {achievement.total}
                    </Text>
                  </View>
                )}

              {/* Unlocked Date */}
              {achievement.unlocked && achievement.unlockedDate && (
                <Text style={styles.unlockedDate}>
                  Débloqué le {achievement.unlockedDate}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerEmoji: {
    fontSize: 60,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 16,
  },
  progressBarContainer: {
    width: '80%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  achievementCardLocked: {
    opacity: 0.6,
  },
  achievementIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    position: 'relative',
  },
  achievementIcon: {
    fontSize: 32,
  },
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIcon: {
    fontSize: 24,
  },
  achievementContent: {
    flex: 1,
    justifyContent: 'center',
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    flex: 1,
  },
  achievementTitleLocked: {
    color: '#999999',
  },
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#50C878',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  achievementDescriptionLocked: {
    color: '#999999',
  },
  progressContainer: {
    marginTop: 8,
  },
  miniProgressBar: {
    height: 4,
    backgroundColor: '#E8E8E8',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  miniProgressFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 2,
  },
  progressLabel: {
    fontSize: 12,
    color: '#999999',
  },
  unlockedDate: {
    fontSize: 12,
    color: '#50C878',
    marginTop: 4,
  },
});

export default AchievementsScreen;
