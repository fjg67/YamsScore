import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type AIDifficulty = 'easy' | 'normal' | 'hard';

interface DifficultyOption {
  value: AIDifficulty;
  emoji: string;
  title: string;
  description: string;
  gradient: string[];
  lightColor: string;
  shadowColor: string;
}

const DIFFICULTIES: DifficultyOption[] = [
  {
    value: 'easy',
    emoji: '🌱',
    title: 'Facile',
    description: 'IA débutante, idéale pour apprendre les bases du Yams',
    gradient: ['#A8E6CF', '#56C596', '#4CAF50'],
    lightColor: '#E8F5E9',
    shadowColor: '#4CAF50',
  },
  {
    value: 'normal',
    emoji: '⚡',
    title: 'Normal',
    description: 'IA équilibrée qui vous offrira un bon défi stratégique',
    gradient: ['#FFD97D', '#FFA726', '#FF9800'],
    lightColor: '#FFF3E0',
    shadowColor: '#FF9800',
  },
  {
    value: 'hard',
    emoji: '🔥',
    title: 'Difficile',
    description: 'IA experte avec une stratégie redoutable et optimale',
    gradient: ['#FF8A80', '#F44336', '#D32F2F'],
    lightColor: '#FFEBEE',
    shadowColor: '#F44336',
  },
];

interface DifficultyScreenProps {
  selected?: AIDifficulty;
  onSelect: (difficulty: AIDifficulty) => void;
  onBack: () => void;
}

