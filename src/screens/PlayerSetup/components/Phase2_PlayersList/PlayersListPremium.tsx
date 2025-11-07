import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Animated,
  useColorScheme,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { Player } from '../../../../types';
import PlayerCardPremium from './PlayerCardPremium';
import { MAX_PLAYERS } from '../../constants';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface PlayersListPremiumProps {
  players: Player[];
  onNameChange: (id: string, name: string) => void;
  onColorPress: (id: string) => void;
  onDeletePlayer: (id: string) => void;
  onAddPlayer: () => void;
  onContinue: () => void;
  onBack: () => void;
  canProceed: boolean;
}

// Floating particles component for background
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

const PlayersListPremium: React.FC<PlayersListPremiumProps> = ({
  players,
  onNameChange,
  onColorPress,
  onDeletePlayer,
  onAddPlayer,
  onContinue,
  onBack,
  canProceed,
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();
  const filledCount = players.filter(p => p.name.length >= 2).length;
  const totalCount = players.length;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const titleScale = useRef(new Animated.Value(0.8)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;

  // Button pulse animation when ready
  useEffect(() => {
    if (canProceed) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(buttonScale, {
            toValue: 1.05,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(buttonScale, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      buttonScale.setValue(1);
    }
  }, [canProceed]);

  useEffect(() => {
    // Glow pulse
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

    // Title entrance
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(titleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(titleScale, {
          toValue: 1,
          tension: 40,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }, 200);

    // Subtitle entrance
    setTimeout(() => {
      Animated.timing(subtitleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 500);
  }, []);

  return (
    <View style={styles.container}>
      {/* Background gradient */}
      <LinearGradient
        colors={
          isDarkMode
            ? ['#0F0C29', '#302B63', '#24243e']
            : ['#667eea', '#764ba2', '#f093fb', '#4facfe']
        }
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Animated background particles */}
      <View style={styles.particlesContainer}>
        {[...Array(12)].map((_, i) => (
          <FloatingParticle key={i} delay={i * 500} />
        ))}
      </View>

      {/* Glow effect */}
      <Animated.View
        style={[
          styles.glowContainer,
          { opacity: glowAnim }
        ]}
      >
        <LinearGradient
          colors={['rgba(102, 126, 234, 0.4)', 'transparent', 'rgba(118, 75, 162, 0.4)']}
          style={styles.glowGradient}
        />
      </Animated.View>

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Header */}
          <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
            <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.8}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.2)']}
                style={styles.backButtonInner}
              >
                <Text style={styles.backIcon}>←</Text>
                <Text style={styles.backText}>Retour</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Progress Badge */}
            <View style={styles.progressBadge}>
              <LinearGradient
                colors={filledCount === totalCount ? ['#10B981', '#059669'] : ['rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0.25)']}
                style={styles.progressGradient}
              >
                <Text style={styles.progressText}>{filledCount}/{totalCount}</Text>
              </LinearGradient>
            </View>
          </View>

          {/* Title Section */}
          <Animated.View
            style={[
              styles.titleSection,
              {
                opacity: titleAnim,
                transform: [
                  {
                    translateY: titleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-30, 0],
                    })
                  },
                  { scale: titleScale },
                ],
              }
            ]}
          >
            <View style={styles.titleContainer}>
              <Text style={[styles.title, styles.titleGlow]}>Qui sont les joueurs ?</Text>
              <Text style={styles.title}>Qui sont les joueurs ?</Text>
            </View>
            <Animated.Text
              style={[
                styles.subtitle,
                { opacity: subtitleAnim }
              ]}
            >
              ✨ Personnalisez le nom et la couleur de chaque joueur ✨
            </Animated.Text>
          </Animated.View>

          {/* Players List */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {players.map((player, index) => (
              <PlayerCardPremium
                key={player.id}
                player={player}
                index={index}
                onNameChange={onNameChange}
                onColorPress={onColorPress}
                onDelete={onDeletePlayer}
                canDelete={players.length > 1}
              />
            ))}

            {/* Add Player Button */}
            {players.length < MAX_PLAYERS && (
              <TouchableOpacity
                onPress={onAddPlayer}
                style={styles.addPlayerButton}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']}
                  style={styles.addPlayerGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.addPlayerIcon}>
                    <LinearGradient
                      colors={['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.25)']}
                      style={styles.addPlayerIconGradient}
                    >
                      <Text style={styles.addPlayerPlus}>+</Text>
                    </LinearGradient>
                  </View>
                  <Text style={styles.addPlayerText}>Ajouter un joueur</Text>
                  <Text style={styles.addPlayerCount}>
                    ({players.length}/{MAX_PLAYERS})
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}

            {/* Bottom spacing */}
            <View style={{ height: 160 }} />
          </ScrollView>

          {/* Continue Button - Fixed at bottom */}
          <View style={[styles.bottomSection, { paddingBottom: Math.max(insets.bottom, 20) }]}>
            <Animated.View style={{ transform: [{ scale: canProceed ? buttonScale : 1 }] }}>
              <TouchableOpacity
                onPress={onContinue}
                disabled={!canProceed}
                activeOpacity={0.85}
                style={styles.continueButton}
              >
                <LinearGradient
                  colors={canProceed ? ['#667eea', '#764ba2', '#f093fb'] : ['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.2)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.continueGradient}
                >
                  <View style={styles.continueContent}>
                    <Text style={[styles.continueText, !canProceed && styles.continueTextDisabled]}>
                      {canProceed ? 'Continuer' : 'Remplissez tous les noms'}
                    </Text>
                    {canProceed && <Text style={styles.continueArrow}>→</Text>}
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Helper text */}
            {!canProceed && (
              <Animated.Text
                style={[
                  styles.helperText,
                  {
                    opacity: subtitleAnim,
                  }
                ]}
              >
                {filledCount === 0
                  ? '💡 Tapez pour renseigner les noms'
                  : `✨ Plus que ${totalCount - filledCount} nom${totalCount - filledCount > 1 ? 's' : ''} !`}
              </Animated.Text>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  particlesContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ffffff',
  },
  glowContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  glowGradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 'auto',
  },
  backButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  backIcon: {
    fontSize: 22,
    color: '#FFFFFF',
  },
  backText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  progressBadge: {
    marginLeft: 16,
  },
  progressGradient: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    ...Platform.select({
      ios: {
        shadowColor: '#ffffff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  progressText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  titleSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignItems: 'center',
  },
  titleContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -1.2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  titleGlow: {
    position: 'absolute',
    color: '#FFFFFF',
    opacity: 0.5,
    textShadowColor: '#ffffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    lineHeight: 22,
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  addPlayerButton: {
    marginTop: 16,
    marginBottom: 8,
  },
  addPlayerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderStyle: 'dashed',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  addPlayerIcon: {
    marginRight: 14,
  },
  addPlayerIconGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  addPlayerPlus: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  addPlayerText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  addPlayerCount: {
    fontSize: 15,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopWidth: 0,
  },
  continueButton: {
    marginBottom: 14,
  },
  continueGradient: {
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...Platform.select({
      ios: {
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  continueContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 22,
  },
  continueText: {
    fontSize: 19,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  continueTextDisabled: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  continueArrow: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  helperText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});

export default PlayersListPremium;
