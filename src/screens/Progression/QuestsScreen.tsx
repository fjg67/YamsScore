import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Quest, QuestObjective } from '../../types/progression';
import { QuestService } from '../../services/QuestService';
import { ProgressionService } from '../../services/ProgressionService';
import { QuestTrackerService } from '../../services/QuestTrackerService';

const { width, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SCREEN_WIDTH = width;

// Floating particles component
const FloatingParticle = ({ delay = 0 }: { delay?: number }) => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const translateX = useRef(new Animated.Value(Math.random() * SCREEN_WIDTH)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5 + Math.random() * 0.5)).current;

  useEffect(() => {
    const animate = () => {
      translateY.setValue(SCREEN_HEIGHT);
      translateX.setValue(Math.random() * SCREEN_WIDTH);
      opacity.setValue(0);

      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -100,
            duration: 8000 + Math.random() * 4000,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.15 + Math.random() * 0.15,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.8 + Math.random() * 0.4,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };

    animate();
  }, [delay, translateY, translateX, opacity, scale]);

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          transform: [
            { translateX },
            { translateY },
            { scale },
          ],
          opacity,
        },
      ]}
    />
  );
};

interface QuestsScreenProps {
  onBack?: () => void;
}

export const QuestsScreen: React.FC<QuestsScreenProps> = ({ onBack }) => {
  const [dailyQuests, setDailyQuests] = useState<Quest[]>([]);
  const [weeklyQuests, setWeeklyQuests] = useState<Quest[]>([]);
  const [monthlyQuest, setMonthlyQuest] = useState<Quest | null>(null);
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    loadQuests();
  }, []);

  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.6,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    pulse();
  }, [glowAnim]);

  const loadQuests = async () => {
    // Vérifier et renouveler les quêtes expirées
    await QuestTrackerService.checkAndRefreshQuests();

    // Charger les quêtes actives
    const quests = await QuestTrackerService.getActiveQuests();

    setDailyQuests(quests.daily);
    setWeeklyQuests(quests.weekly);
    setMonthlyQuest(quests.monthly);
  };

  const claimReward = async (quest: Quest) => {
    if (!quest.completed || quest.claimed) return;

    const progressionService = ProgressionService.getInstance();

    // Réclamer la quête via le tracker
    const claimedQuest = await QuestTrackerService.claimQuestRewards(quest.id);

    if (claimedQuest) {
      // Appliquer les récompenses au joueur
      await progressionService.applyQuestRewards(claimedQuest.rewards);

      // Mettre à jour les stats
      const profile = await progressionService.getProfile();
      profile.questsCompleted++;
      await progressionService.saveProfile(profile);

      // Recharger les quêtes pour afficher la mise à jour
      await loadQuests();
    }
  };

  const getDifficultyColor = (difficulty: Quest['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return ['#4ade80', '#22c55e'];
      case 'medium':
        return ['#60a5fa', '#3b82f6'];
      case 'hard':
        return ['#f59e0b', '#d97706'];
      case 'epic':
        return ['#a855f7', '#7c3aed'];
      default:
        return ['#6b7280', '#4b5563'];
    }
  };

  const getDifficultyLabel = (difficulty: Quest['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return 'Facile';
      case 'medium':
        return 'Moyen';
      case 'hard':
        return 'Difficile';
      case 'epic':
        return 'Épique';
      default:
        return '';
    }
  };

  const renderQuestCard = (quest: Quest) => {
    const allObjectivesComplete = quest.objectives.every((obj) => obj.completed);

    return (
      <View key={quest.id} style={styles.questCard}>
        <LinearGradient
          colors={getDifficultyColor(quest.difficulty)}
          style={styles.questGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.questHeader}>
            <View>
              <Text style={styles.questName}>{quest.name}</Text>
              <Text style={styles.questDifficulty}>
                {getDifficultyLabel(quest.difficulty)}
              </Text>
            </View>
            {quest.completed && (
              <Text style={styles.completedBadge}>✓ COMPLÉTÉ</Text>
            )}
          </View>

          <Text style={styles.questDescription}>{quest.description}</Text>

          {/* Objectifs */}
          <View style={styles.objectivesContainer}>
            {quest.objectives.map((obj) => (
              <View key={obj.id} style={styles.objectiveItem}>
                <View style={styles.objectiveHeader}>
                  <Text style={styles.objectiveText}>
                    {obj.completed ? '✓' : '○'} {obj.description}
                  </Text>
                  <Text style={styles.objectiveProgress}>
                    {obj.current} / {obj.target}
                  </Text>
                </View>
                <View style={styles.objectiveBarBg}>
                  <View
                    style={[
                      styles.objectiveBarFill,
                      { width: `${(obj.current / obj.target) * 100}%` },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>

          {/* Récompenses */}
          <View style={styles.rewardsContainer}>
            <Text style={styles.rewardsTitle}>Récompenses:</Text>
            <View style={styles.rewardsList}>
              <View style={styles.rewardItem}>
                <Text style={styles.rewardIcon}>⭐</Text>
                <Text style={styles.rewardText}>{quest.rewards.xp} XP</Text>
              </View>
              {quest.rewards.coins && (
                <View style={styles.rewardItem}>
                  <Text style={styles.rewardIcon}>💰</Text>
                  <Text style={styles.rewardText}>{quest.rewards.coins} Coins</Text>
                </View>
              )}
              {quest.rewards.battlePassXP && (
                <View style={styles.rewardItem}>
                  <Text style={styles.rewardIcon}>🎫</Text>
                  <Text style={styles.rewardText}>{quest.rewards.battlePassXP} BP XP</Text>
                </View>
              )}
            </View>
          </View>

          {/* Bouton réclamer */}
          {allObjectivesComplete && !quest.claimed && (
            <TouchableOpacity
              style={styles.claimButton}
              onPress={() => claimReward(quest)}
            >
              <Text style={styles.claimButtonText}>Réclamer les récompenses</Text>
            </TouchableOpacity>
          )}

          {quest.claimed && (
            <View style={styles.claimedContainer}>
              <Text style={styles.claimedText}>✓ Récompenses réclamées</Text>
            </View>
          )}
        </LinearGradient>
      </View>
    );
  };

  return (
    <View style={styles.fullContainer}>
      {/* Gradient Background */}
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb', '#4facfe']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Glow Effect */}
      <Animated.View
        style={[
          styles.glowEffect,
          {
            opacity: glowAnim,
          },
        ]}
      />

      {/* Floating Particles */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        {Array.from({ length: 20 }).map((_, i) => (
          <FloatingParticle key={i} delay={i * 200} />
        ))}
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.header}>
          {/* Bouton Retour Premium */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
              style={styles.backButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.backButtonIcon}>←</Text>
              <Text style={styles.backButtonText}>Retour</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>📜 Quêtes</Text>
          <Text style={styles.headerSubtitle}>
            Complétez les quêtes pour gagner des récompenses
          </Text>
        </View>

      {/* Quêtes Quotidiennes */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quêtes Quotidiennes</Text>
          <Text style={styles.sectionSubtitle}>Se renouvellent chaque jour</Text>
        </View>
        {dailyQuests.map((quest) => renderQuestCard(quest))}
      </View>

      {/* Quêtes Hebdomadaires */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quêtes Hebdomadaires</Text>
          <Text style={styles.sectionSubtitle}>Se renouvellent chaque semaine</Text>
        </View>
        {weeklyQuests.map((quest) => renderQuestCard(quest))}
      </View>

      {/* Méga-Quête Mensuelle */}
      {monthlyQuest && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Méga-Quête Mensuelle</Text>
            <Text style={styles.sectionSubtitle}>
              Défi ultime du mois - Récompenses massives !
            </Text>
          </View>
          {renderQuestCard(monthlyQuest)}
        </View>
      )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  glowEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderTopWidth: 0,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  backButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  backButtonIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 6,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  sectionSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  questCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  questGradient: {
    padding: 20,
  },
  questHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  questName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  questDifficulty: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginTop: 4,
  },
  completedBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  questDescription: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 16,
    marginBottom: 16,
  },
  objectivesContainer: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  objectiveItem: {
    marginBottom: 12,
  },
  objectiveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  objectiveText: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  objectiveProgress: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  objectiveBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  objectiveBarFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  rewardsContainer: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  rewardsTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  rewardsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  rewardIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  rewardText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  claimButton: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  claimButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: 'bold',
  },
  claimedContainer: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  claimedText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