const DifficultyScreen: React.FC<DifficultyScreenProps> = ({
  selected,
  onSelect,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const [selectedDifficulty, setSelectedDifficulty] = useState<AIDifficulty | undefined>(selected);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleSelect = (difficulty: AIDifficulty) => {
    setSelectedDifficulty(difficulty);
    // Animation de sélection puis navigation
    setTimeout(() => {
      onSelect(difficulty);
    }, 400);
  };

  return (
    <View style={styles.safeArea}>
      <LinearGradient
        colors={['#F0F4FF', '#E8F0FE', '#FFFFFF', '#FFF8F0']}
        locations={[0, 0.3, 0.6, 1]}
        style={styles.gradient}
      >
        <View style={styles.container}>
          {/* Header avec bouton retour */}
          <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <LinearGradient
                colors={['#E3F2FD', '#BBDEFB']}
                style={styles.backButtonGradient}
              >
                <Text style={styles.backText}>← Retour</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              style={[
                styles.content,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              {/* Titre principal */}
              <View style={styles.titleSection}>
                <View style={styles.emojiContainer}>
                  <LinearGradient
                    colors={['#FFE082', '#FFD54F', '#FFC107']}
                    style={styles.emojiGradient}
                  >
                    <Text style={styles.titleEmoji}>🤖</Text>
                  </LinearGradient>
                </View>
                <Text style={styles.title}>Choisissez votre défi</Text>
                <Text style={styles.subtitle}>
                  Sélectionnez le niveau de difficulté de votre adversaire IA
                </Text>
              </View>

            {/* Cards de difficulté */}
            <View style={styles.cardsContainer}>
              {DIFFICULTIES.map((option, index) => {
                const isSelected = selectedDifficulty === option.value;
                const scaleAnim = useRef(new Animated.Value(0.9)).current;

                useEffect(() => {
                  Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 7,
                    tension: 40,
                    delay: index * 150,
                    useNativeDriver: true,
                  }).start();
                }, [scaleAnim]);

                return (
                  <Animated.View
                    key={option.value}
                    style={[
                      styles.cardWrapper,
                      { transform: [{ scale: scaleAnim }] },
                    ]}
                  >
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => handleSelect(option.value)}
                      style={styles.cardTouchable}
                    >
                      <LinearGradient
                        colors={
                          isSelected
                            ? option.gradient
                            : ['#FFFFFF', '#FAFBFC', '#F5F7FA']
                        }
                        style={[
                          styles.card,
                          isSelected && styles.cardSelected,
                        ]}
                      >
                        {/* Badge sélectionné */}
                        {isSelected && (
                          <View style={styles.selectedBadge}>
                            <LinearGradient
                              colors={['#FFFFFF', '#F0F0F0']}
                              style={styles.selectedBadgeGradient}
                            >
                              <Text style={styles.selectedBadgeText}>✓</Text>
                            </LinearGradient>
                          </View>
                        )}

                        {/* Contenu de la carte */}
                        <View style={styles.cardContent}>
                          {/* Emoji avec background */}
                          <View
                            style={[
                              styles.emojiCircle,
                              {
                                backgroundColor: isSelected
                                  ? 'rgba(255, 255, 255, 0.3)'
                                  : option.lightColor,
                              },
                            ]}
                          >
                            <Text style={styles.cardEmoji}>{option.emoji}</Text>
                          </View>

                          {/* Textes */}
                          <View style={styles.cardTextContainer}>
                            <Text
                              style={[
                                styles.cardTitle,
                                { color: isSelected ? '#FFFFFF' : '#1A202C' },
                              ]}
                            >
                              {option.title}
                            </Text>
                            <Text
                              style={[
                                styles.cardDescription,
                                {
                                  color: isSelected
                                    ? 'rgba(255, 255, 255, 0.95)'
                                    : '#718096',
                                },
                              ]}
                            >
                              {option.description}
                            </Text>
                          </View>

                          {/* Indicateur de difficulté */}
                          <View style={styles.difficultyIndicator}>
                            {[1, 2, 3].map((level) => (
                              <View
                                key={level}
                                style={[
                                  styles.difficultyDot,
                                  {
                                    backgroundColor:
                                      level <=
                                      (option.value === 'easy'
                                        ? 1
                                        : option.value === 'normal'
                                        ? 2
                                        : 3)
                                        ? isSelected
                                          ? '#FFFFFF'
                                          : option.gradient[1]
                                        : isSelected
                                        ? 'rgba(255, 255, 255, 0.3)'
                                        : '#E0E0E0',
                                  },
                                ]}
                              />
                            ))}
                          </View>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>

            {/* Astuce en bas */}
            <View style={styles.tipContainer}>
              <LinearGradient
                colors={['rgba(74, 144, 226, 0.1)', 'rgba(93, 173, 226, 0.05)']}
                style={styles.tipGradient}
              >
                <Text style={styles.tipEmoji}>💡</Text>
                <Text style={styles.tipText}>
                  Vous pourrez changer la difficulté à tout moment dans les paramètres
                </Text>
              </LinearGradient>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  backButton: {
    alignSelf: 'flex-start',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  backButtonGradient: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  backText: {
    fontSize: 16,
    color: '#1976D2',
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  content: {
    paddingHorizontal: 20,
  },
  titleSection: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  emojiContainer: {
    marginBottom: 12,
    shadowColor: '#FFC107',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  emojiGradient: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  titleEmoji: {
    fontSize: 40,
  },
  title: {
    fontSize: SCREEN_WIDTH * 0.07,
    fontWeight: '900',
    color: '#1A202C',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(74, 144, 226, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#718096',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  cardsContainer: {
    gap: 14,
  },
  cardWrapper: {
    marginBottom: 4,
  },
  cardTouchable: {
    borderRadius: 24,
  },
  card: {
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    position: 'relative',
  },
  cardSelected: {
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
    transform: [{ scale: 1.02 }],
  },
  selectedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  selectedBadgeGradient: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBadgeText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#4CAF50',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emojiCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardEmoji: {
    fontSize: 34,
  },
  cardTextContainer: {
    flex: 1,
    paddingRight: 8,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  cardDescription: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  difficultyIndicator: {
    flexDirection: 'column',
    gap: 6,
    marginLeft: 8,
  },
  difficultyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  tipContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  tipGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.2)',
  },
  tipEmoji: {
    fontSize: 20,
    marginRight: 10,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    color: '#4A90E2',
    fontWeight: '600',
    lineHeight: 16,
  },
});

export default DifficultyScreen;
