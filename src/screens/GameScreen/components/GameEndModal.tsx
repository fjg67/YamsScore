/**
 * GameEndModal Component
 * Modal de fin de partie avec achievements et redirection vers l'historique
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CompletedQuest {
  id: string;
  name: string;
  description: string;
  rewards: {
    xp: number;
    coins?: number;
  };
}

interface GameEndModalProps {
  visible: boolean;
  winnerName: string;
  winnerScore: number;
  completedQuests: CompletedQuest[];
  levelUp?: boolean;
  newLevel?: number;
  totalXP: number;
  onViewHistory: () => void;
  onClose: () => void;
}

const GameEndModal: React.FC<GameEndModalProps> = ({
  visible,
  winnerName,
  winnerScore,
  completedQuests,
  levelUp,
  newLevel,
  totalXP,
  onViewHistory,
  onClose,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const trophyScaleAnim = useRef(new Animated.Value(0)).current;
  const questsOpacityAnim = useRef(new Animated.Value(0)).current;
  const buttonsOpacityAnim = useRef(new Animated.Value(0)).current;
  const confettiAnims = useRef(
    Array.from({ length: 20 }, () => ({
      translateY: new Animated.Value(0),
      translateX: new Animated.Value(0),
      rotate: new Animated.Value(0),
      opacity: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    if (visible) {
      // Reset animations
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      trophyScaleAnim.setValue(0);
      questsOpacityAnim.setValue(0);
      buttonsOpacityAnim.setValue(0);

      // Start animations sequence
      Animated.sequence([
        // 1. Fade in background
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        // 2. Scale in modal
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // 3. Trophy bounce
        Animated.spring(trophyScaleAnim, {
          toValue: 1,
          tension: 40,
          friction: 5,
          useNativeDriver: true,
        }).start();

        // 4. Show quests
        setTimeout(() => {
          Animated.timing(questsOpacityAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();
        }, 300);

        // 5. Show buttons
        setTimeout(() => {
          Animated.timing(buttonsOpacityAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();
        }, 600);

        // 6. Confetti animation
        confettiAnims.forEach((anim, index) => {
          const startX = Math.random() * SCREEN_WIDTH;
          const endX = startX + (Math.random() - 0.5) * 200;

          anim.translateX.setValue(startX);
          anim.translateY.setValue(-50);
          anim.opacity.setValue(0);

          Animated.sequence([
            Animated.delay(index * 50),
            Animated.parallel([
              Animated.timing(anim.translateY, {
                toValue: SCREEN_HEIGHT,
                duration: 3000 + Math.random() * 2000,
                useNativeDriver: true,
              }),
              Animated.timing(anim.translateX, {
                toValue: endX,
                duration: 3000 + Math.random() * 2000,
                useNativeDriver: true,
              }),
              Animated.timing(anim.rotate, {
                toValue: 360 * (Math.random() > 0.5 ? 1 : -1),
                duration: 2000,
                useNativeDriver: true,
              }),
              Animated.sequence([
                Animated.timing(anim.opacity, {
                  toValue: 1,
                  duration: 500,
                  useNativeDriver: true,
                }),
                Animated.timing(anim.opacity, {
                  toValue: 0,
                  duration: 500,
                  delay: 2000,
                  useNativeDriver: true,
                }),
              ]),
            ]),
          ]).start();
        });
      });
    }
  }, [visible]);

  const handleViewHistory = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onViewHistory();
    });
  };

  const confettiColors = ['#FFD700', '#FFA500', '#FF6B6B', '#4A90E2', '#50C878', '#9B59B6'];

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[styles.container, { opacity: opacityAnim }]}>
        {/* Background blur */}
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="dark"
          blurAmount={10}
          reducedTransparencyFallbackColor="rgba(0,0,0,0.9)"
        />

        {/* Confetti */}
        {confettiAnims.map((anim, index) => (
          <Animated.View
            key={index}
            style={[
              styles.confetti,
              {
                backgroundColor: confettiColors[index % confettiColors.length],
                transform: [
                  { translateX: anim.translateX },
                  { translateY: anim.translateY },
                  {
                    rotate: anim.rotate.interpolate({
                      inputRange: [0, 360],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
                opacity: anim.opacity,
              },
            ]}
          />
        ))}

        {/* Main content */}
        <Animated.View
          style={[
            styles.content,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.95)', 'rgba(30,30,30,0.95)']}
            style={styles.gradient}
          >
            {/* Trophy icon */}
            <Animated.View
              style={{
                transform: [{ scale: trophyScaleAnim }],
              }}
            >
              <Text style={styles.trophy}>🏆</Text>
            </Animated.View>

            {/* Winner info */}
            <Text style={styles.title}>Partie Terminée !</Text>
            <Text style={styles.winner}>{winnerName} remporte</Text>
            <Text style={styles.score}>{winnerScore} points</Text>

            {/* Level up badge */}
            {levelUp && newLevel && (
              <View style={styles.levelUpBadge}>
                <LinearGradient
                  colors={['#FFD700', '#FFA500']}
                  style={styles.levelUpGradient}
                >
                  <Text style={styles.levelUpText}>⭐ LEVEL {newLevel} ⭐</Text>
                </LinearGradient>
              </View>
            )}

            {/* Completed quests */}
            {completedQuests.length > 0 && (
              <Animated.View style={[styles.questsContainer, { opacity: questsOpacityAnim }]}>
                <Text style={styles.questsTitle}>🎯 Quêtes Complétées</Text>
                <ScrollView
                  style={styles.questsScroll}
                  contentContainerStyle={styles.questsScrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  {completedQuests.map((quest, index) => (
                    <View key={quest.id} style={styles.questCard}>
                      <View style={styles.questHeader}>
                        <Text style={styles.questName}>{quest.name}</Text>
                        <Text style={styles.questCheck}>✓</Text>
                      </View>
                      <Text style={styles.questDescription}>{quest.description}</Text>
                      <View style={styles.questRewards}>
                        <Text style={styles.questReward}>+{quest.rewards.xp} XP</Text>
                        {quest.rewards.coins && quest.rewards.coins > 0 && (
                          <Text style={styles.questReward}>+{quest.rewards.coins} 💰</Text>
                        )}
                      </View>
                    </View>
                  ))}
                </ScrollView>
                <View style={styles.totalXP}>
                  <Text style={styles.totalXPText}>Total: +{totalXP} XP</Text>
                </View>
              </Animated.View>
            )}

            {/* No quests message */}
            {completedQuests.length === 0 && (
              <Animated.View style={[styles.noQuestsContainer, { opacity: questsOpacityAnim }]}>
                <Text style={styles.noQuestsText}>Aucune quête complétée cette fois</Text>
                <Text style={styles.noQuestsSubtext}>Continuez à jouer pour débloquer des récompenses !</Text>
              </Animated.View>
            )}

            {/* Buttons */}
            <Animated.View style={[styles.buttonsContainer, { opacity: buttonsOpacityAnim }]}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleViewHistory}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#4A90E2', '#357ABD']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.primaryButtonText}>📊 Voir l'Historique</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text style={styles.secondaryButtonText}>Fermer</Text>
              </TouchableOpacity>
            </Animated.View>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  confetti: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  content: {
    width: SCREEN_WIDTH * 0.9,
    maxWidth: 450,
    maxHeight: SCREEN_HEIGHT * 0.85,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  gradient: {
    padding: 25,
    alignItems: 'center',
  },
  trophy: {
    fontSize: 80,
    marginBottom: 15,
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFD700',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  winner: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 5,
    textAlign: 'center',
  },
  score: {
    fontSize: 36,
    fontWeight: '900',
    color: '#4A90E2',
    marginBottom: 20,
    textAlign: 'center',
  },
  levelUpBadge: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  levelUpGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  levelUpText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000',
    textAlign: 'center',
  },
  questsContainer: {
    width: '100%',
    maxHeight: 300,
    marginBottom: 20,
  },
  questsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: 15,
    textAlign: 'center',
  },
  questsScroll: {
    maxHeight: 220,
  },
  questsScrollContent: {
    paddingBottom: 10,
  },
  questCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  questHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  questName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  questCheck: {
    fontSize: 20,
    color: '#50C878',
    marginLeft: 10,
  },
  questDescription: {
    fontSize: 13,
    color: '#CCCCCC',
    marginBottom: 10,
    lineHeight: 18,
  },
  questRewards: {
    flexDirection: 'row',
    gap: 10,
  },
  questReward: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  totalXP: {
    marginTop: 10,
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 215, 0, 0.3)',
  },
  totalXPText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFD700',
  },
  noQuestsContainer: {
    width: '100%',
    paddingVertical: 30,
    alignItems: 'center',
  },
  noQuestsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#CCCCCC',
    marginBottom: 8,
    textAlign: 'center',
  },
  noQuestsSubtext: {
    fontSize: 13,
    color: '#999999',
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default GameEndModal;
