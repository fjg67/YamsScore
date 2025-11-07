import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { StrategyTip, StrategyCategory } from '../src/types/learning';
import { StrategyLibraryService } from '../services/strategyLibraryService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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

interface StrategyLibraryScreenProps {
  onBack: () => void;
}

export const StrategyLibraryScreen: React.FC<StrategyLibraryScreenProps> = ({ onBack }) => {
  const [tips, setTips] = useState<StrategyTip[]>([]);
  const [filteredTips, setFilteredTips] = useState<StrategyTip[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<StrategyCategory | 'all'>('all');
  const [selectedTip, setSelectedTip] = useState<StrategyTip | null>(null);
  const [likedTips, setLikedTips] = useState<string[]>([]);
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    loadTips();
  }, []);

  useEffect(() => {
    filterTips();
  }, [selectedCategory, tips]);

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

  const loadTips = async () => {
    const library = await StrategyLibraryService.getLibrary();
    setTips(library.tips);
    setFilteredTips(library.tips);
    setLikedTips(library.userProgress.likedTips);
  };

  const filterTips = () => {
    if (selectedCategory === 'all') {
      setFilteredTips(tips);
    } else {
      setFilteredTips(tips.filter((tip) => tip.category === selectedCategory));
    }
  };

  const handleTipPress = async (tip: StrategyTip) => {
    setSelectedTip(tip);
    await StrategyLibraryService.markAsRead(tip.id);
  };

  const handleLike = async (tipId: string) => {
    const isLiked = await StrategyLibraryService.toggleLike(tipId);
    if (isLiked) {
      setLikedTips([...likedTips, tipId]);
    } else {
      setLikedTips(likedTips.filter((id) => id !== tipId));
    }
    // Recharger pour mettre à jour le compteur
    loadTips();
  };

  const getDifficultyColor = (difficulty: number): string => {
    if (difficulty <= 2) return '#4caf50';
    if (difficulty === 3) return '#ff9800';
    if (difficulty === 4) return '#f44336';
    return '#9c27b0';
  };

  const getTypeLabel = (type: string): string => {
    const labels: any = {
      basic: 'Débutant',
      intermediate: 'Intermédiaire',
      advanced: 'Avancé',
      expert: 'Expert',
    };
    return labels[type] || type;
  };

  return (
    <View style={styles.container}>
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

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📖 Bibliothèque Stratégies</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
      >
        <TouchableOpacity
          style={[styles.filterChip, selectedCategory === 'all' && styles.filterChipActive]}
          onPress={() => setSelectedCategory('all')}
        >
          <Text
            style={[styles.filterChipText, selectedCategory === 'all' && styles.filterChipTextActive]}
          >
            Toutes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, selectedCategory === 'general' && styles.filterChipActive]}
          onPress={() => setSelectedCategory('general')}
        >
          <Text style={styles.filterChipText}>🎯 Général</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, selectedCategory === 'bonus' && styles.filterChipActive]}
          onPress={() => setSelectedCategory('bonus')}
        >
          <Text style={styles.filterChipText}>⭐ Bonus</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, selectedCategory === 'upper_section' && styles.filterChipActive]}
          onPress={() => setSelectedCategory('upper_section')}
        >
          <Text style={styles.filterChipText}>🔢 Section Sup</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, selectedCategory === 'lower_section' && styles.filterChipActive]}
          onPress={() => setSelectedCategory('lower_section')}
        >
          <Text style={styles.filterChipText}>🎲 Section Inf</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Tips List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.tipsContainer}>
          {filteredTips.map((tip) => (
            <TouchableOpacity
              key={tip.id}
              onPress={() => handleTipPress(tip)}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.tipCard}
              >
                <View style={styles.tipHeader}>
                <View style={styles.tipTitleRow}>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                  {tip.isPremium && <Text style={styles.premiumBadge}>👑</Text>}
                </View>
                <View
                  style={[
                    styles.difficultyBadge,
                    { backgroundColor: getDifficultyColor(tip.difficulty) },
                  ]}
                >
                  <Text style={styles.difficultyText}>{getTypeLabel(tip.type)}</Text>
                </View>
              </View>

              <Text style={styles.tipDescription}>{tip.shortDescription}</Text>

              <View style={styles.tipFooter}>
                <View style={styles.tipStats}>
                  <Text style={styles.tipStat}>👁 {tip.views}</Text>
                  <Text style={styles.tipStat}>❤️ {tip.likes}</Text>
                </View>
                <Text style={styles.tipArrow}>→</Text>
              </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Tip Detail Modal */}
      <Modal visible={!!selectedTip} animationType="slide" onRequestClose={() => setSelectedTip(null)}>
        {selectedTip && (
          <View style={styles.modalContainer}>
            {/* Modal Gradient Background */}
            <LinearGradient
              colors={['#667eea', '#764ba2', '#f093fb', '#4facfe']}
              style={StyleSheet.absoluteFillObject}
            />

            {/* Modal Particles */}
            <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
              {Array.from({ length: 20 }).map((_, i) => (
                <FloatingParticle key={`modal-${i}`} delay={i * 200} />
              ))}
            </View>

            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setSelectedTip(null)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleLike(selectedTip.id)}>
                <Text style={styles.likeButton}>
                  {likedTips.includes(selectedTip.id) ? '❤️' : '🤍'} {selectedTip.likes}
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedTip.title}</Text>
              <Text style={styles.modalDescription}>{selectedTip.fullDescription}</Text>

              <View style={styles.keyPointsSection}>
                <Text style={styles.sectionTitle}>Points clés</Text>
                {selectedTip.keyPoints.map((point, index) => (
                  <View key={index} style={styles.keyPoint}>
                    <Text style={styles.keyPointBullet}>•</Text>
                    <Text style={styles.keyPointText}>{point}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.examplesSection}>
                <Text style={styles.sectionTitle}>Exemples</Text>
                {selectedTip.examples.map((example, index) => (
                  <LinearGradient
                    key={index}
                    colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.exampleCard}
                  >
                    <Text style={styles.exampleSituation}>{example.situation}</Text>
                    <View style={styles.diceContainer}>
                      {example.dice.map((value, i) => (
                        <View key={i} style={styles.diceBox}>
                          <Text style={styles.diceValue}>{['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][value - 1]}</Text>
                        </View>
                      ))}
                    </View>
                    <Text style={styles.exampleRecommendation}>✓ {example.recommendation}</Text>
                    <Text style={styles.exampleExplanation}>{example.explanation}</Text>
                  </LinearGradient>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e27' },
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
  },
  backButton: { width: 40 },
  backButtonText: {
    fontSize: 24,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  filtersContainer: {
    padding: 16,
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterChipActive: {
    backgroundColor: 'rgba(76, 175, 80, 0.8)',
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#4caf50',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  filterChipText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
    opacity: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  filterChipTextActive: {
    color: '#fff',
    fontWeight: '700',
    opacity: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  scrollView: { flex: 1 },
  tipsContainer: { padding: 16, paddingTop: 0 },
  tipCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  tipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipTitleRow: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  premiumBadge: { fontSize: 16, marginLeft: 8 },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  difficultyText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  tipDescription: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 12,
    lineHeight: 20,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  tipFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tipStats: { flexDirection: 'row', gap: 16 },
  tipStat: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  tipArrow: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  modalContainer: { flex: 1, backgroundColor: '#0a0e27' },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
  },
  modalClose: {
    fontSize: 24,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  likeButton: {
    fontSize: 16,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  modalContent: { flex: 1, padding: 16 },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  modalDescription: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
    marginBottom: 24,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  keyPointsSection: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  keyPoint: { flexDirection: 'row', marginBottom: 8 },
  keyPointBullet: { fontSize: 16, color: '#4caf50', marginRight: 8 },
  keyPointText: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  examplesSection: { marginBottom: 24 },
  exampleCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  exampleSituation: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  diceContainer: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  diceBox: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diceValue: { fontSize: 24 },
  exampleRecommendation: {
    fontSize: 14,
    color: '#4caf50',
    fontWeight: '600',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  exampleExplanation: {
    fontSize: 13,
    color: '#fff',
    lineHeight: 18,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
