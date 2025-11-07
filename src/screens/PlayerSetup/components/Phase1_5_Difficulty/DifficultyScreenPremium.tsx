import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AIPersonality, AI_PERSONALITIES } from '../../../../../types/aiPersonality';

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

interface DifficultyScreenPremiumProps {
  selectedPersonality: AIPersonality;
  onSelectPersonality: (personality: AIPersonality) => void;
  onBack: () => void;
}

const DifficultyScreenPremium: React.FC<DifficultyScreenPremiumProps> = ({
  selectedPersonality,
  onSelectPersonality,
  onBack,
}) => {
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const robotAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Robot float animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(robotAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(robotAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow animation
    Animated.loop(
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
      ])
    ).start();
  }, [glowAnim]);

  const robotTranslate = robotAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const personalities: AIPersonality[] = ['aggressive', 'prudent', 'unpredictable', 'perfect'];

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb', '#4facfe']}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Glow effect */}
      <Animated.View
        style={[
          styles.glowContainer,
          { opacity: glowAnim }
        ]}
      >
        <LinearGradient
          colors={['rgba(102, 126, 234, 0.3)', 'transparent', 'rgba(118, 75, 162, 0.3)']}
          style={styles.glowGradient}
        />
      </Animated.View>

      {/* Floating Particles */}
      <View style={styles.particlesContainer}>
        {[...Array(20)].map((_, i) => (
          <FloatingParticle key={i} delay={i * 300} />
        ))}
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Retour</Text>
          </TouchableOpacity>

          <Animated.View style={[styles.robotContainer, { transform: [{ translateY: robotTranslate }] }]}>
            <Text style={styles.robotEmoji}>🤖</Text>
          </Animated.View>

          <Text style={styles.title}>Choisis ton Adversaire</Text>
          <Text style={styles.subtitle}>Chaque IA a sa propre personnalité et stratégie</Text>
        </Animated.View>

        {/* Personality Cards */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {personalities.map((personality, index) => {
            const config = AI_PERSONALITIES[personality];
            const isSelected = selectedPersonality === personality;

            return (
              <PersonalityCard
                key={personality}
                config={config}
                isSelected={isSelected}
                onSelect={() => onSelectPersonality(personality)}
                index={index}
              />
            );
          })}

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

interface PersonalityCardProps {
  config: typeof AI_PERSONALITIES[AIPersonality];
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

const PersonalityCard: React.FC<PersonalityCardProps> = ({
  config,
  isSelected,
  onSelect,
  index,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Stagger entrance
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      delay: index * 120,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (isSelected) {
      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.03,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isSelected]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        {
          transform: [
            { scale: Animated.multiply(scaleAnim, pulseAnim) },
          ],
        },
      ]}
    >
      <TouchableOpacity
        onPress={onSelect}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={
            isSelected
              ? [...config.gradient, config.gradient[1]]
              : ['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']
          }
          style={[
            styles.card,
            isSelected && styles.cardSelected,
          ]}
        >
          {/* Emoji Badge */}
          <View style={styles.emojiContainer}>
            <LinearGradient
              colors={isSelected ? ['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.2)'] : [config.gradient[0], config.gradient[1]]}
              style={styles.emojiBadge}
            >
              <Text style={styles.emoji}>{config.emoji}</Text>
            </LinearGradient>
          </View>

          {/* Content */}
          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>
              {config.name}
            </Text>
            <Text style={[styles.cardDescription, isSelected && styles.cardDescriptionSelected]}>
              {config.description}
            </Text>

            {/* Traits */}
            <View style={styles.traitsContainer}>
              <TraitBar
                label="Agressivité"
                value={config.traits.aggression}
                color={isSelected ? '#FFFFFF' : config.color}
                isSelected={isSelected}
              />
              <TraitBar
                label="Prise de risque"
                value={config.traits.riskTolerance}
                color={isSelected ? '#FFFFFF' : config.color}
                isSelected={isSelected}
              />
              <TraitBar
                label="Consistance"
                value={config.traits.consistency}
                color={isSelected ? '#FFFFFF' : config.color}
                isSelected={isSelected}
              />
              <TraitBar
                label="Optimalité"
                value={config.traits.optimality}
                color={isSelected ? '#FFFFFF' : config.color}
                isSelected={isSelected}
              />
            </View>
          </View>

          {/* Selected Checkmark */}
          {isSelected && (
            <View style={styles.checkmarkContainer}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.checkmark}
              >
                <Text style={styles.checkmarkText}>✓</Text>
              </LinearGradient>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

interface TraitBarProps {
  label: string;
  value: number;
  color: string;
  isSelected?: boolean;
}

const TraitBar: React.FC<TraitBarProps> = ({ label, value, color, isSelected }) => {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(widthAnim, {
      toValue: value,
      tension: 50,
      friction: 7,
      delay: 300,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const width = widthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.traitBar}>
      <Text style={[styles.traitLabel, isSelected && styles.traitLabelSelected]}>{label}</Text>
      <View style={styles.traitBarBg}>
        <Animated.View
          style={[
            styles.traitBarFill,
            {
              width,
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  glowContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  glowGradient: {
    flex: 1,
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ffffff',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  robotContainer: {
    marginBottom: 16,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  robotEmoji: {
    fontSize: 64,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    paddingHorizontal: 32,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  cardWrapper: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'relative',
  },
  cardSelected: {
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  emojiContainer: {
    marginRight: 16,
  },
  emojiBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  emoji: {
    fontSize: 36,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  cardTitleSelected: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  cardDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  cardDescriptionSelected: {
    color: 'rgba(255, 255, 255, 0.95)',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  traitsContainer: {
    gap: 10,
  },
  traitBar: {
    gap: 4,
  },
  traitLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  traitLabelSelected: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  traitBarBg: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  traitBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  checkmark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  checkmarkText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default DifficultyScreenPremium;
